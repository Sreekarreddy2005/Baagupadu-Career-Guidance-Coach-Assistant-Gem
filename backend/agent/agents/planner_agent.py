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
    proposed_plan: str = Field(
        description=(
            "A precise 2-3 sentence directive for the Executor Agent describing exactly what "
            "to do and what tone to use in this response. Be specific about what aspect of "
            "the user's PERSONALITY or LIFE STORY to explore — not just their career."
        )
    )
    new_phase: str = Field(
        description="The phase to be in: 'trust', 'exploration', 'synthesis', or 'guidance'. "
                    "Use 'none' if staying in the current phase."
    )
    micro_phase: Optional[str] = Field(
        description="The life-stage domain to explore: 'childhood', 'teenage', 'adult', or 'none'."
    )


class PlannerAgent(BaseAgent):
    def __init__(self):
        super().__init__(purpose="logic", structured_output_model=PlannerOutput)

    async def invoke(self, state: AgentState) -> Dict[str, Any]:
        """
        1. Planner Node: Lightweight Semantic Router.
        Analyses the conversation and outputs a precise directive for the Executor.
        Primary goal: understand the WHOLE person, not funnel towards career advice quickly.
        """
        messages = state.get("messages", [])
        current_phase = state.get("current_phase", "trust")
        user_input = state.get("user_input", "")
        db = state.get("db_session")

        if not messages:
            return {
                "proposed_plan": (
                    "This is the very first message. Direct the Executor to warmly greet the user "
                    "as a genuine friend, establish clear psychological safety (no judgements, no reporting, "
                    "completely their space), and ask ONE gentle opening question about something they've "
                    "been working on or thinking about lately — NOT about their career goals yet."
                ),
                "new_phase": "trust",
                "micro_phase": None
            }

        recent_history = self.get_recent_history(messages, k=6)

        kb_context = ""
        if db and user_input:
            try:
                query_embedding = await asyncio.to_thread(embedder.encode, user_input)
                query_embedding = query_embedding.tolist()
                rag_result = await db.execute(
                    select(KnowledgeBaseChunk)
                    .order_by(KnowledgeBaseChunk.embedding.cosine_distance(query_embedding))
                    .limit(2)
                )
                rag_chunks = rag_result.scalars().all()
                if rag_chunks:
                    kb_context = (
                        "=== RELEVANT ROUTING RULES ===\n"
                        + "\n".join([f"- {c.content}" for c in rag_chunks])
                        + "\n\n"
                    )
            except Exception as e:
                print(f"RAG Error in Planner: {e}")

        # Detect user resistance signals
        resistance_signals = [
            "stop asking", "just tell me", "what do i do", "tell me what to do",
            "enough questions", "stop the questions", "i'm frustrated", "i am frustrated",
            "why are you asking", "just give me advice", "can you just"
        ]
        user_is_resistant = any(signal in user_input.lower() for signal in resistance_signals)

        resistance_rule = ""
        if user_is_resistant:
            resistance_rule = (
                "⚠️ RESISTANCE PROTOCOL ACTIVATED:\n"
                "The user is frustrated with being asked questions. DO NOT plan another question.\n"
                "Plan a response where the Executor: (1) warmly acknowledges the user's feeling without "
                "being patronising, (2) shares 1-2 genuine, specific observations about what they've "
                "already revealed about themselves in this conversation (reference actual things they said), "
                "and (3) gently offers to continue when they're ready — without pressure.\n\n"
            )

        prompt = (
            "You are the Strategic Planner for Sahayam — a warm AI companion whose PRIMARY goal is "
            "to understand the user as a complete HUMAN BEING, not just guide their career.\n\n"
            "You are building a rich 'brain persona' of this person: how they think, what drives them "
            "emotionally, what they value, how they handle failure, how they relate to others, and "
            "what energises or drains them. Career guidance is a natural outcome of truly knowing someone — "
            "it is NOT the primary focus of early conversations.\n\n"
            f"{kb_context}"
            f"{resistance_rule}"
            f"CURRENT PHASE: {current_phase}\n"
            f"RECENT CONVERSATION:\n{recent_history}\n\n"
            "PLANNING RULES:\n"
            "1. PERSON FIRST: Always prioritise understanding who this person IS before thinking about "
            "career. What is still unknown about their personality, values, emotional drivers, or life story?\n"
            "2. FOLLOW THE USER'S LEAD: Do NOT force a linear path. If they bring up a memory, a feeling, "
            "a project, a frustration — go there. Let their energy guide the micro-phase.\n"
            "3. TRUST BEFORE DEPTH: If the user hasn't opened up or seems guarded, plan to stay warm and "
            "light. Do not probe deeply until psychological safety is established.\n"
            "4. KEEP MOVING: If you've explored one thread enough, plan to gently transition to a new "
            "aspect of their life or personality. Do not drill down endlessly on one topic.\n"
            "5. RESISTANCE PROTOCOL: If the user shows frustration or impatience, plan to STOP questioning "
            "and instead share what you've noticed about them so far.\n"
            "6. PHASE DISCIPLINE: Phases move forward only: trust → exploration → synthesis → guidance. "
            "Only move to 'exploration' once genuine rapport exists. Only move to 'synthesis' when you "
            "have a rich understanding of their personality across multiple dimensions.\n"
            "7. ONE QUESTION RULE: Whatever you plan, the Executor must ask a MAXIMUM of one question. "
            "Build your plan around a single, precise conversational move.\n\n"
            "Write a precise directive for the Executor. Be specific about WHAT to explore and "
            "WHAT TONE to use (e.g., 'Acknowledge their frustration warmly, then share the observation "
            "that they seem driven by a desire to solve real-world problems for underserved communities — "
            "reference the Adhikar.ai project. Ask nothing.').\n"
        )

        try:
            res: PlannerOutput = await self.structured_llm.ainvoke([SystemMessage(content=prompt)])

            plan = res.proposed_plan
            phase = res.new_phase.lower() if res.new_phase and res.new_phase.lower() != "none" else current_phase

            # Enforce strictly forward progression
            phase_order = {"trust": 1, "exploration": 2, "synthesis": 3, "guidance": 4}
            if phase in phase_order and current_phase in phase_order:
                if phase_order[phase] < phase_order[current_phase]:
                    phase = current_phase

            micro_phase = (
                res.micro_phase.lower()
                if res.micro_phase and res.micro_phase.lower() in ["childhood", "teenage", "adult"]
                else None
            )

            if not plan:
                return {
                    "proposed_plan": "Continue the conversation warmly and naturally. Explore the next unknown dimension of their personality.",
                    "new_phase": current_phase,
                    "micro_phase": None
                }

            return {"proposed_plan": plan, "new_phase": phase, "micro_phase": micro_phase}

        except Exception as e:
            print(f"Planner Agent Error: {e}")
            return {
                "proposed_plan": "Continue the conversation warmly and naturally. Explore the next unknown dimension of their personality.",
                "new_phase": current_phase,
                "micro_phase": None
            }
