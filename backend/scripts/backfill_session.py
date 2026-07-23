import asyncio
import json
import json_repair
import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.future import select
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).parent.parent.parent))
from backend.models import ProfileState, Message, Conversation
from backend.core.config import config
from backend.core.llm_factory import get_llm
from langchain_core.messages import SystemMessage
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / '.env')

async def main():
    engine = create_async_engine(os.getenv('DATABASE_URL'), echo=False)
    async_session = sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)
    
    async with async_session() as db:
        print("🔍 Searching for active profiles...")
        # Get the first ProfileState
        result = await db.execute(select(ProfileState))
        profile = result.scalars().first()
        
        if not profile:
            print("❌ No profiles found in the database.")
            return
            
        print(f"👤 Found Profile for User: {profile.user_id}")
        
        # Get messages from their latest conversation
        conv_result = await db.execute(
            select(Conversation)
            .where(Conversation.user_id == profile.user_id)
            .order_by(Conversation.start_time.desc())
        )
        conversation = conv_result.scalars().first()
        
        if not conversation:
            print("❌ No conversations found for this user.")
            return
            
        msg_result = await db.execute(
            select(Message)
            .where(Message.conversation_id == conversation.id)
            .order_by(Message.timestamp)
        )
        messages = msg_result.scalars().all()
        
        if not messages:
            print("❌ No messages found in the conversation.")
            return
            
        history_str = "\n".join([f"{m.role}: {m.content}" for m in messages])
        logic_llm = get_llm(purpose="logic")
        
        needs_commit = False
        
        # 1. Backfill Persona
        persona_dict = profile.persona or {}
        if True:
            print("🧠 Generating missing Persona JSON using AWS Bedrock...")
            prompt = (
                "You are the Backend AI Evaluator for the Baagupadu career coach.\n"
                "The conversation has reached the 'Synthesis' phase.\n"
                "Based on the following user conversation history, generate their deep Persona Profile.\n"
                "Output ONLY valid JSON matching this structure exactly:\n"
                "{\n"
                '  "core_identity": {\n'
                '    "archetype_name": "E.g. The Empathetic Innovator",\n'
                '    "tagline": "A short, inspiring 1-sentence quote",\n'
                '    "description": "Short paragraph summarizing their core identity",\n'
                '    "description_for_user": "A highly compassionate, direct message to the user explaining who they are"\n'
                '  },\n'
                '  "strengths": [{"trait": "Specific Strength", "evidence": "Quote or reason from chat"}],\n'
                '  "growth_areas": [{"area": "Specific Area", "compassionate_framing": "Positive framing of this gap"}]\n'
                "}\n\n"
                "Conversation History:\n" + history_str
            )
            response = await logic_llm.ainvoke([SystemMessage(content=prompt)])
            eval_content = response.content
            s_idx, e_idx = eval_content.find('{'), eval_content.rfind('}')
            if s_idx != -1 and e_idx != -1:
                try:
                    new_persona = json_repair.loads(eval_content[s_idx:e_idx+1])
                    new_persona["traits_uncovered"] = persona_dict.get("traits_uncovered", [])
                    profile.persona = new_persona
                    needs_commit = True
                    print("✅ Persona successfully generated!")
                except json.JSONDecodeError as e:
                    print(f"❌ Failed to parse Persona JSON: {e}")
        else:
            print("✅ Persona already exists.")

        # 2. Backfill Roadmap
        guidance_dict = profile.guidance or {}
        if True:
            print("🧭 Generating missing Career Roadmap JSON using AWS Bedrock...")
            prompt = (
                "You are the Backend AI Evaluator for the Baagupadu career coach.\n"
                "The conversation has reached the 'Guidance' phase.\n"
                "Based on the user's Persona and chat history, generate a highly detailed, 3-stage Career Roadmap.\n"
                "You MUST provide 3 timelines exactly: 'Immediate', '6-Month', and '1-Year'.\n"
                "Each timeline MUST have an array of detailed 'tasks' with 'action' and 'points'.\n"
                "Output ONLY valid JSON matching this structure exactly:\n"
                "{\n"
                '  "primary_career_path": {"title": "<insert custom role>", "why": "<insert custom reason>"},\n'
                '  "technical_path": [\n'
                '    {"skill": "<first technical skill>", "description": "<deep explanation>", "next_skill": "<next skill in chain>"},\n'
                '    {"skill": "<second technical skill>", "description": "<deep explanation>", "next_skill": "<next skill in chain>"}\n'
                '  ],\n'
                '  "action_plan": [\n'
                '    {\n'
                '      "timeframe": "Immediate",\n'
                '      "tasks": [{"action": "<custom task 1>", "points": 10, "details": "<deep explanation>"}, {"action": "<custom task 2>", "points": 15, "details": "<deep explanation>"}]\n'
                '    },\n'
                '    {\n'
                '      "timeframe": "6-Month",\n'
                '      "tasks": [{"action": "<custom task 1>", "points": 30, "details": "<deep explanation>"}]\n'
                '    },\n'
                '    {\n'
                '      "timeframe": "1-Year",\n'
                '      "tasks": [{"action": "<custom task 1>", "points": 50, "details": "<deep explanation>"}]\n'
                '    }\n'
                '  ],\n'
                '  "skill_gaps": ["<gap 1>", "<gap 2>"]\n'
                "}\n\n"
                "Conversation History:\n" + history_str
            )
            response = await logic_llm.ainvoke([SystemMessage(content=prompt)])
            eval_content = response.content
            s_idx, e_idx = eval_content.find('{'), eval_content.rfind('}')
            if s_idx != -1 and e_idx != -1:
                try:
                    new_roadmap = json_repair.loads(eval_content[s_idx:e_idx+1])
                    
                    # Need a new dict to trigger SQLAlchemy JSON mutation detection
                    new_guidance = dict(guidance_dict)
                    new_guidance["roadmap"] = new_roadmap
                    profile.guidance = new_guidance
                    
                    needs_commit = True
                    print("✅ Career Roadmap successfully generated!")
                except json.JSONDecodeError as e:
                    print(f"❌ Failed to parse Roadmap JSON: {e}")
        else:
            print("✅ Roadmap already exists.")

        if needs_commit:
            print("💾 Saving generated profiles to Database...")
            await db.commit()
            print("🎉 Database Backfill Complete! Refresh your browser!")
        else:
            print("🤷 Nothing needed to be updated.")
            
if __name__ == "__main__":
    asyncio.run(main())
