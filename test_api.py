import asyncio
from backend.database import AsyncSessionLocal
from backend.api import chat, ChatRequest

async def main():
    async with AsyncSessionLocal() as db:
        req = ChatRequest(message="Hello", session_id="test")
        try:
            res = await chat(req, "test_user_1", db)
            print("SUCCESS:", res)
        except Exception as e:
            import traceback
            traceback.print_exc()

asyncio.run(main())
