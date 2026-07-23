import re
from langchain_core.messages import SystemMessage, AIMessage
from backend.core.llm_factory import get_llm
from backend.knowledge_base.loader import KnowledgeBaseLoader
from backend.agent.state import AgentState
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

async def executor_node(state: AgentState):
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
            query_embedding = embedder.encode(user_input).tolist()
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
    
    # Context (Phase rules + Semantic matching)
    phase_context = kb_loader.get_phase_context(current_phase, micro_phase=micro_phase)
    
    system_prompt = (
        "<system_instructions>\n"
        "You are Sahayam, a highly empathetic PSYCHOLOGICAL career coach. You are NOT a technical peer, mentor, or recruiter.\n"
        "CRITICAL RULE: Do NOT dive into technical jargon, tools, or industry specifics (e.g. asking about Kaggle, ML, or specific frameworks). "
        "Your ONLY goal is to uncover the user's deep psychological drivers, fears, past experiences (childhood/teenage), and emotional motivations.\n\n"
        f"CURRENT PHASE RULES:\n{phase_context}\n\n"
        f"APPROVED PLAN FOR THIS TURN:\n{proposed_plan}\n\n"
        f"{ltm_context}{kb_context}"
        f"{_get_profile_context(profile)}"
        "INSTRUCTIONS:\n"
        "1. Write your conversational response directly to the user.\n"
        "2. Keep it warm, human, and relatively short.\n"
        "3. Do NOT output internal logic or meta-notes.\n"
        "</system_instructions>"
    )
    
    chat_llm = get_llm(purpose="chat")
    try:
        res = await chat_llm.ainvoke([SystemMessage(content=system_prompt)] + messages)
        content = res.content
        
        # Clean up hallucinations
        content = re.sub(r'\(Note:.*?\)', '', content, flags=re.IGNORECASE | re.DOTALL)
        content = re.sub(r'\[[A-Z_]+\]', '', content).strip()
        
        return {"messages": [AIMessage(content=content)]}
    except Exception as e:
        print(f"Executor Error: {e}")
        return {"messages": [AIMessage(content="I'm having a little trouble connecting right now, but I hear you. Let's take a deep breath. Can you tell me a bit more?")]}
