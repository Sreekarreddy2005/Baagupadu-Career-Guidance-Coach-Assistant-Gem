import asyncio
from backend.database import engine, Base
from backend.models import User, Conversation, Message, ProfileState, LongTermMemory, KnowledgeBaseChunk, MemoryNode, MemoryEdge
import sys
import os

# Add project root to python path to resolve imports correctly
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

async def run_migration():
    async with engine.begin() as conn:
        print("Dropping tables...")
        await conn.run_sync(Base.metadata.drop_all)
        print("Recreating tables with new schema...")
        await conn.run_sync(Base.metadata.create_all)
    print("Migration complete!")

if __name__ == "__main__":
    asyncio.run(run_migration())
