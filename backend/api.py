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

from fastapi import Depends
from backend.auth import verify_token

class ChatRequest(BaseModel):
    message: str
    profile: dict  # The user_profile_schema.json data from frontend IndexedDB

# Create a global instance of the agent for now (MVP state management)
agent = None

@app.on_event("startup")
async def startup_event():
    global agent
    try:
        agent = SahayamAgent()
        print("✅ Sahayam Agent initialized.")
    except Exception as e:
        print(f"❌ Failed to initialize Sahayam Agent: {e}")

@app.post("/api/chat")
async def chat(request: ChatRequest, user_id: str = Depends(verify_token)):
    global agent
    if not agent:
        return {"response": "Error: Agent not initialized properly."}
    
    # Ensure the user_id from the token matches the profile if user_id is in profile
    # (Optional sanity check)
    if request.profile.get("user_id") and request.profile.get("user_id") != user_id:
        return {"response": "Error: Token user_id does not match profile user_id."}
        
    # Inject user_id if not present
    request.profile["user_id"] = user_id

    try:
        response = agent.chat(request.message, request.profile)
        return {"response": response}
    except Exception as e:
        return {"response": f"Error: {e}"}

if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
