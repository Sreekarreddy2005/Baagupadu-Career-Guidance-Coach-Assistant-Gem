import os
import datetime
from sqlalchemy.future import select
from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from backend.core.llm_factory import get_llm
from backend.models import Conversation, Message
from backend.database import AsyncSessionLocal

class SubconsciousAgent:
    """
    Runs in the background (e.g. 3 AM cron) to process a conversation and send a proactive check-in.
    """
    def __init__(self):
        self.llm = get_llm(purpose="chat")
        
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", 
             "You are the Subconscious Engine for Sahayam (a warm, human-like AI companion). "
             "The user has been away for a while. You are 'waking up' and thinking about them. "
             "Read the recent chat history and identify their biggest unresolved anxiety, fear, or blocker. "
             "Write a single, proactive text message (2-3 sentences max) to send to them. "
             "Start with something like 'Hey, I was thinking about what you said...' or 'Just checking in...'. "
             "Be extremely warm and friendly. DO NOT ask more than one question. Do not sound like a robot."
            ),
            ("human", "Recent Chat History:\n{history}")
        ])

    async def trigger(self, user_id: str) -> str:
        async with AsyncSessionLocal() as db:
            # Get latest conversation for this user
            conv_result = await db.execute(
                select(Conversation)
                .where(Conversation.user_id == user_id, Conversation.end_time.is_(None))
                .order_by(Conversation.start_time.desc())
                .limit(1)
            )
            conversation = conv_result.scalars().first()
            if not conversation:
                return "No active conversation found."

            # Get last 10 messages
            msg_result = await db.execute(
                select(Message)
                .where(Message.conversation_id == conversation.id)
                .order_by(Message.timestamp.desc())
                .limit(10)
            )
            messages = list(reversed(msg_result.scalars().all()))
            
            if not messages:
                return "Conversation is empty."

            history_str = "\n".join([f"{m.role.upper()}: {m.content}" for m in messages])

            # Generate proactive message
            chain = self.prompt | self.llm
            response = await chain.ainvoke({"history": history_str})
            ai_text = response.content

            # Save the message to DB
            ai_msg = Message(conversation_id=conversation.id, role="ai", content=ai_text)
            db.add(ai_msg)
            await db.commit()
            
            print(f"Subconscious Agent generated message: {ai_text}", flush=True)
            return ai_text
