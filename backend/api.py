import os
import sys
import json
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc
from sqlalchemy.orm.attributes import flag_modified
from sqlalchemy.sql import func

from backend.core.config import config
from backend.database import get_db, init_db
from backend.models import User, ProfileState, Conversation, Message, LongTermMemory
from backend.agent.sahayam_engine import SahayamAgent


app = FastAPI(title="Baagupadu AI Coach API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

agent = None

@app.on_event("startup")
async def startup_event():
    global agent
    try:
        await init_db()
        print("✅ Database tables created/verified.")
        agent = SahayamAgent()
        print("✅ Sahayam Agent initialized.")
    except Exception as e:
        print(f"❌ Failed to initialize: {e}")

from backend.auth import verify_token

# ----- ENDPOINTS -----

@app.get("/api/profile")
async def get_profile(user_id: str = Depends(verify_token), db: AsyncSession = Depends(get_db)):
    # Ensure user exists
    user_result = await db.execute(select(User).where(User.id == user_id))
    user = user_result.scalars().first()
    if not user:
        user = User(id=user_id)
        db.add(user)
        await db.commit()

    # Get active or create conversation
    conv_result = await db.execute(
        select(Conversation).where(Conversation.user_id == user_id).order_by(Conversation.start_time.desc()).limit(1)
    )
    conversation = conv_result.scalars().first()

    if not conversation:
        conversation = Conversation(user_id=user_id)
        db.add(conversation)
        await db.commit()
        await db.refresh(conversation)

    # Get or create profile state for this conversation
    result = await db.execute(select(ProfileState).where(ProfileState.conversation_id == conversation.id))
    profile = result.scalars().first()
    
    if not profile:
        profile = ProfileState(conversation_id=conversation.id)
        db.add(profile)
        await db.commit()
        await db.refresh(profile)

    # Fetch recent conversations for the sidebar
    conv_history_result = await db.execute(
        select(Conversation)
        .where(Conversation.user_id == user_id)
        .order_by(Conversation.start_time.desc())
        .limit(10)
    )
    conversations = conv_history_result.scalars().all()
    
    sessions_dict = {}
    for conv in conversations:
        # Fetch messages for this conversation
        msg_result = await db.execute(
            select(Message)
            .where(Message.conversation_id == conv.id)
            .order_by(Message.timestamp.asc())
        )
        msgs = msg_result.scalars().all()
        sessions_dict[str(conv.id)] = {
            "title": f"Chat {conv.start_time.strftime('%b %d')}",
            "messages": [{"role": m.role, "content": m.content, "timestamp": m.timestamp.isoformat()} for m in msgs]
        }

    return {
        "user_id": user_id,
        "conversation_id": conversation.id,
        "session_progress": profile.session_progress,
        "life_stage_data": profile.life_stage_data,
        "persona": profile.persona,
        "guidance": profile.guidance,
        "conversation_memory": {
            "sessions": sessions_dict
        }
    }

class ChatRequest(BaseModel):
    message: str
    session_id: str = "default"

@app.post("/api/chat")
async def chat(request: ChatRequest, user_id: str = Depends(verify_token), db: AsyncSession = Depends(get_db)):
    global agent
    if not agent:
        return {"response": "Error: Agent not initialized properly."}

    # 1. Get active conversation
    conv_result = await db.execute(
        select(Conversation).where(Conversation.user_id == user_id).order_by(Conversation.start_time.desc()).limit(1)
    )
    conversation = conv_result.scalars().first()
    if not conversation:
        conversation = Conversation(user_id=user_id)
        db.add(conversation)
        await db.commit()
        await db.refresh(conversation)

    # 2. Fetch short-term state tied to conversation
    result = await db.execute(select(ProfileState).where(ProfileState.conversation_id == conversation.id))
    db_profile = result.scalars().first()
    if not db_profile:
        db_profile = ProfileState(conversation_id=conversation.id)
        db.add(db_profile)
        await db.commit()
        await db.refresh(db_profile)

    # 3. Save User Message
    user_msg = Message(conversation_id=conversation.id, role="user", content=request.message)
    db.add(user_msg)
    await db.commit()

    # Pass dict state to agent
    profile_dict = {
        "user_id": user_id, # Still needed for some fallback if any
        "conversation_id": conversation.id,
        "session_progress": db_profile.session_progress or {},
        "life_stage_data": db_profile.life_stage_data or {},
        "persona": db_profile.persona or {},
        "guidance": db_profile.guidance or {},
    }

    try:
        # The agent internally fetches context via pgvector and saves new insights
        response = await agent.chat_async(request.message, profile_dict, request.session_id, db)
        
        current_phase = profile_dict.get("session_progress", {}).get("current_phase", "trust")
        chat_completed = profile_dict.get("session_progress", {}).get("completed", False)

        # 4. Update short-term profile state
        db_profile.session_progress = dict(profile_dict.get("session_progress", {}))
        db_profile.persona = dict(profile_dict.get("persona", {}))
        db_profile.guidance = dict(profile_dict.get("guidance", {}))
        
        flag_modified(db_profile, "session_progress")
        flag_modified(db_profile, "persona")
        flag_modified(db_profile, "guidance")
        
        # 5. Save AI Message
        ai_msg = Message(conversation_id=conversation.id, role="ai", content=response)
        db.add(ai_msg)
        
        db.add(db_profile)
        await db.commit()

        return {
            "response": response,
            "current_phase": current_phase,
            "chat_completed": chat_completed,
        }
    except Exception as e:
        import traceback
        err = traceback.format_exc()
        print(f"Chat Error: {err}")
        return {"response": f"Error processing request: {str(e)}"}

class DemographicsRequest(BaseModel):
    full_name: str
    location: str
    age_range: str
    current_status: str
    desired_role: str
    primary_goal: str

@app.post("/api/profile/demographics")
async def update_demographics(request: DemographicsRequest, user_id: str = Depends(verify_token), db: AsyncSession = Depends(get_db)):
    conv_result = await db.execute(
        select(Conversation).where(Conversation.user_id == user_id).order_by(Conversation.start_time.desc()).limit(1)
    )
    conversation = conv_result.scalars().first()
    if not conversation:
        conversation = Conversation(user_id=user_id)
        db.add(conversation)
        await db.commit()
        await db.refresh(conversation)

    result = await db.execute(select(ProfileState).where(ProfileState.conversation_id == conversation.id))
    db_profile = result.scalars().first()
    if not db_profile:
        db_profile = ProfileState(conversation_id=conversation.id)
        db.add(db_profile)
        await db.commit()
        await db.refresh(db_profile)
        
    life_stage_data = dict(db_profile.life_stage_data or {})
    life_stage_data["demographics"] = {
        "full_name": request.full_name,
        "location": request.location,
        "age_range": request.age_range,
        "current_status": request.current_status,
        "desired_role": request.desired_role,
        "primary_goal": request.primary_goal
    }
    
    db_profile.life_stage_data = life_stage_data
    flag_modified(db_profile, "life_stage_data")
    db.add(db_profile)
    await db.commit()
    
    return {"status": "success", "demographics": life_stage_data["demographics"]}

@app.post("/api/reset")
async def reset_chat(user_id: str = Depends(verify_token), db: AsyncSession = Depends(get_db)):
    # Close any active conversation for this user
    conv_result = await db.execute(
        select(Conversation).where(Conversation.user_id == user_id, Conversation.end_time.is_(None))
    )
    active_conversations = conv_result.scalars().all()
    for conv in active_conversations:
        conv.end_time = func.now()
        db.add(conv)
        
    # Create new conversation
    new_conv = Conversation(user_id=user_id)
    db.add(new_conv)
    await db.commit()
    await db.refresh(new_conv)
    
    # Create new profile state for this new conversation
    new_profile = ProfileState(conversation_id=new_conv.id)
    db.add(new_profile)
    await db.commit()
        
    return {"status": "success", "message": "Conversation context cleared and restarted"}

@app.get("/api/roadmap")
async def get_roadmap(user_id: str = Depends(verify_token), db: AsyncSession = Depends(get_db)):
    conv_result = await db.execute(
        select(Conversation).where(Conversation.user_id == user_id).order_by(Conversation.start_time.desc()).limit(1)
    )
    conversation = conv_result.scalars().first()
    if not conversation:
        return {"roadmap": {}}
        
    result = await db.execute(select(ProfileState).where(ProfileState.conversation_id == conversation.id))
    profile = result.scalars().first()
    
    if not profile or not profile.guidance:
        return {"roadmap": {}}
    return {"roadmap": profile.guidance.get("roadmap", {})}

@app.get("/api/dashboard")
async def get_dashboard(user_id: str = Depends(verify_token), db: AsyncSession = Depends(get_db)):
    conv_result = await db.execute(
        select(Conversation).where(Conversation.user_id == user_id).order_by(Conversation.start_time.desc()).limit(1)
    )
    conversation = conv_result.scalars().first()
    if not conversation:
        return {"metrics": {}}
        
    result = await db.execute(select(ProfileState).where(ProfileState.conversation_id == conversation.id))
    profile = result.scalars().first()
    
    if not profile:
        return {"metrics": {}}
        
    # Calculate some dynamic metrics for the UI based on session_progress
    progress = profile.session_progress or {}
    metrics = {
        "trust_score": progress.get("trust_score", 0),
        "empathy_alignment": progress.get("empathy_alignment", 85), 
        "clarity_index": len(profile.persona.get("traits_uncovered", [])) * 10
    }
    return {"metrics": metrics}
