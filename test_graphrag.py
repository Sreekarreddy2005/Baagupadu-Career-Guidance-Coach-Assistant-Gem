import asyncio
from backend.database import AsyncSessionLocal
from sqlalchemy.future import select
from backend.models import User, Conversation, Message, MemoryNode, MemoryEdge, ProfileState
from backend.agent.agents.extractor_agent import ExtractorAgent

import uuid

async def test_graph_rag():
    print("Testing GraphRAG Extractor...")
    async with AsyncSessionLocal() as db:
        # Create dummy user and conversation
        user_id = f"test_user_graph_{uuid.uuid4()}"
        user = User(id=user_id)
        db.add(user)
        await db.flush()
        
        conv = Conversation(user_id=user.id)
        db.add(conv)
        await db.flush()
        
        prof = ProfileState(conversation_id=conv.id)
        db.add(prof)
        await db.flush()
        
        # Create test messages
        msg1 = Message(conversation_id=conv.id, role="user", content="I really want to be a software engineer, but I'm terrible at math.")
        msg2 = Message(conversation_id=conv.id, role="ai", content="That's a very common feeling! Why do you think math is holding you back?")
        db.add_all([msg1, msg2])
        await db.commit()
        
        # Invoke extractor
        print("Invoking Extractor...")
        extractor = ExtractorAgent()
        
        from langchain_core.messages import HumanMessage, AIMessage
        state = {
            "messages": [HumanMessage(content=msg1.content), AIMessage(content=msg2.content)],
            "db_session": db,
            "profile": {"user_id": user.id, "conversation_id": conv.id}
        }
        
        result = await extractor.invoke(state)
        print("Extraction complete.")
        
        # Verify graph
        nodes_res = await db.execute(select(MemoryNode).where(MemoryNode.user_id == user.id))
        nodes = nodes_res.scalars().all()
        print(f"\nExtracted {len(nodes)} Nodes:")
        for n in nodes:
            print(f"- {n.name}")
            
        edges_res = await db.execute(select(MemoryEdge).where(MemoryEdge.user_id == user.id))
        edges = edges_res.scalars().all()
        print(f"\nExtracted {len(edges)} Edges:")
        for e in edges:
            source = next(n for n in nodes if n.id == e.source_id)
            target = next(n for n in nodes if n.id == e.target_id)
            print(f"- [{source.name}] -> {e.relation} -> [{target.name}]")

if __name__ == "__main__":
    asyncio.run(test_graph_rag())
