from typing import Optional, Dict, Any
from pydantic import BaseModel, Field
from langchain_core.messages import SystemMessage
from backend.agent.state import AgentState
from backend.agent.agents.base_agent import BaseAgent
from backend.models import KnowledgeBaseChunk
from sqlalchemy.future import select
from sentence_transformers import SentenceTransformer
import asyncio

embedder = SentenceTransformer('all-MiniLM-L6-v2')

class PlannerOutput(BaseModel):
    proposed_plan: str = Field(description="A detailed 2-3 sentence directive on what the Execution Agent must do and how it should sound")
    new_phase: str = Field(description="The new phase to transition to, or 'none' if staying in the current phase")
    micro_phase: Optional[str] = Field(description="The micro-phase to transition to ('childhood', 'teenage', 'adult', or 'none')")

class PlannerAgent(BaseAgent):
    def __init__(self):
        super().__init__(purpose="logic", structured_output_model=PlannerOutput)
        
    async def invoke(self, state: AgentState) -> Dict[str, Any]:
        """
        1. Planner Node: Lightweight Semantic Router using Qwen (Logic).
        Reads the user message + router.md.
        Outputs a short proposed plan and the phase.
        """
        messages = state.get("messages", [])
        current_phase = state.get("current_phase", "trust")
        user_input = state.get("user_input", "")
        db = state.get("db_session")
        
        if not messages:
            return {"proposed_plan": "Initial greeting and gentle introduction.", "new_phase": "trust"}
            
        recent_history = self.get_recent_history(messages, k=4)
        
        kb_context = ""
        if db and user_input:
            try:
                query_embedding = await asyncio.to_thread(embedder.encode, user_input)
                query_embedding = query_embedding.tolist()
                rag_result = await db.execute(select(KnowledgeBaseChunk).order_by(KnowledgeBaseChunk.embedding.cosine_distance(query_embedding)).limit(2))
                rag_chunks = rag_result.scalars().all()
                if rag_chunks:
                    kb_context = "=== RELEVANT ROUTING RULES ===\n" + "\n".join([f"- {c.content}" for c in rag_chunks]) + "\n\n"
            except Exception as e:
                print(f"RAG Error in Planner: {e}")

        prompt = (
            "You are the Strategic Planner Agent for a highly empathetic career coaching AI.\n"
            "Your job is to analyze the recent conversation and strictly determine the optimal NEXT STEP.\n\n"
            f"{kb_context}"
            f"CURRENT PHASE: {current_phase}\n"
            f"RECENT CONVERSATION HISTORY:\n{recent_history}\n"
            "INSTRUCTIONS FOR YOUR PLAN:\n"
            "1. Analyze the User's Tone: Are they vulnerable, defensive, or ready to explore?\n"
            "2. Non-Linear Exploration: Do NOT force a linear path (childhood -> teenage -> adult). If the user brings up a recent event, explore that! If they bring up a childhood memory naturally, explore that. Let the user's context drive the micro-phase.\n"
            "3. Ensure Trust is Built: If the user hasn't explicitly opened up, plan to ask a gentle, open-ended question to build rapport. Emphasize that you are a safe, non-judgmental AI companion here solely to listen and support them.\n"
            "4. Psychological Pivot: If the user talks about a surface-level goal, plan to pivot gently to their underlying motivations without sounding like a therapist.\n"
            "5. Formulate the Plan: Write a highly precise, actionable directive for the Execution Agent (e.g., 'Explore the recent project they mentioned to understand their frustration trigger').\n"
            "6. Phase Transition: The valid macro phases are 'trust' -> 'exploration' -> 'synthesis' -> 'guidance'. You can ONLY move forward. Only transition to 'exploration' once trust is built. Only transition to 'synthesis' when you have gathered enough traits across their persona.\n"
            "7. Keep It Light & Moving: Do not drill down too deep into one topic if it's not necessary. If you have extracted enough traits from the current subject, plan to proceed to the next topic. Keep the conversation easy to understand and avoid heavy, difficult probing.\n"
        )
        
        try:
            res: PlannerOutput = await self.structured_llm.ainvoke([SystemMessage(content=prompt)])
            
            plan = res.proposed_plan
            phase = res.new_phase.lower() if res.new_phase and res.new_phase.lower() != "none" else current_phase
            
            # Enforce strictly forward progression (prevent bouncing back to trust)
            phase_order = {"trust": 1, "exploration": 2, "synthesis": 3, "guidance": 4}
            if phase in phase_order and current_phase in phase_order:
                if phase_order[phase] < phase_order[current_phase]:
                    phase = current_phase
                    
            micro_phase = res.micro_phase.lower() if res.micro_phase and res.micro_phase.lower() in ["childhood", "teenage", "adult"] else None
            
            if not plan:
                return {"proposed_plan": "Continue exploration gracefully.", "new_phase": current_phase, "micro_phase": None}
                
            return {"proposed_plan": plan, "new_phase": phase, "micro_phase": micro_phase}
        except Exception as e:
            print(f"Planner Agent Error: {e}")
            return {"proposed_plan": "Continue exploration gracefully.", "new_phase": current_phase, "micro_phase": None}
