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

# Load few-shot tone examples into memory for fast RAG
few_shot_examples = []
few_shot_embeddings = []
import os
import json
import numpy as np

few_shot_path = os.path.join(kb_loader.gems_dir, "few_shot_examples.json")
if os.path.exists(few_shot_path):
    with open(few_shot_path, "r", encoding="utf-8") as f:
        few_shot_examples = json.load(f)
        # Precompute embeddings for the user inputs to make semantic matching O(1) latency
        if few_shot_examples:
            few_shot_embeddings = embedder.encode([ex["user_input"] for ex in few_shot_examples])


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
    graph_edges = persona.get("mental_graph_edges", [])

    brain_parts = []
    trait_weights = persona.get("trait_weights", {})
    if traits:
        weighted_traits_str = ", ".join([
            f"{t} ({int(trait_weights.get(t, 0.35)*100)}% confidence)" for t in traits
        ])
        brain_parts.append(f"Personality traits: {weighted_traits_str}")
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
    if graph_edges:
        edge_strs = [f"[{e.get('source')}] --({e.get('relation')})--> [{e.get('target')}]" for e in graph_edges]
        brain_parts.append(f"Mental Map Connections:\n  " + "\n  ".join(edge_strs))

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
        voice_instruction = ""
        if profile.get("_voice_mode"):
            voice_instruction = (
                "VOICE CALL MODE (CRITICAL): This will be spoken aloud in a live conversation. "
                "Reply like a 20-year-old texting a close friend naturally, not like you are reading a written message. "
                "Be extremely brief. Use one or two short sentences, natural pauses, and everyday casual words. "
                "No markdown, headings, bullet points, labels, lists, URLs, or emoji. "
                "Do not summarize the user's words back to them. NEVER ask complex, philosophical, or essay-style questions. "
                "If you ask a question, make it extremely low-effort and casual (e.g., 'oh nice, what kind?').\n\n"
            )
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
                        "=== MEMORIES FROM THIS CURRENT CONVERSATION (CALLBACK TARGETS) ===\n"
                        + "\n".join([f"- {m.content}" for m in memories])
                        + "\n\n"
                        "CALLBACK INSTRUCTION: If naturally relevant, reference 1 specific detail from the memories above (e.g. 'Earlier you mentioned...'). Use it to show you remember their words like a close friend, but do not force it.\n\n"
                    )

                # We inject the current phase and micro-phase into the semantic query
                # so pgvector naturally surfaces the correct rules, frameworks, and question banks
                # from ANY file in gems/nenu_evaru (e.g. trust_building_phase, system_prompt, etc.)
                micro_phase = state.get("micro_phase", "")
                kb_search_query = f"Phase: {current_phase}. Micro-phase: {micro_phase}. Relevant rules, frameworks, and instructions for context: {user_input}"
                
                kb_query_embedding = await asyncio.to_thread(embedder.encode, kb_search_query)
                kb_query_embedding = kb_query_embedding.tolist()
                
                rag_result = await db.execute(
                    select(KnowledgeBaseChunk)
                    .order_by(KnowledgeBaseChunk.embedding.cosine_distance(kb_query_embedding))
                    .limit(3)
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

        # --- DYNAMIC FEW-SHOT INJECTION ---
        few_shot_context = ""
        if user_input and len(few_shot_examples) > 0 and len(few_shot_embeddings) > 0:
            try:
                # We already computed query_embedding above for LTM RAG
                q_emb = await asyncio.to_thread(embedder.encode, user_input)
                
                # Compute cosine similarities
                from numpy.linalg import norm
                import numpy as np
                
                # Reshape if necessary and compute similarities
                q_vec = np.array(q_emb)
                similarities = []
                for i, emb in enumerate(few_shot_embeddings):
                    sim = np.dot(q_vec, emb) / (norm(q_vec) * norm(emb))
                    similarities.append((sim, few_shot_examples[i]))
                
                # Sort by similarity descending and pick top 2
                similarities.sort(key=lambda x: x[0], reverse=True)
                top_examples = [item[1] for item in similarities[:2]]
                
                few_shot_context = (
                    "=== TONE & STYLE EXAMPLES (CRITICAL) ===\n"
                    "Match the exact casual, warm cadence of these perfect human responses. Do not copy them literally, but mimic the *vibe* perfectly.\n\n"
                )
                for ex in top_examples:
                    few_shot_context += f"If User says: \"{ex['user_input']}\"\n"
                    few_shot_context += f"You reply: \"{ex['ideal_response']}\"\n\n"
            except Exception as e:
                print(f"Few-Shot Injection Error: {e}")

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

        # Build trust phase instruction for early exchanges
        trust_instruction = ""
        if current_phase == "trust" and not is_first_message:
            trust_instruction = (
                "🌱 TRUST & RAPPORT BUILDING ACTIVE:\n"
                "You are in the early friendship stage. Keep everything very casual, warm, and zero-pressure.\n"
                "- If the user says 'yes', 'ready', 'sure', or gives a brief confirmation/greeting, match their vibe warmly and ask an easy, everyday ice-breaker (e.g. 'How has your day been going so far?' or 'What kind of things have been keeping you busy lately?').\n"
                "- DO NOT ask heavy, analytical, career-heavy, or psychological questions yet. Warm up together like two close friends hanging out.\n\n"
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
            "- USE EMOJIS NATURALLY: Occasionally use emojis (like 😂, 💀, ✨, 😊, 🥺) and text-style reactions ('omg', 'haha', 'damn') just like a real friend would.\n"
            "- Never use phrases like 'That's a great point!', 'I want to acknowledge...', "
            "'I'm noticing that you might be...', 'Am I right?'. These sound robotic and fake.\n"
            "- Validate feelings by just BEING with the person — not by labelling their emotions at them.\n"
            "- It's okay to be a little playful, a little real, occasionally a little direct.\n"
            "- EARNED PRAISE ONLY: Do not act like a generic cheerleader. Do not praise the user for every message or say 'Oh that's really great!' for ordinary answers. Only praise or validate when the user has genuinely achieved something, shared a win, or when it truly fits the emotional situation. Be a genuine friend.\n\n"
            "CONVERSATION RULES (CRITICAL):\n"
            "1. ONE QUESTION MAX: Ask a MAXIMUM of one focused question per response. Never stack questions.\n"
            "2. NO MULTIPLE CHOICE: Do NOT end questions with options like 'is it X, or something else entirely?'. Just ask the question naturally and leave it open-ended.\n"
            "3. NO REPETITION: Never parrot back what the user just said. Add new energy or insight.\n"
            "3. NO JARGON: No psychological terms, no coaching frameworks, no corporate language.\n"
            "4. NO RUSH: Do not push towards career advice before you truly understand the person.\n"
            "5. NO INTERROGATION: If you've already asked about something, do not loop back to the same topic.\n"
            "6. CURRENT SESSION CALLBACKS ONLY: When recalling details or referencing what the user shared, reference facts and memories shared during THIS conversation naturally (e.g. 'You mentioned earlier you worked on...'). Do not invent or pull facts outside this conversation.\n"
            "7. CASUAL ICE-BREAKERS IN TRUST PHASE: In the early phase, focus on casual connection and friendly check-ins before digging into deeper self-discovery.\n\n"
            f"{first_message_instruction}"
            f"{trust_instruction}"
            f"{resistance_instruction}"
            f"{voice_instruction}"
            f"{few_shot_context}"
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
