import asyncio
from backend.agent.sahayam_engine import SahayamAgent
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
import uuid

async def test_agent():
    print("Initializing Agent Engine...")
    engine = SahayamAgent()
    
    # Mock profile
    profile = {
        "conversation_id": str(uuid.uuid4()),
        "user_id": str(uuid.uuid4()),
        "session_progress": {"current_phase": "trust"}
    }
    
    # Dummy DB session
    class DummyDB:
        async def execute(self, *args, **kwargs):
            class DummyResult:
                def scalars(self):
                    class DummyScalars:
                        def all(self):
                            return []
                    return DummyScalars()
            return DummyResult()
        async def commit(self): pass
        async def add(self, *args): pass
        async def refresh(self, *args): pass
        def add_all(self, *args): pass

    dummy_db = DummyDB()
    
    print("\n--- TEST 1: TOOL USE (DuckDuckGo Search) ---")
    user_input = "What is the current average salary of a Data Scientist in 2026?"
    print(f"User: {user_input}")
    response = await engine.chat_async(user_input, profile, profile["conversation_id"], dummy_db)
    print(f"AI: {response}\n")

    print("\n--- TEST 2: REACT LOOP (Deflection) ---")
    user_input = "Stop asking me questions. I'm frustrated and I don't want to talk about this."
    print(f"User: {user_input}")
    response = await engine.chat_async(user_input, profile, profile["conversation_id"], dummy_db)
    print(f"AI: {response}\n")

if __name__ == "__main__":
    asyncio.run(test_agent())
