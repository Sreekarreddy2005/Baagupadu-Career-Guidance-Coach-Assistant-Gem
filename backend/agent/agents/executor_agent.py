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
    persona = profile.get("persona", {})
    extracted = profile.get("session_progress", {})

    demo_str = ""
    if demographics:
        demo_str = (
            "--- USER INFO ---\n"
            f"Name: {demographics.get('full_name', 'Unknown')}\n"
            f"Age Range: {demographics.get('age_range', 'Unknown')}\n"
            f"Status: {demographics.get('current_status', 'Unknown')}\n"
        )

    # Surface the rich brain persona so the executor can reference it naturally
    brain_map = ""
    traits = persona.get("traits_uncovered", [])
    drivers = persona.get("emotional_drivers", [])
    values = persona.get("values", [])
    thinking = persona.get("thinking_style")
    resilience = persona.get("resilience_pattern")
    social = persona.get("social_style")
    self_image = persona.get("self_image")
    energy = persona.get("energy_sources", [])

    brain_parts = []
    if traits:
        brain_parts.append(f"Personality traits so far: {', '.join(traits)}")
    if thinking:
        brain_parts.append(f"Thinking style: {thinking}")
    if drivers:
        brain_parts.append(f"What drives them: {', '.join(drivers)}")
    if values:
        brain_parts.append(f"Core values: {', '.join(values)}")
    if resilience:
        brain_parts.append(f"How they handle setbacks: {resilience}")
    if social:
        brain_parts.append(f"Social style: {social}")
    if self_image:
        brain_parts.append(f"How they see themselves: {self_image}")
    if energy:
        brain_parts.append(f"What energises/drains them: {', '.join(energy)}")

    if brain_parts:
        brain_map = "\n--- BRAIN PERSONA BUILT SO FAR ---\n" + "\n".join(brain_parts) + "\n"

    return f"\n\n{demo_str}{brain_map}"


