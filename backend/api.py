import sys
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.agent.sahayam_engine import SahayamAgent

app = FastAPI(title="Sahayam Backend API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi import Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from backend.auth import verify_token
from backend.database import engine, get_db, Base
from backend.models import User, UserProfile

class ChatRequest(BaseModel):
    message: str

# Create a global instance of the agent for now (MVP state management)
agent = None

@app.on_event("startup")
async def startup_event():
    global agent
    try:
        # Initialize Database Tables
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        print("✅ Database tables created/verified.")

        agent = SahayamAgent()
        print("✅ Sahayam Agent initialized.")
    except Exception as e:
        print(f"❌ Failed to initialize: {e}")

@app.get("/api/profile")
async def get_profile(user_id: str = Depends(verify_token), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(UserProfile).where(UserProfile.user_id == user_id))
    profile = result.scalars().first()

    if not profile:
        # Ensure user exists in users table first
        user_result = await db.execute(select(User).where(User.id == user_id))
        user = user_result.scalars().first()
        if not user:
            user = User(id=user_id)
            db.add(user)
        
        # Create an empty default profile
        profile = UserProfile(user_id=user_id)
        db.add(profile)
        await db.commit()
        await db.refresh(profile)

    return {
        "user_id": profile.user_id,
        "session_progress": profile.session_progress,
        "life_stage_data": profile.life_stage_data,
        "inferences": profile.inferences,
        "patterns": profile.patterns,
        "persona": profile.persona,
        "guidance": profile.guidance,
        "conversation_memory": profile.conversation_memory,
    }

from sqlalchemy.orm.attributes import flag_modified

@app.post("/api/chat")
async def chat(request: ChatRequest, user_id: str = Depends(verify_token), db: AsyncSession = Depends(get_db)):
    global agent
    if not agent:
        return {"response": "Error: Agent not initialized properly."}

    # Fetch user profile from DB
    result = await db.execute(select(UserProfile).where(UserProfile.user_id == user_id))
    db_profile = result.scalars().first()
    
    if not db_profile:
        raise HTTPException(status_code=404, detail="Profile not found. Call /api/profile first.")

    # Convert DB model to dict for the agent
    profile_dict = {
        "user_id": db_profile.user_id,
        "session_progress": db_profile.session_progress or {},
        "life_stage_data": db_profile.life_stage_data or {},
        "inferences": db_profile.inferences or {},
        "patterns": db_profile.patterns or {},
        "persona": db_profile.persona or {},
        "guidance": db_profile.guidance or {},
        "conversation_memory": db_profile.conversation_memory or {},
    }

    try:
        response = agent.chat(request.message, profile_dict)
        
        # Save updated profile back to DB by assigning shallow copies
        # and explicitly flagging as modified for SQLAlchemy JSON columns
        db_profile.session_progress = dict(profile_dict.get("session_progress", {}))
        db_profile.life_stage_data = dict(profile_dict.get("life_stage_data", {}))
        db_profile.inferences = dict(profile_dict.get("inferences", {}))
        db_profile.patterns = dict(profile_dict.get("patterns", {}))
        db_profile.persona = dict(profile_dict.get("persona", {}))
        db_profile.guidance = dict(profile_dict.get("guidance", {}))
        db_profile.conversation_memory = dict(profile_dict.get("conversation_memory", {}))
        
        flag_modified(db_profile, "session_progress")
        flag_modified(db_profile, "life_stage_data")
        flag_modified(db_profile, "inferences")
        flag_modified(db_profile, "patterns")
        flag_modified(db_profile, "persona")
        flag_modified(db_profile, "guidance")
        flag_modified(db_profile, "conversation_memory")
        
        db.add(db_profile)
        await db.commit()

        return {"response": response}
    except Exception as e:
        print(f"Chat Error: {e}")
        return {"response": f"Error processing request"}

@app.post("/api/reset")
async def reset_chat(user_id: str = Depends(verify_token), db: AsyncSession = Depends(get_db)):
    global agent
    if agent:
        agent.chat_history = []
        
    result = await db.execute(select(UserProfile).where(UserProfile.user_id == user_id))
    db_profile = result.scalars().first()
    
    if db_profile:
        # Preserve demographics!
        demographics = db_profile.life_stage_data.get("demographics") if db_profile.life_stage_data else None
        
        db_profile.session_progress = {}
        db_profile.life_stage_data = {"demographics": demographics} if demographics else {}
        db_profile.inferences = {}
        db_profile.patterns = {}
        db_profile.persona = {}
        db_profile.guidance = {}
        db_profile.conversation_memory = {}
        
        flag_modified(db_profile, "session_progress")
        flag_modified(db_profile, "life_stage_data")
        flag_modified(db_profile, "inferences")
        flag_modified(db_profile, "patterns")
        flag_modified(db_profile, "persona")
        flag_modified(db_profile, "guidance")
        flag_modified(db_profile, "conversation_memory")
        
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
    result = await db.execute(select(UserProfile).where(UserProfile.user_id == user_id))
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

if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
