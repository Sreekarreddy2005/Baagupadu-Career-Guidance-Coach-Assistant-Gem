import sys
import os
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import uvicorn
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.agent.sahayam_engine import SahayamAgent
from backend.auth import verify_token
from backend.database import engine, get_db, Base, init_db
from backend.models import User, ProfileState, Conversation, Message, LongTermMemory
from backend.core.report_generator import create_persona_docx
from sqlalchemy.orm.attributes import flag_modified

app = FastAPI(title="Sahayam Backend API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    session_id: str

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

@app.get("/api/profile")
async def get_profile(user_id: str = Depends(verify_token), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ProfileState).where(ProfileState.user_id == user_id))
    profile = result.scalars().first()

    if not profile:
        # Ensure user exists
        user_result = await db.execute(select(User).where(User.id == user_id))
        user = user_result.scalars().first()
        if not user:
            user = User(id=user_id)
            db.add(user)
        
        profile = ProfileState(user_id=user_id)
        db.add(profile)
        await db.commit()
        await db.refresh(profile)

    return {
        "user_id": profile.user_id,
        "session_progress": profile.session_progress,
        "life_stage_data": profile.life_stage_data,
        "persona": profile.persona,
        "guidance": profile.guidance,
    }

@app.post("/api/chat")
async def chat(request: ChatRequest, user_id: str = Depends(verify_token), db: AsyncSession = Depends(get_db)):
    global agent
    if not agent:
        return {"response": "Error: Agent not initialized properly."}

    # 1. Fetch short-term state
    result = await db.execute(select(ProfileState).where(ProfileState.user_id == user_id))
    db_profile = result.scalars().first()
    if not db_profile:
        raise HTTPException(status_code=404, detail="Profile not found.")

    # 2. Get active conversation or create one
    conv_result = await db.execute(
        select(Conversation).where(Conversation.user_id == user_id).order_by(Conversation.start_time.desc()).limit(1)
    )
    conversation = conv_result.scalars().first()
    if not conversation or conversation.end_time:
        conversation = Conversation(user_id=user_id)
        db.add(conversation)
        await db.commit()
        await db.refresh(conversation)

    # 3. Save User Message
    user_msg = Message(conversation_id=conversation.id, role="user", content=request.message)
    db.add(user_msg)
    await db.commit()

    # Pass dict state to agent
    profile_dict = {
        "user_id": db_profile.user_id,
        "conversation_id": conversation.id,
        "session_progress": db_profile.session_progress or {},
        "life_stage_data": db_profile.life_stage_data or {},
        "persona": db_profile.persona or {},
        "guidance": db_profile.guidance or {},
    }

    try:
        # The agent internally fetches context via pgvector and saves new insights
        response = await agent.chat_async(request.message, profile_dict, request.session_id, db)
        
        current_phase = profile_dict.get("session_progress", {}).get("current_phase", "discovery")
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
        print(f"Chat Error: {e}")
        return {"response": f"Error processing request"}

@app.post("/api/reset")
async def reset_chat(user_id: str = Depends(verify_token), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ProfileState).where(ProfileState.user_id == user_id))
    db_profile = result.scalars().first()
    
    if db_profile:
        demographics = db_profile.life_stage_data.get("demographics") if db_profile.life_stage_data else None
        db_profile.session_progress = {}
        db_profile.life_stage_data = {"demographics": demographics} if demographics else {}
        db_profile.persona = {}
        db_profile.guidance = {}
        
        flag_modified(db_profile, "session_progress")
        flag_modified(db_profile, "life_stage_data")
        flag_modified(db_profile, "persona")
        flag_modified(db_profile, "guidance")
        
        db.add(db_profile)
        await db.commit()
        
    return {"status": "success"}

class DemographicsRequest(BaseModel):
    full_name: str
    location: str
    age_range: str
    current_status: str
    desired_role: str
    primary_goal: str

@app.post("/api/profile/demographics")
async def update_demographics(request: DemographicsRequest, user_id: str = Depends(verify_token), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ProfileState).where(ProfileState.user_id == user_id))
    db_profile = result.scalars().first()
    
    if not db_profile:
        raise HTTPException(status_code=404, detail="Profile not found.")
        
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

@app.get("/api/generate-report")
async def generate_report(user_id: str = Depends(verify_token), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ProfileState).where(ProfileState.user_id == user_id))
    db_profile = result.scalars().first()
    
    if not db_profile:
        raise HTTPException(status_code=404, detail="Profile not found.")
        
    profile_dict = {
        "life_stage_data": db_profile.life_stage_data or {},
        "persona": db_profile.persona or {},
        "guidance": db_profile.guidance or {},
    }
    
    file_stream = create_persona_docx(profile_dict)
    
    headers = {
        'Content-Disposition': 'attachment; filename="baagupadu_report.docx"'
    }
    
    return StreamingResponse(
        iter([file_stream.getvalue()]), 
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers=headers
    )

if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
