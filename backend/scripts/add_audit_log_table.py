import asyncio
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.database import engine
from backend.models import AuditLog

async def add_table():
    async with engine.begin() as conn:
        print("Creating AuditLog table...")
        await conn.run_sync(AuditLog.__table__.create, checkfirst=True)
    print("Table created successfully!")

if __name__ == "__main__":
    asyncio.run(add_table())
