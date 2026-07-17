import json
import re
from langchain_core.messages import SystemMessage, AIMessage, HumanMessage
from backend.core.llm_factory import get_llm
from backend.knowledge_base.loader import KnowledgeBaseLoader
from backend.agent.state import AgentState
from sentence_transformers import SentenceTransformer
from sqlalchemy.future import select
from backend.models import LongTermMemory

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
            f"Name: {demographics.get('full_name', 'Unknown')}\n"
            f"Location: {demographics.get('location', 'Unknown')}\n"
            f"Age Range: {demographics.get('age_range', 'Unknown')}\n"
            f"Current Status: {demographics.get('current_status', 'Unknown')}\n"
            f"Desired Role/Direction: {demographics.get('desired_role', 'Unknown')}\n"
            f"Primary Goal: {demographics.get('primary_goal', 'Unknown')}\n\n"
            "CRITICAL: Tailor your tone, analogies, and questions heavily based on this context. "
            "If they provided a Desired Role, hunt for traits in their childhood that match that role.\n\n"
        )

    return f"\n\n{demo_str}CURRENT USER PROFILE STATE:\n{json.dumps(profile, indent=2)}\n\nUse this profile to maintain context."

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

        kb_context = kb_loader.get_phase_context(current_phase)
        
        base_prompt = (
            "You are Sahayam, the AI agent for the Baagupadu project. "
            "Your goal is to guide the user holistically based on the non-linear "
            "rules defined in the knowledge base.\n\n"
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
            "Only append ONE tag per message. Do not explain the tag. Do not show it to the user.\n\n"
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
            
        # Parse JSON blocks
        try:
            start_idx = content.find('{')
            end_idx = content.rfind('}')
            
            if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
                json_str = content[start_idx:end_idx+1]
                extracted_data = json.loads(json_str)
                
                content = content[:start_idx].strip()
                content = re.sub(r'```(?:json)?\s*$', '', content, flags=re.MULTILINE).strip()
                
                if "quality_signals" in extracted_data:
                    if "guidance" not in profile: profile["guidance"] = {}
                    profile["guidance"]["quality_signals"] = extracted_data.get("quality_signals")
                    profile["guidance"]["final_summary"] = extracted_data.get("final_summary")
                elif current_phase == "synthesis":
                    profile["persona"] = extracted_data
                elif current_phase == "guidance":
                    profile.setdefault("guidance", {})["roadmap"] = extracted_data
        except Exception as e:
            errors.append(f"JSON Parse Error in responder_node: {str(e)}")
            
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
