from dotenv import load_dotenv
load_dotenv("backend/.env")
import asyncio
from backend.agent.sahayam_engine import SahayamAgent
from backend.database import AsyncSessionLocal

async def main():
    agent = SahayamAgent()
    async with AsyncSessionLocal() as db:
        profile_dict = {
            "user_id": "test_user",
            "conversation_id": 1,
            "session_progress": {},
            "life_stage_data": {},
            "persona": {},
            "guidance": {}
        }
        res = await agent.chat_async("Hello, how are you?", profile_dict, "default", db)
        print("Response:", res)

asyncio.run(main())
