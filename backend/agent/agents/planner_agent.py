from typing import Optional, Dict, Any
from pydantic import BaseModel, Field
from langchain_core.messages import SystemMessage
from backend.agent.state import AgentState
from backend.agent.agents.base_agent import BaseAgent
from backend.models import LongTermMemory, KnowledgeBaseChunk
from sentence_transformers import SentenceTransformer
from backend.knowledge_base.loader import KnowledgeBaseLoader
import asyncio

embedder = SentenceTransformer('all-MiniLM-L6-v2')
kb_loader = KnowledgeBaseLoader()


class PlannerOutput(BaseModel):
    internal_critique: str = Field(
        description="Critique of your own plan against guardrails. Ask: Is this safe? Does it flow logically? Is the tone empathetic?"
    )
    is_approved: bool = Field(
        description="True if the plan passes the critique safely."
    )
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
        profile = state.get("profile", {})

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
        micro_phase_str = state.get("micro_phase", "")
        if db and user_input:
            try:
                kb_search_query = f"Phase: {current_phase}. Micro-phase: {micro_phase_str}. Relevant rules, frameworks, and instructions for context: {user_input}"
                query_embedding = await asyncio.to_thread(embedder.encode, kb_search_query)
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

        guardrails_text = self.load_prompt_file(["gems", "nenu_evaru", "prompts", "guardrails.md"])

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

        coverage = profile.get("persona", {}).get("coverage_matrix", {})
        coverage_str = (
            f"PERSONA COVERAGE MATRIX (BRAIN MAPPING HEATMAP):\n"
            f"- Cognitive Capabilities: {coverage.get('cognitive_capabilities', 0)}%\n"
            f"- Curiosity & Enthusiasm: {coverage.get('curiosity_and_enthusiasm', 0)}%\n"
            f"- Habits & Routines: {coverage.get('habits_and_routines', 0)}%\n"
            f"- Free Time Preferences: {coverage.get('free_time_preferences', 0)}%\n"
            f"- Lifestyle & Environment: {coverage.get('lifestyle_and_environment', 0)}%\n"
            f"- Overall Brain Mapped: {coverage.get('overall_score', 0)}%\n\n"
        )

        # Organic Trust Phase logic
        trust_buffer_rule = ""
        if current_phase == "trust":
            trust_buffer_rule = (
                "🌱 TRUST PHASE ACTIVE:\n"
                "The conversation is in the early trust-building stage. Your goal is to make the user feel comfortable, like they are talking to a new, natural human friend.\n"
                "HOWEVER, do NOT stay here forever. If the user is sharing personal stories, making jokes, or answering freely (e.g., talking about hobbies, cooking fails, or college life), TRUST IS ESTABLISHED.\n"
                "Once trust is established, you MUST plan to transition to the 'exploration' phase immediately to keep the momentum going. Pick a micro-phase (childhood, teenage, or adult) based on what they are currently talking about, and pivot gently.\n"
                "If they are still giving one-word answers, plan a response where the Executor: (1) casually validates what they just said, and (2) asks ONE very light, everyday small-talk question.\n\n"
            )

        prompt = (
            "You are the Strategic Planner for Sahayam — a warm AI companion whose PRIMARY goal is "
            "to understand the user as a complete HUMAN BEING, not just guide their career.\n\n"
            "You are building a rich 'brain persona' of this person: how they think, what drives them "
            "emotionally, what they value, how they handle failure, how they relate to others, and "
            "what energises or drains them. Career guidance is a natural outcome of truly knowing someone — "
            "it is NOT the primary focus of early conversations.\n\n"
            f"{trust_buffer_rule}"
            f"{coverage_str}"
            f"{kb_context}"
            f"{resistance_rule}"
            f"CURRENT PHASE: {current_phase}\n"
            f"RECENT CONVERSATION:\n{recent_history}\n\n"
            "PLANNING RULES:\n"
            "1. PERSON FIRST (FOUNDATION): Gathering the user persona in extreme detail is the absolute prerequisite for everything else. Career advice will be built on this foundation later. Right now, focus ONLY on mapping their psychology, habits, and life story.\n"
            "2. NON-LINEAR LIFE STAGES: During exploration, fluidly switch between 'childhood', 'teenage', and 'adult' micro-phases depending on the situation. If they mention college stress, explore the 'adult' or 'teenage' angle. If they mention an old hobby, naturally pivot to 'childhood'. Do not force chronological order.\n"
            "3. FOLLOW THE USER'S LEAD: Do NOT force a linear path. If they bring up a memory, a feeling, "
            "a project, a frustration — go there. Let their energy guide the micro-phase.\n"
            "4. TRUST BEFORE DEPTH: In the first 4-5 messages, stay purely in light, friendly small-talk. Do not probe deeply until psychological safety is established.\n"
            "5. KEEP MOVING: If you've explored one thread enough, plan to gently transition to a new "
            "aspect of their life or personality. Do not drill down endlessly on one topic.\n"
            "5. RESISTANCE PROTOCOL: If the user shows frustration or impatience, plan to STOP questioning "
            "and instead share what you've noticed about them so far.\n"
            "6. PHASE DISCIPLINE: Phases move forward only: trust → exploration → synthesis → guidance. "
            "Only move to 'exploration' once at least 2-3 rapport exchanges have occurred and genuine comfort exists. Only move to 'synthesis' when you "
            "have a rich understanding of their personality across multiple dimensions.\n"
            "7. ONE QUESTION RULE: Whatever you plan, the Executor must ask a MAXIMUM of one question. "
            "Build your plan around a single, precise conversational move.\n"
            "8. HEATMAP-GUIDED EXPLORATION: Check the Persona Coverage Matrix. If one dimension has very low coverage "
            "(e.g. Free Time or Habits are under 30%), plan a friendly, conversational move to naturally touch on that uncharted area.\n\n"
            f"GUARDRAILS (CRITICAL RULES):\n{guardrails_text}\n\n"
            "EVALUATION RUBRIC:\n"
            "1. SAFETY: Does this plan violate any guardrails? (e.g., trying to give advice during the exploration phase, or digging into trauma without trust).\n"
            "2. NECESSITY: Does this plan logically flow from the user's last message, or does it awkwardly pivot?\n"
            "3. TONE: Is the proposed plan too aggressive, clinical, or robotic? (It must be empathetic and organic).\n\n"
            "You MUST first write an internal critique evaluating your own plan against the rubric and guardrails. If the plan fails ANY criteria, set is_approved to false and rewrite the plan to pass.\n"
            "Then, write a precise directive for the Executor. Be specific about WHAT to explore and WHAT TONE to use.\n"
        )

        try:
            res: PlannerOutput = await self.structured_llm.ainvoke([SystemMessage(content=prompt)])

            plan = res.proposed_plan
            phase = res.new_phase.lower() if res.new_phase and res.new_phase.lower() != "none" else current_phase

            # Enforce 4-exchange trust buffer
            if user_msg_count <= 4:
                phase = "trust"

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

            if not plan or not res.is_approved:
                return {
                    "proposed_plan": "Continue the conversation warmly and naturally. Explore the next unknown dimension of their personality.",
                    "new_phase": current_phase,
                    "micro_phase": None,
                    "is_approved": False,
                    "evaluator_feedback": res.internal_critique
                }

            return {
                "proposed_plan": plan, 
                "new_phase": phase, 
                "micro_phase": micro_phase,
                "is_approved": res.is_approved,
                "evaluator_feedback": res.internal_critique
            }

        except Exception as e:
            print(f"Planner Agent Error: {e}")
            return {
                "proposed_plan": "Continue the conversation warmly and naturally. Explore the next unknown dimension of their personality.",
                "new_phase": current_phase,
                "micro_phase": None
            }
