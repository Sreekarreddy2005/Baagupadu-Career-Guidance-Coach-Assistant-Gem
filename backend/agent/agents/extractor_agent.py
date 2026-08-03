from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from langchain_core.messages import SystemMessage, AIMessage, HumanMessage
from backend.agent.state import AgentState
from backend.agent.agents.base_agent import BaseAgent
from backend.models import LongTermMemory
from sentence_transformers import SentenceTransformer
import asyncio

embedder = SentenceTransformer('all-MiniLM-L6-v2')


class BrainPersonaOutput(BaseModel):
    """
    A rich, holistic extraction of who the user is as a PERSON — not just
    their career. This builds a "brain map" of how they think, feel, and operate.
    """
    # --- CORE IDENTITY ---
    traits_uncovered: List[str] = Field(
        default_factory=list,
        description=(
            "1-3 new core personality traits shown in this exchange. "
            "e.g. 'resilient under pressure', 'deeply empathetic', 'thrives on impact', "
            "'gets bored with repetition', 'perfectionist streak', 'visionary thinker'. "
            "Only NEW traits not already seen. Empty list if none."
        )
    )

    # --- HOW THEY THINK ---
    thinking_style: Optional[str] = Field(
        default=None,
        description=(
            "How does this person process information? "
            "e.g. 'thinks in systems and connections', 'highly intuitive, acts on gut feel', "
            "'analytical and data-driven', 'big-picture visionary', 'detail-obsessed'. "
            "Only fill if clearly shown. Null if unsure."
        )
    )

    # --- WHAT DRIVES THEM (EMOTIONAL ENGINE) ---
    emotional_drivers: List[str] = Field(
        default_factory=list,
        description=(
            "What are the deep emotional forces that motivate or scare them? "
            "e.g. 'driven by fear of being ordinary', 'motivated by seeing real-world impact', "
            "'needs external validation to feel secure', 'fears failure in public', "
            "'deeply motivated by solving problems for the underserved'. "
            "Can be both positive motivators AND fears. Empty if not evident."
        )
    )

    # --- CORE VALUES ---
    values: List[str] = Field(
        default_factory=list,
        description=(
            "What does this person fundamentally value in life? "
            "e.g. 'freedom over security', 'impact over money', 'loyalty', 'innovation', "
            "'fairness and equality', 'recognition', 'family', 'excellence'. "
            "Infer carefully from what they say and how they say it. Empty if not evident."
        )
    )

    # --- HOW THEY HANDLE DIFFICULTY ---
    resilience_pattern: Optional[str] = Field(
        default=None,
        description=(
            "How does this person respond when things go wrong or they face setbacks? "
            "e.g. 'internalizes failure quietly, then bounces back stronger', "
            "'gets frustrated but uses it as fuel', 'tendency to self-blame before regrouping', "
            "'brushes off failure quickly and pivots'. Only fill if a setback was discussed. Null if unsure."
        )
    )

    # --- HOW THEY OPERATE WITH PEOPLE ---
    social_style: Optional[str] = Field(
        default=None,
        description=(
            "How does this person relate to others? "
            "e.g. 'natural leader who takes ownership', 'collaborative but needs autonomy', "
            "'introvert who opens up slowly', 'people-pleaser who struggles to say no', "
            "'highly independent, prefers to work solo'. Null if not evident."
        )
    )

    # --- HOW THEY SEE THEMSELVES ---
    self_image: Optional[str] = Field(
        default=None,
        description=(
            "What does this person believe about themselves — their identity narrative? "
            "e.g. 'sees himself as an underdog who has to prove himself', "
            "'believes she is capable but hasn't found the right opportunity yet', "
            "'self-critical, holds himself to very high standards'. Null if not evident."
        )
    )

    # --- ENERGY MAP ---
    energy_sources: List[str] = Field(
        default_factory=list,
        description=(
            "What ENERGIZES or DRAINS this person? "
            "e.g. 'energized by building things from scratch', 'drained by repetitive tasks', "
            "'lights up when talking about technology', 'loses energy in bureaucratic environments'. "
            "Empty if not evident."
        )
    )

    # --- HARD FACTS (concrete life data) ---
    hard_facts: List[str] = Field(
        default_factory=list,
        description=(
            "Concrete, verifiable facts about the user's life. "
            "e.g. 'Built Adhikar.ai — a scholarship auto-apply platform', "
            "'Participated in a hackathon, did not reach finals', "
            "'Learned AWS during the hackathon'. "
            "Be specific. Do not infer — only log what was explicitly stated."
        )
    )