class ExecutorAgent(BaseAgent):
    def __init__(self):
        # Executor uses 'chat' model (Llama/empathetic) and does not need structured JSON output
        super().__init__(purpose="chat", structured_output_model=None)

    async def invoke(self, state: AgentState) -> Dict[str, Any]:
        """
        3. Executor Node: The empathetic Chat LLM (Llama).
        Acts as Sahayam — a warm AI companion, NOT a career bot.
        Receives the approved plan, long-term memory, and brain persona.
        """
        messages = state.get("messages", [])
        profile = state.get("profile", {})
        current_phase = state.get("current_phase", "trust")
        if state.get("new_phase"):
            current_phase = state.get("new_phase")

        proposed_plan = state.get("proposed_plan", "")
        db = state.get("db_session")
        user_input = state.get("user_input", "")
        is_first_message = len([m for m in messages if hasattr(m, 'type') and m.type == 'human']) <= 1

        # RAG + LTM (Isolated to Executor only)
        ltm_context = ""
        kb_context = ""
        if db and user_input:
            try:
                query_embedding = await asyncio.to_thread(embedder.encode, user_input)
                query_embedding = query_embedding.tolist()
                # LTM — retrieve relevant memories (traits, facts, insights about this user)
                result = await db.execute(
                    select(LongTermMemory)
                    .where(LongTermMemory.conversation_id == profile.get("conversation_id"))
                    .order_by(LongTermMemory.embedding.cosine_distance(query_embedding))
                    .limit(4)
                )
                memories = result.scalars().all()
                if memories:
                    ltm_context = (
                        "=== THINGS I ALREADY KNOW ABOUT THIS PERSON ===\n"
                        + "\n".join([f"- {m.content}" for m in memories])
                        + "\n\n"
                    )

                # KB — relevant conversation routing rules
                rag_result = await db.execute(
                    select(KnowledgeBaseChunk)
                    .order_by(KnowledgeBaseChunk.embedding.cosine_distance(query_embedding))
                    .limit(2)
                )
                rag_chunks = rag_result.scalars().all()
                if rag_chunks:
                    kb_context = (
                        "=== RELEVANT GUIDANCE RULES ===\n"
                        + "\n".join([f"- {c.content}" for c in rag_chunks])
                        + "\n\n"
                    )
            except Exception as e:
                print(f"RAG Error in Executor: {e}")

        # Detect user resistance signals
        resistance_signals = [
            "stop asking", "just tell me", "what do i do", "tell me what to do",
            "enough questions", "stop the questions", "i'm frustrated", "i am frustrated",
            "why are you asking", "just give me advice", "can you just"
        ]
        user_is_resistant = any(signal in user_input.lower() for signal in resistance_signals)

        # Build a safety/trust opener for the very first message
        first_message_instruction = ""
        if is_first_message:
            first_message_instruction = (
                "IMPORTANT — This is the very first message. Before anything else, you MUST:\n"
                "1. Warmly introduce yourself as Sahayam, a friend — NOT a career coach or therapist.\n"
                "2. Immediately establish psychological safety: tell the user this is a judgement-free zone, "
                "nothing leaves this conversation, there are no wrong answers, and you're just here to listen "
                "and understand them as a person.\n"
                "3. Keep it short, warm, and conversational. Sound like a WhatsApp message from a close friend, "
                "not a corporate onboarding email.\n"
                "4. Ask ONE gentle opening question that is about THEM as a person — NOT about their career or "
                "goals yet. Something like 'What's been on your mind lately?' or 'Tell me about something "
                "you've been working on that actually excites you.'\n\n"
            )

        # Build the resistance handler instruction
        resistance_instruction = ""
        if user_is_resistant:
            resistance_instruction = (
                "⚠️ RESISTANCE DETECTED: The user is showing frustration with being questioned.\n"
                "DO NOT ask another question right now. Instead:\n"
                "1. Acknowledge their feeling warmly and without judgment — they're allowed to feel that way.\n"
                "2. SHARE an observation or insight about what you've noticed about them so far based on the "
                "brain persona you've been building. Be specific and genuine — not generic.\n"
                "3. Let them know you're on their side and pivot to a warmer, more conversational mode.\n"
                "4. You can optionally end with an invitation (not a question) to continue when they're ready.\n\n"
            )

        system_prompt = (
            "<system_instructions>\n"
            "You are Sahayam. You are NOT a career coach, a therapist, or a productivity tool.\n\n"
            "You are a WARM, GENUINE AI COMPANION — like that one friend who truly gets you, remembers "
            "everything you've told them, and somehow always knows the right thing to say. You just happen "
            "to also be incredibly wise about careers and life direction.\n\n"
            "YOUR FUNDAMENTAL PURPOSE:\n"
            "Understand this person deeply — how they think, what drives them, what they fear, what they "
            "love, what they value — and build a rich picture of who they are as a HUMAN BEING first. "
            "Career guidance comes naturally from truly knowing a person. You are NOT trying to funnel "
            "them towards career advice quickly. You are genuinely curious about their story.\n\n"
            "TONE RULES (CRITICAL):\n"
            "- Sound like a WhatsApp message from a close friend who is also deeply insightful. "
            "NOT like ChatGPT. NOT like a therapist. NOT like a corporate chatbot.\n"
            "- Use casual, natural, conversational language. Contractions, short sentences, warmth.\n"
            "- Never use phrases like 'That's a great point!', 'I want to acknowledge...', "
            "'I'm noticing that you might be...', 'Am I right?'. These sound robotic and fake.\n"
            "- Validate feelings by just BEING with the person — not by labelling their emotions at them.\n"
            "- It's okay to be a little playful, a little real, occasionally a little direct.\n\n"
            "CONVERSATION RULES (CRITICAL):\n"
            "1. ONE QUESTION MAX: Ask a MAXIMUM of one focused question per response. Never stack questions.\n"
            "2. NO REPETITION: Never parrot back what the user just said. Add new energy or insight.\n"
            "3. NO JARGON: No psychological terms, no coaching frameworks, no corporate language.\n"
            "4. NO RUSH: Do not push towards career advice before you truly understand the person.\n"
            "5. NO INTERROGATION: If you've already asked about something, do not loop back to the same topic.\n"
            "6. MEMORY IS GOLD: If you know something about this person from memory, reference it naturally. "
            "This makes the conversation feel like talking to someone who truly knows you.\n\n"
            f"{first_message_instruction}"
            f"{resistance_instruction}"
            f"PLAN FOR THIS RESPONSE:\n{proposed_plan}\n\n"
            f"{ltm_context}{kb_context}"
            f"{_get_profile_context(profile)}"
            "YOUR RESPONSE:\n"
            "Write your response directly. Keep it natural, warm, human. "
            "If the plan asks you to explore something, do it conversationally — like a friend asking "
            "out of genuine curiosity, not like a form to fill in.\n"
            "</system_instructions>"
        )

        try:
            res = await self.llm.ainvoke([SystemMessage(content=system_prompt)] + messages)
            content = res.content

            # Clean up any hallucinated meta-commentary
            content = re.sub(r'\(Note:.*?\)', '', content, flags=re.IGNORECASE | re.DOTALL)
            content = re.sub(r'\[Note:.*?\]', '', content, flags=re.IGNORECASE | re.DOTALL)
            content = re.sub(r'\[[A-Z_]+\]', '', content).strip()

            return {"messages": [AIMessage(content=content)]}
        except Exception as e:
            print(f"Executor Agent Error: {e}")
            return {"messages": [AIMessage(content="Hey, I hit a tiny glitch on my end. Give me a second — can you say that again?")]}
