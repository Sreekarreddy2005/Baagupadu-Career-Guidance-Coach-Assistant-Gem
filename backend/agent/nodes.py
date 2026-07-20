import json
import re
from langchain_core.messages import SystemMessage, AIMessage, HumanMessage
from backend.core.llm_factory import get_llm
from backend.knowledge_base.loader import KnowledgeBaseLoader
from backend.agent.state import AgentState
from sentence_transformers import SentenceTransformer
from sqlalchemy.future import select
from backend.models import LongTermMemory, KnowledgeBaseChunk

kb_loader = KnowledgeBaseLoader()

# Load the local offline embedding model (downloads on first run if not cached)
embedder = SentenceTransformer('all-MiniLM-L6-v2')

def _get_profile_context(profile: dict) -> str:
    demographics = profile.get("life_stage_data", {}).get("demographics", {})
    session_prog = profile.get("session_progress", {})
    
    demo_str = ""
    if demographics:
        demo_str = (
            "--- USER DEMOGRAPHICS ---\n"
            f"User's Name: {demographics.get('full_name', 'Unknown')}\n"
            f"Location: {demographics.get('location', 'Unknown')}\n"
            f"Age Range: {demographics.get('age_range', 'Unknown')}\n"
            f"Current Status: {demographics.get('current_status', 'Unknown')}\n"
            f"Desired Role/Direction: {demographics.get('desired_role', 'Unknown')}\n"
            f"Primary Goal: {demographics.get('primary_goal', 'Unknown')}\n\n"
            "CRITICAL: You are talking directly TO this user. Always address them in the second person ('you', 'your'). "
            "You may use their name occasionally to be personal, but NEVER refer to them in the third person (e.g., do NOT say 'Sreekar's childhood', say 'your childhood'). "
            "Tailor your tone, analogies, and questions heavily based on this context. "
            "If they provided a Desired Role, hunt for traits in their childhood that match that role.\n\n"
        )

    if profile.get("persona"):
        demo_str += f"Current Persona Draft:\n{json.dumps(profile['persona'], indent=2)}\n\n"
        
    if profile.get("guidance", {}).get("quality_signals"):
        signals = profile["guidance"]["quality_signals"]
        demo_str += f"Current Quality Signals & Uncovered Traits:\n{json.dumps(signals, indent=2)}\n\n"

    return f"\n\n{demo_str}Use this context to inform your responses."

async def context_router_node(state: AgentState):
    """
    A fast pre-routing node that uses a smaller Logic LLM to categorize the conversation 
    topic and decide which specific Markdown files to load into the main LLM's context.
    """
    messages = state.get("messages", [])
    current_phase = state.get("current_phase", "discovery")
    micro_phase = None
    
    if current_phase == "exploration" and messages:
        # Get the last user message
        last_user_msg = next((m.content for m in reversed(messages) if isinstance(m, HumanMessage)), "")
        
        if last_user_msg:
            # Use the logic model to quickly classify
            logic_llm = get_llm(purpose="logic")
            prompt = (
                "You are a routing agent. Read the user's message and determine if the conversational focus "
                "is about their 'childhood', 'teenage' years, or 'adult' life. "
                "If it's about growing up, kids, early school, output: childhood\n"
                "If it's about high school, teens, college, output: teenage\n"
                "If it's about career, recent jobs, adult life, output: adult\n"
                "If it is none of these or general, output: general\n\n"
                "User Message:\n" + last_user_msg + "\n\n"
                "Output ONLY a single word from the list above. No explanation."
            )
            
            try:
                response = await logic_llm.ainvoke([SystemMessage(content=prompt)])
                result = response.content.strip().lower()
                
                # Clean up any weird outputs
                if "childhood" in result:
                    micro_phase = "childhood"
                elif "teenage" in result:
                    micro_phase = "teenage"
                elif "adult" in result:
                    micro_phase = "adult"
                else:
                    micro_phase = "general"
                    
                print(f"🧠 Logic Router determined Micro-Phase: {micro_phase}")
            except Exception as e:
                print(f"⚠️ Logic Router failed: {e}. Defaulting to general exploration.")
                micro_phase = "general"

    return {"micro_phase": micro_phase}

