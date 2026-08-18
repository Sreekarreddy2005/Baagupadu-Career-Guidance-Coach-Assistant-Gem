import asyncio
from backend.database import AsyncSessionLocal
from sqlalchemy.future import select
from backend.models import User
from backend.agent.agents.subconscious_agent import SubconsciousAgent

async def test():
    print("Testing Subconscious Agent...")
    async with AsyncSessionLocal() as db:
        user = await db.scalar(select(User).limit(1))
        if not user:
            print("No users found in database.")
            return
        print(f"Triggering for user {user.id}...")
        
    agent = SubconsciousAgent()
    result = await agent.trigger(user.id)
    print(f"\nResult: {result}")

if __name__ == "__main__":
    asyncio.run(test())