class ExtractorAgent(BaseAgent):
    def __init__(self):
        super().__init__(purpose="logic", structured_output_model=BrainPersonaOutput)

    async def invoke(self, state: AgentState) -> Dict[str, Any]:
        """
        4. Extraction Node: Silent background task.

        Builds a rich, holistic 'brain persona' of the user — not just career traits
        but how they think, what drives them emotionally, their values, how they handle
        failure, their social style, self-image, and what energises vs drains them.

        This runs silently after every message and incrementally enriches the
        extracted_traits dict stored in the profile.
        """
        messages = state.get("messages", [])
        extracted_traits = state.get("extracted_traits", {})

        # Initialise all persona keys if this is the first run
        for key in [
            "traits_uncovered", "emotional_drivers", "values",
            "energy_sources", "hard_facts"
        ]:
            if key not in extracted_traits:
                extracted_traits[key] = []

        db = state.get("db_session")
        profile = state.get("profile", {})
        conversation_id = profile.get("conversation_id")

        if len(messages) < 2:
            return {"extracted_traits": extracted_traits}

        user_msg = next((m.content for m in reversed(messages) if isinstance(m, HumanMessage)), "")
        ai_msg = next((m.content for m in reversed(messages) if isinstance(m, AIMessage)), "")

        if not user_msg:
            return {"extracted_traits": extracted_traits}

        prompt = (
            "You are a silent background psychological analyst. Your job is to build a rich, "
            "detailed 'brain persona' of this person — NOT just their career. You are mapping "
            "who they are as a HUMAN BEING: how they think, what drives them emotionally, "
            "what they value, how they handle failure, how they relate to people, how they "
            "see themselves, and what energises or drains them.\n\n"
            "Read the exchange below very carefully. Extract ONLY what is genuinely evidenced "
            "by what the user said. Do NOT guess or invent. If a field has no evidence, "
            "leave it as null or empty.\n\n"
            f"=== EXCHANGE ===\n"
            f"User said: {user_msg}\n"
            f"Companion replied: {ai_msg}\n"
            f"=== END EXCHANGE ===\n\n"
            f"Already known traits (do NOT repeat these): {extracted_traits.get('traits_uncovered', [])}\n"
            f"Already known facts (do NOT repeat these): {extracted_traits.get('hard_facts', [])}\n"
        )

        try:
            res: BrainPersonaOutput = await self.structured_llm.ainvoke(
                [SystemMessage(content=prompt)]
            )

            # --- Merge new discoveries into the running persona ---

            # Core traits
            for t in res.traits_uncovered:
                if t and t not in extracted_traits["traits_uncovered"]:
                    extracted_traits["traits_uncovered"].append(t)

            # Emotional drivers (accumulated list)
            for d in res.emotional_drivers:
                if d and d not in extracted_traits["emotional_drivers"]:
                    extracted_traits["emotional_drivers"].append(d)

            # Values (accumulated list)
            for v in res.values:
                if v and v not in extracted_traits["values"]:
                    extracted_traits["values"].append(v)

            # Energy sources (accumulated list)
            for e in res.energy_sources:
                if e and e not in extracted_traits["energy_sources"]:
                    extracted_traits["energy_sources"].append(e)

            # Single-value fields — only update if we have new info and none yet
            if res.thinking_style and not extracted_traits.get("thinking_style"):
                extracted_traits["thinking_style"] = res.thinking_style

            if res.resilience_pattern and not extracted_traits.get("resilience_pattern"):
                extracted_traits["resilience_pattern"] = res.resilience_pattern

            if res.social_style and not extracted_traits.get("social_style"):
                extracted_traits["social_style"] = res.social_style

            if res.self_image and not extracted_traits.get("self_image"):
                extracted_traits["self_image"] = res.self_image

            # --- Save Hard Facts to Long-Term Vector Memory ---
            if db and conversation_id and res.hard_facts:
                for fact in res.hard_facts:
                    if fact and fact not in extracted_traits["hard_facts"]:
                        extracted_traits["hard_facts"].append(fact)
                        embedding = await asyncio.to_thread(embedder.encode, fact)
                        ltm = LongTermMemory(
                            conversation_id=conversation_id,
                            content=fact,
                            embedding=embedding.tolist(),
                            metadata_tags={"type": "hard_fact"}
                        )
                        db.add(ltm)

            # --- Also save rich persona insights to LTM for RAG recall ---
            persona_insights_to_save = []
            if res.thinking_style:
                persona_insights_to_save.append(f"Thinking style: {res.thinking_style}")
            for d in res.emotional_drivers:
                persona_insights_to_save.append(f"Emotional driver: {d}")
            for v in res.values:
                persona_insights_to_save.append(f"Core value: {v}")
            if res.resilience_pattern:
                persona_insights_to_save.append(f"Resilience pattern: {res.resilience_pattern}")
            if res.social_style:
                persona_insights_to_save.append(f"Social style: {res.social_style}")
            if res.self_image:
                persona_insights_to_save.append(f"Self-image: {res.self_image}")
            for e in res.energy_sources:
                persona_insights_to_save.append(f"Energy source: {e}")

            if db and conversation_id and persona_insights_to_save:
                for insight in persona_insights_to_save:
                    embedding = await asyncio.to_thread(embedder.encode, insight)
                    ltm = LongTermMemory(
                        conversation_id=conversation_id,
                        content=insight,
                        embedding=embedding.tolist(),
                        metadata_tags={"type": "persona_insight"}
                    )
                    db.add(ltm)

        except Exception as e:
            print(f"Extractor Agent Error: {e}")

        return {"extracted_traits": extracted_traits}