async def router_node(state: AgentState):
    messages = state.get("messages", [])
    alerts = []
    errors = []
    
    try:
        if messages:
            last_msg = messages[-1].content.lower()
            
            safety_keywords = ["abuse", "suicide", "trauma", "kill myself", "depressed", "give up", "hopeless"]
            if any(k in last_msg for k in safety_keywords):
                alerts.append("CRITICAL_SAFETY_ALERT: User shows signs of severe distress. Trigger Trauma Protocol.")
                
            resistance_keywords = ["don't want to talk", "stop", "none of your business", "skip", "i don't know"]
            if any(k in last_msg for k in resistance_keywords):
                alerts.append("RESISTANCE_ALERT: User is guarded. Trigger Resistance Protocol. Back off gracefully.")
                
    except Exception as e:
        errors.append(f"RouterNode Error: {str(e)}")

    return {"alerts": alerts, "errors": errors, "new_phase": None, "chat_ended": False}

async def responder_node(state: AgentState):
    messages = state.get("messages", [])
    profile = state.get("profile", {})
    alerts = state.get("alerts", [])
    errors = state.get("errors", [])
    current_phase = state.get("current_phase", "discovery")
    db = state.get("db_session")
    user_input = state.get("user_input", "")
    
    try:
        # Fetch relevant Long-Term Memories via pgvector
        ltm_context = ""
        if db and user_input:
            query_embedding = embedder.encode(user_input).tolist()
            # Order by cosine distance (<=> operator in pgvector)
            result = await db.execute(
                select(LongTermMemory)
                .where(LongTermMemory.user_id == profile.get("user_id"))
                .order_by(LongTermMemory.embedding.cosine_distance(query_embedding))
                .limit(3)
            )
            memories = result.scalars().all()
            if memories:
                ltm_context = "=== LONG-TERM MEMORY (Retrieved via pgvector) ===\n"
                for mem in memories:
                    ltm_context += f"- [{mem.memory_type}]: {mem.content}\n"
                ltm_context += "Use these memories to inform your response deeply.\n\n"

        micro_phase = state.get("micro_phase")
        kb_context = kb_loader.get_phase_context(current_phase, micro_phase=micro_phase)
        
        # Fetch relevant rules/questions from the Vector DB (RAG)
        if db and user_input:
            rag_result = await db.execute(
                select(KnowledgeBaseChunk)
                .order_by(KnowledgeBaseChunk.embedding.cosine_distance(query_embedding))
                .limit(2)
            )
            rag_chunks = rag_result.scalars().all()
            if rag_chunks:
                kb_context += "\n=== DYNAMIC KNOWLEDGE BASE RULES & QUESTIONS ===\n"
                kb_context += "The following specific rules and questions have been dynamically retrieved based on the user's message. Use them if relevant:\n"
                for chunk in rag_chunks:
                    kb_context += f"[{chunk.source_file}]:\n{chunk.content}\n\n"
        
        base_prompt = (
            "<system_instructions>\n"
            "You are Sahayam, the conversational AI agent for the Baagupadu project. "
            "You are NOT a meta-agent or a programmer. You are the coach. "
            "Your goal is to guide the user holistically based on the rules defined below.\n\n"
            f"{ltm_context}"
            "=== KNOWLEDGE BASE START ===\n"
            f"{kb_context}\n"
            "=== KNOWLEDGE BASE END ===\n\n"
            "## PHASE TRANSITION RULES (CRITICAL - follow exactly)\n"
            "You move through 4 UI phases: discovery → exploration → synthesis → guidance.\n"
            "IMPORTANT: Your conversation logic is NON-LINEAR. You have access to childhood, teenage, and adult context IMMEDIATELY. "
            "You MUST jump between life stages fluidly as the conversation dictates. Do not wait for a phase transition to ask adult or teenage questions.\n\n"
            "To update the UI progress bar, append ONE of these exact tags at the very end of your message (invisible to the user):\n"
            "  [PHASE:exploration]  — emit this after establishing initial trust and beginning deeper life exploration.\n"
            "  [PHASE:synthesis]   — emit this when you have collected enough data across all life stages and are ready to build the persona.\n"
            "  [PHASE:guidance]    — emit this when persona synthesis is complete and you want to deliver the career roadmap.\n"
            "  [END_CHAT]          — emit this when guidance is fully delivered and the conversation is complete.\n"
            "CRITICAL OUTPUT CONSTRAINT:\n"
            "1. ONLY output your conversational response to the user as Sahayam.\n"
            "2. NEVER explain your internal logic, phases, or arcs. Do not break character.\n"
            "3. NEVER use meta-notes like '(Note: ...)' or '(OOC: ...)'.\n"
            "4. NEVER output any tags like [GROUNDING] or [PHASE...] UNLESS it is one of the EXACT 4 phase tags listed above, and ONLY append it silently at the very end.\n\n"
            "</system_instructions>\n\n"
        )
        
        if alerts:
            alert_context = "\n\n!!! ACTIVE ROUTER ALERTS !!!\n" + "\n".join(alerts) + "\nYou MUST adjust your response to handle these alerts immediately."
            base_prompt += alert_context
            
        system_prompt = base_prompt + _get_profile_context(profile)
        prompt_messages = [SystemMessage(content=system_prompt)] + messages
        
        chat_llm = get_llm(purpose="chat")
        
        # Use ainvoke for true concurrency
        response = await chat_llm.ainvoke(prompt_messages)
        
        content = response.content
        if isinstance(content, list):
            content = "".join([block.get("text", "") if isinstance(block, dict) else str(block) for block in content])
        elif not isinstance(content, str):
            content = str(content)

        new_phase = None
        chat_ended = False
        valid_phases = ["exploration", "synthesis", "guidance"]

        phase_match = re.search(r'\[PHASE:(\w+)\]', content)
        if phase_match:
            detected = phase_match.group(1).lower()
            if detected in valid_phases:
                new_phase = detected
                print(f"🔄 Phase transition detected: {current_phase} → {new_phase}")
            content = re.sub(r'\[PHASE:\w+\]', '', content).strip()

        if '[END_CHAT]' in content:
            chat_ended = True
            content = content.replace('[END_CHAT]', '').strip()
            print("✅ End-of-conversation signal detected.")
            
        # Clean up any hallucinated meta-notes or fake tags from the 8B model
        content = re.sub(r'\(Note:.*?\)', '', content, flags=re.IGNORECASE | re.DOTALL)
        content = re.sub(r'\[[A-Z_]+\]', '', content)
        content = content.strip()
            
            
        return {
            "messages": [AIMessage(content=content)],
            "profile": profile,
            "errors": errors,
            "new_phase": new_phase,
            "chat_ended": chat_ended,
        }
        
    except Exception as e:
        error_msg = f"ResponderNode Error: {str(e)}"
        print(f"❌ {error_msg}")
        errors.append(error_msg)
        fallback = "I apologize, but I am having trouble connecting to my cognitive engine right now. Could you please try sending your message again?"
        return {"messages": [AIMessage(content=fallback)], "errors": errors, "new_phase": None, "chat_ended": False}

