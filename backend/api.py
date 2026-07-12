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

class ChatRequest(BaseModel):
    message: str

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
async def chat(request: ChatRequest):
    global agent
    if not agent:
        return {"response": "Error: Agent not initialized properly."}
    
    try:
        response = agent.chat(request.message)
        return {"response": response}
    except Exception as e:
        return {"response": f"Error: {e}"}

if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
