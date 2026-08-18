from typing import Optional, Dict, Any
from pydantic import BaseModel, Field
from langchain_core.messages import SystemMessage
from backend.agent.state import AgentState
from backend.agent.agents.base_agent import BaseAgent
from backend.models import LongTermMemory, KnowledgeBaseChunk
from sentence_transformers import SentenceTransformer
from backend.knowledge_base.loader import KnowledgeBaseLoader
import asyncio
from sqlalchemy.future import select
from sqlalchemy.orm import aliased
from backend.agent.agents.shadow_agents import ShadowEngine
from backend.models import KnowledgeBaseChunk, MemoryNode, MemoryEdge

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
    search_query: Optional[str] = Field(
        description="If the user asks a factual question (e.g., about salaries, job markets, specific companies), provide a search query to ground the advice. Otherwise, leave null."
    )
    is_deflection: bool = Field(
        description="True if the user dodged a deep question or gave a resistant non-answer."
    )
    reflection_thought: Optional[str] = Field(
        description="If is_deflection is True, explicitly write out your internal reasoning on why they deflected and how you should adjust your strategy to rebuild trust."
    )


class PlannerAgent(BaseAgent):
    def __init__(self):
        self.shadow_engine = ShadowEngine()
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

        user_msg_count = len([m for m in messages if hasattr(m, 'type') and m.type == 'human'])

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

        graph_context = ""
        if db and user_input:
            user_id = profile.get("user_id")
            if user_id:
                try:
                    # 1. Very basic entity extraction via split (a real app uses LLM/SpaCy here, this is a fast POC)
                    words = [w.strip(".,?!;:") for w in user_input.split() if len(w) > 4]
                    
                    matched_nodes = []
                    for word in words:
                        res = await db.execute(select(MemoryNode).where(
                            MemoryNode.user_id == user_id, 
                            MemoryNode.name.ilike(f"%{word}%")
                        ).limit(3))
                        matched_nodes.extend(res.scalars().all())
                    
                    # 2. Get edges for those nodes
                    if matched_nodes:
                        node_ids = [n.id for n in matched_nodes]
                        
                        SourceNode = aliased(MemoryNode)
                        TargetNode = aliased(MemoryNode)
                        
                        edges_res = await db.execute(
                            select(MemoryEdge, SourceNode.name, TargetNode.name)
                            .join(SourceNode, MemoryEdge.source_id == SourceNode.id)
                            .join(TargetNode, MemoryEdge.target_id == TargetNode.id)
                            .where(MemoryEdge.user_id == user_id)
                            .where((SourceNode.id.in_(node_ids)) | (TargetNode.id.in_(node_ids)))
                            .limit(10)
                        )
                        edge_results = edges_res.all()
                        
                        if edge_results:
                            graph_context = "🕸️ USER MEMORY GRAPH (GraphRAG Context):\n"
                            graph_context += "The following are deeply ingrained connections in the user's brain related to what they just said:\n"
                            for edge, source_name, target_name in edge_results:
                                graph_context += f"- (User/Concept: '{source_name}') --[{edge.relation}]--> ('{target_name}')\n"
                            graph_context += "\n"
                except Exception as e:
                    print(f"GraphRAG Error in Planner: {e}")

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

        shadow_instruction = ""
        if user_input and user_msg_count > 0:
            shadow_results = await self.shadow_engine.analyze(user_input)
            empath_hyp = shadow_results.get("empath_hypothesis", "")
            skeptic_hyp = shadow_results.get("skeptic_hypothesis", "")
            if empath_hyp or skeptic_hyp:
                shadow_instruction = (
                    "👥 SHADOW AGENT HYPOTHESES (INTERNAL USE ONLY):\n"
                    "Your background shadow agents have analyzed the user's last message. Here are their psychological hypotheses:\n"
                    f"- The Empath thinks: {empath_hyp}\n"
                    f"- The Skeptic thinks: {skeptic_hyp}\n\n"
                    "CRITICAL RULE: Use these hypotheses to UNDERSTAND the user deeply, but NEVER interrogate them about it. "
                    "Do NOT ask 'Are you avoiding this?' or 'What made you think that?'. Act like a total human friend who just happens to be incredibly perceptive. "
                    "Incorporate this deep understanding smoothly into your proposed plan without breaking the 'friendly companion' UX.\n\n"
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
            f"{graph_context}"
            f"{shadow_instruction}"
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
            "5. AVOID LISTS & INTERVIEWS: Do not output plans that result in bullet points or '20 questions'. If you need information, get it conversationally.\n"
            "6. NO PREACHING: Give space. Let them figure it out. Do not rush to 'fix' them.\n"
            "7. TOOL USE (GROUNDING): If the user asks a factual question about careers, salaries, or the real world, output a `search_query` so the system can fetch live internet data to ground the response.\n"
            "8. REACT LOOP (DEFLECTION HANDLING): If the user dodges a question, gives a non-answer, or resists, set `is_deflection=True`. Write a `reflection_thought` analyzing why they resisted. Then, use that reflection to form a `proposed_plan` that retreats and validates them instead of pushing harder.\n"
            "9. HEATMAP-GUIDED EXPLORATION: Check the Persona Coverage Matrix. If one dimension has very low coverage "
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
            result: PlannerOutput = await self.structured_llm.ainvoke([SystemMessage(content=prompt)])

            new_phase = result.new_phase.lower() if result.new_phase and result.new_phase.lower() != "none" else current_phase

            # Enforce 4-exchange trust buffer
            if user_msg_count <= 4:
                new_phase = "trust"

            # Enforce strictly forward progression
            phase_order = {"trust": 1, "exploration": 2, "synthesis": 3, "guidance": 4}
            if new_phase in phase_order and current_phase in phase_order:
                if phase_order[new_phase] < phase_order[current_phase]:
                    new_phase = current_phase

            micro_phase_str = (
                result.micro_phase.lower()
                if result.micro_phase and result.micro_phase.lower() in ["childhood", "teenage", "adult"]
                else None
            )

            if not result.proposed_plan or not result.is_approved:
                return {
                    "proposed_plan": "Continue the conversation warmly and naturally. Explore the next unknown dimension of their personality.",
                    "new_phase": current_phase,
                    "micro_phase": None,
                    "is_approved": False,
                    "evaluator_feedback": result.internal_critique,
                    "is_deflection": False
                }

            return {
                "proposed_plan": result.proposed_plan,
                "is_approved": result.is_approved,
                "evaluator_feedback": result.internal_critique,
                "new_phase": new_phase,
                "micro_phase": micro_phase_str,
                "search_query": result.search_query,
                "is_deflection": result.is_deflection,
                "reflection_thought": result.reflection_thought
            }

        except Exception as e:
            print(f"Planner Agent Error: {e}")
            return {
                "proposed_plan": "Continue the conversation warmly and naturally. Explore the next unknown dimension of their personality.",
                "new_phase": current_phase,
                "micro_phase": None
            }