async def profile_updater_node(state: AgentState):
    profile = state.get("profile", {})
    messages = state.get("messages", [])
    errors = state.get("errors", [])
    alerts = state.get("alerts", [])
    new_phase = state.get("new_phase", None)
    chat_ended = state.get("chat_ended", False)
    db = state.get("db_session")
    
    try:
        session_prog = profile.setdefault("session_progress", {})
        current_phase = session_prog.get("current_phase", "discovery")

        if new_phase and new_phase != current_phase:
            session_prog["previous_phase"] = current_phase
            session_prog["current_phase"] = new_phase

        if chat_ended:
            session_prog["completed"] = True
            session_prog["current_phase"] = "completed"

        if len(messages) >= 2:
            user_msg = next((m.content for m in reversed(messages) if isinstance(m, HumanMessage)), "")
            ai_msg = next((m.content for m in reversed(messages) if isinstance(m, AIMessage)), "")
            
            # --- EVALUATOR ARCHITECTURE: QWEN 2.5 METRICS ---
            if user_msg and ai_msg:
                try:
                    evaluator_prompt = (
                        "You are a strict Psychological Evaluator. Read the following exchange between a user and a career coach.\n"
                        "Output ONLY a JSON block containing quality metrics and any newly uncovered traits. Format exactly as:\n"
                        "```json\n"
                        "{\n"
                        "  \"quality_signals\": {\n"
                        "    \"empathy_score\": \"XX%\",\n"
                        "    \"user_resonance\": \"High/Medium/Low\",\n"
                        "    \"routine_adherence\": \"String\",\n"
                        "    \"clarity\": \"String\"\n"
                        "  },\n"
                        "  \"traits_uncovered\": [\"Trait 1\", \"Trait 2\"]\n"
                        "}\n"
                        "```\n"
                        f"User: {user_msg}\n"
                        f"Coach: {ai_msg}\n"
                    )
                    
                    logic_llm = get_llm(purpose="logic")
                    eval_response = await logic_llm.ainvoke([SystemMessage(content=evaluator_prompt)])
                    eval_content = eval_response.content
                    
                    start_idx = eval_content.find('{')
                    end_idx = eval_content.rfind('}')
                    if start_idx != -1 and end_idx != -1:
                        eval_json = json.loads(eval_content[start_idx:end_idx+1])
                        
                        if "quality_signals" in eval_json:
                            profile.setdefault("guidance", {})["quality_signals"] = eval_json["quality_signals"]
                        
                        # Merge traits safely with deduplication
                        new_traits = eval_json.get("traits_uncovered", [])
                        if new_traits and isinstance(new_traits, list):
                            existing_traits = profile.setdefault("persona", {}).setdefault("traits_uncovered", [])
                            for t in new_traits:
                                t_clean = t.strip()
                                if not t_clean:
                                    continue
                                # Fuzzy deduplication: don't add if it's highly similar to an existing trait
                                is_duplicate = False
                                for ext in existing_traits:
                                    if t_clean.lower() in ext.lower() or ext.lower() in t_clean.lower():
                                        is_duplicate = True
                                        break
                                if not is_duplicate:
                                    existing_traits.append(t_clean)
                            
                            # Keep only the last 20 traits to prevent context bloat
                            profile["persona"]["traits_uncovered"] = existing_traits[-20:]
                                    
                except Exception as eval_e:
                    print(f"Metrics Evaluator Error: {eval_e}")
            
            # Simple heuristic Insight Extraction for LTM
            if db and user_msg:
                # In production, we'd use an LLM call to extract crisp insights.
                # Here, we save messages with high emotional resonance as vectorized insights.
                vuln_words = {"love", "hate", "sad", "happy", "fear", "angry", "lonely", "cry", "pain"}
                if any(w in user_msg.lower() for w in vuln_words) or len(user_msg.split()) > 20:
                    embedding = embedder.encode(user_msg).tolist()
                    ltm = LongTermMemory(
                        user_id=profile.get("user_id"),
                        memory_type="conversation_insight",
                        content=user_msg,
                        embedding=embedding
                    )
                    db.add(ltm)
                    # We do not commit here because the caller api.py handles the commit

        return {"profile": profile, "errors": errors}
    except Exception as e:
        error_msg = f"ProfileUpdaterNode Error: {str(e)}"
        print(f"❌ {error_msg}")
        errors.append(error_msg)
        return {"errors": errors}

def should_update_profile(state: AgentState):
    return "update_profile"
