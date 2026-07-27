import re
import asyncio
from typing import Dict, Any
from langchain_core.messages import SystemMessage, AIMessage
from backend.agent.state import AgentState
from backend.agent.agents.base_agent import BaseAgent
from backend.knowledge_base.loader import KnowledgeBaseLoader
from sentence_transformers import SentenceTransformer
from sqlalchemy.future import select
from backend.models import LongTermMemory, KnowledgeBaseChunk

kb_loader = KnowledgeBaseLoader()
embedder = SentenceTransformer('all-MiniLM-L6-v2')

def _get_profile_context(profile: dict) -> str:
    demographics = profile.get("life_stage_data", {}).get("demographics", {})
    
    demo_str = ""
    if demographics:
        demo_str = (
            "--- USER DEMOGRAPHICS ---\n"
            f"User's Name: {demographics.get('full_name', 'Unknown')}\n"
            f"Age Range: {demographics.get('age_range', 'Unknown')}\n"
            f"Current Status: {demographics.get('current_status', 'Unknown')}\n"
        )
    return f"\n\n{demo_str}"

class ExecutorAgent(BaseAgent):
    def __init__(self):
        # Executor uses 'chat' model (Llama/empathetic) and does not need structured JSON output
        super().__init__(purpose="chat", structured_output_model=None)
        
    async def invoke(self, state: AgentState) -> Dict[str, Any]:
        """
        3. Executor Node: The empathetic Chat LLM (Llama).
        Receives ONLY the relevant phase file and the approved plan.
        """
        messages = state.get("messages", [])
        profile = state.get("profile", {})
        current_phase = state.get("current_phase", "trust")
        if state.get("new_phase"):
            current_phase = state.get("new_phase")
        
        proposed_plan = state.get("proposed_plan", "")
        db = state.get("db_session")
        user_input = state.get("user_input", "")
        
        # RAG + LTM (Isolated to Executor only)
        ltm_context = ""
        kb_context = ""
        if db and user_input:
            try:
                query_embedding = await asyncio.to_thread(embedder.encode, user_input)
                query_embedding = query_embedding.tolist()
                # LTM
                result = await db.execute(select(LongTermMemory).where(LongTermMemory.conversation_id == profile.get("conversation_id")).order_by(LongTermMemory.embedding.cosine_distance(query_embedding)).limit(3))
                memories = result.scalars().all()
                if memories:
                    ltm_context = "=== LONG-TERM MEMORY ===\n" + "\n".join([f"- {m.content}" for m in memories]) + "\n\n"
                
                # KB
                rag_result = await db.execute(select(KnowledgeBaseChunk).order_by(KnowledgeBaseChunk.embedding.cosine_distance(query_embedding)).limit(2))
                rag_chunks = rag_result.scalars().all()
                if rag_chunks:
                    kb_context = "=== RELEVANT RULES ===\n" + "\n".join([f"- {c.content}" for c in rag_chunks]) + "\n\n"
            except Exception as e:
                print(f"RAG Error in Executor: {e}")
                
        micro_phase = state.get("micro_phase")
        
        # We rely solely on the semantic RAG chunks (`kb_context`) to guide the phase
        # rather than dumping 150KB of markdown into the context.
        
        system_prompt = (
            "<system_instructions>\n"
            "You are Sahayam, a highly empathetic psychological career coach.\n"
            "CRITICAL RULES:\n"
            "1. NO INTERROGATION: You must ask a MAXIMUM of ONE short question per response. Never stack questions.\n"
            "2. NO META-GUESSING: Never use phrases like 'I'm noticing that you're someone who...' or 'Am I right?'. Just naturally converse.\n"
            "3. NO FORCED EMPATHY: Do not constantly say 'That's beautiful' or 'I want to acknowledge'. Be grounded, authentic, and professional.\n"
            "4. NO REPETITION: Do not summarize or repeat what the user just said back to them. Add new value to the conversation.\n"
            "5. NO TECHNICAL JARGON: You explore deep psychological drivers, not tech stacks.\n"
            "6. NON-JUDGMENTAL SAFE SPACE: Make it clear you are a safe, completely non-judgmental AI companion here solely to listen to their story.\n"
            "7. KEEP IT LIGHT & MOVING: Do not drill down too deeply into one topic if it's unnecessary. Keep the conversation easy to understand, avoid heavy/difficult probing, and organically move to the next topic once you have enough traits.\n\n"
            f"APPROVED PLAN FOR THIS TURN:\n{proposed_plan}\n\n"
            f"{ltm_context}{kb_context}"
            f"{_get_profile_context(profile)}"
            "INSTRUCTIONS:\n"
            "Write your conversational response directly to the user. Keep it warm, brief, and highly natural. Ask ONE short, focused question based on the plan to keep the flow organic.\n"
            "</system_instructions>"
        )
        
        try:
            res = await self.llm.ainvoke([SystemMessage(content=system_prompt)] + messages)
            content = res.content
            
            # Clean up hallucinations
            content = re.sub(r'\(Note:.*?\)', '', content, flags=re.IGNORECASE | re.DOTALL)
            content = re.sub(r'\[[A-Z_]+\]', '', content).strip()
            
            return {"messages": [AIMessage(content=content)]}
        except Exception as e:
            print(f"Executor Agent Error: {e}")
            return {"messages": [AIMessage(content="I'm having a little trouble connecting right now, but I hear you. Let's take a deep breath. Can you tell me a bit more?")]}
