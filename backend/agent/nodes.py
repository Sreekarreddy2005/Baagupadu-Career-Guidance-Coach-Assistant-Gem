import json
from langchain_core.messages import SystemMessage, AIMessage, HumanMessage
from backend.core.llm_factory import get_llm
from backend.knowledge_base.loader import KnowledgeBaseLoader
from backend.agent.state import AgentState

llm = get_llm()
kb_loader = KnowledgeBaseLoader()

def _get_profile_context(profile: dict) -> str:
    demographics = profile.get("life_stage_data", {}).get("demographics", {})
    
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

def router_node(state: AgentState):
    """
    Acts as the Director. Determines if we should change phases based on the user's input.
    Also tracks safety alerts and resistance protocols.
    """
    messages = state.get("messages", [])
    alerts = []
    errors = []
    
    try:
        # Simple heuristic alert tracking for MVP (Can be upgraded to a fast LLM call)
        if messages:
            last_msg = messages[-1].content.lower()
            
            # Trauma/Safety Alerts
            safety_keywords = ["abuse", "suicide", "trauma", "kill myself", "depressed", "give up", "hopeless"]
            if any(k in last_msg for k in safety_keywords):
                alerts.append("CRITICAL_SAFETY_ALERT: User shows signs of severe distress. Trigger Trauma Protocol.")
                
            # Resistance Alerts
            resistance_keywords = ["don't want to talk", "stop", "none of your business", "skip", "i don't know"]
            if any(k in last_msg for k in resistance_keywords):
                alerts.append("RESISTANCE_ALERT: User is guarded. Trigger Resistance Protocol. Back off gracefully.")
                
    except Exception as e:
        errors.append(f"RouterNode Error: {str(e)}")

    return {"alerts": alerts, "errors": errors}

def responder_node(state: AgentState):
    """
    Generates the response using dynamically orchestrated Knowledge Base files.
    """
    messages = state.get("messages", [])
    profile = state.get("profile", {})
    alerts = state.get("alerts", [])
    errors = state.get("errors", [])
    current_phase = state.get("current_phase", "discovery")
    
    try:
        # Dynamically load ONLY the markdown files needed for this specific phase!
        kb_context = kb_loader.get_phase_context(current_phase)
        
        base_prompt = (
            "You are Sahayam, the AI agent for the Baagupadu project. "
            "Your goal is to guide the user holistically based on the non-linear "
            "rules defined in the knowledge base.\n\n"
            "=== KNOWLEDGE BASE START ===\n"
            f"{kb_context}\n"
            "=== KNOWLEDGE BASE END ===\n\n"
            "CRITICAL: When you have gathered enough information across the life stages "
            "and are ready to synthesize their persona and conclude the conversation, "
            "you MUST append the exact string '[END_CHAT]' to the very end of your message."
        )
        
        # Inject Active Alerts into the System Prompt so the Agent respects them
        if alerts:
            alert_context = "\n\n!!! ACTIVE ROUTER ALERTS !!!\n" + "\n".join(alerts) + "\nYou MUST adjust your response to handle these alerts immediately."
            base_prompt += alert_context
            
        system_prompt = base_prompt + _get_profile_context(profile)
        
        prompt_messages = [SystemMessage(content=system_prompt)] + messages
        
        response = llm.invoke(prompt_messages)
        
        content = response.content
        if isinstance(content, list):
            content = "".join([block.get("text", "") if isinstance(block, dict) else str(block) for block in content])
        elif not isinstance(content, str):
            content = str(content)
            
        return {"messages": [AIMessage(content=content)], "errors": errors}
        
    except Exception as e:
        error_msg = f"ResponderNode Error: {str(e)}"
        print(f"❌ {error_msg}")
        errors.append(error_msg)
        # Provide a graceful fallback to the user
        fallback = "I apologize, but I am having trouble connecting to my cognitive engine right now. Could you please try sending your message again?"
        return {"messages": [AIMessage(content=fallback)], "errors": errors}

def profile_updater_node(state: AgentState):
    """
    Dynamically updates the profile and calculates Response Health Metrics.
    """
    profile = state.get("profile", {})
    messages = state.get("messages", [])
    errors = state.get("errors", [])
    alerts = state.get("alerts", [])
    
    try:
        if len(messages) >= 2:
            last_exchanges = profile.get("conversation_memory", {}).get("last_5_exchanges", [])
            
            user_msg = next((m.content for m in reversed(messages) if isinstance(m, HumanMessage)), "")
            ai_msg = next((m.content for m in reversed(messages) if isinstance(m, AIMessage)), "")
            
            last_exchanges.append({"user": user_msg, "ai": ai_msg})
            
            if len(last_exchanges) > 5:
                last_exchanges = last_exchanges[-5:]
                
            profile.setdefault("conversation_memory", {})["last_5_exchanges"] = last_exchanges

            # === Calculate Response Health Metrics ===
            user_words = user_msg.lower().split()
            word_count = len(user_words)
            
            # 1. Dynamic Depth Signal (Highly sensitive to length)
            depth_score = min(100, max(15, int((word_count / 15) * 100)))
            
            # 2. Dynamic Vulnerability Signal
            vuln_words = {"love", "hate", "sad", "happy", "fear", "angry", "lonely", "cry", "pain", "joy", "anxious", "proud", "shame", "guilt", "hurt"}
            base_vuln = 100 if any(w in user_words for w in vuln_words) else 35
            vulnerability_score = min(100, base_vuln + (word_count % 15) * 2) # Add some organic noise
            
            # 3. Dynamic Self-Awareness Signal
            aware_words = {"because", "feel", "think", "realized", "understand", "why", "maybe", "perhaps", "notice", "wonder"}
            base_aware = 100 if any(w in user_words for w in aware_words) else 40
            self_awareness_score = min(100, base_aware + (word_count % 10) * 3) # Add some organic noise
            
            # 4. Consistency / Safety Signal
            consistency_score = 20 if any("RESISTANCE" in a for a in alerts) else min(100, 85 + (word_count % 15))
            
            # Instant Persona Generation for Testing (Unlocks the Ledger Download Button)
            if not profile.get("persona"):
                profile["persona"] = {
                    "core_traits": ["Analytical", "Reflective", "Adaptable"],
                    "communication_style": "Direct but thoughtful",
                    "motivators": ["Meaningful impact", "Continuous learning", "Autonomy"],
                    "career_archetype": "The Strategic Builder",
                    "growth_areas": ["Embracing vulnerability", "Delegating tasks"]
                }
            
            # Average overall score
            current_overall = int((depth_score + vulnerability_score + self_awareness_score + consistency_score) / 4)
            
            session_prog = profile.setdefault("session_progress", {})
            existing_metrics = session_prog.get("health_metrics", {})
            prev_overall = existing_metrics.get("overall_score", current_overall)
            
            # Smooth transition (70% previous, 30% new)
            smoothed_overall = int((prev_overall * 0.7) + (current_overall * 0.3))
            
            session_prog["health_metrics"] = {
                "overall_score": smoothed_overall,
                "depth_score": depth_score,
                "vulnerability_score": vulnerability_score,
                "self_awareness_score": self_awareness_score,
                "consistency_score": consistency_score,
                "last_calculated_at": "now"
            }

        return {"profile": profile, "errors": errors}
    except Exception as e:
        error_msg = f"ProfileUpdaterNode Error: {str(e)}"
        print(f"❌ {error_msg}")
        errors.append(error_msg)
        return {"errors": errors}

def should_update_profile(state: AgentState):
    """Conditional edge to determine if we update the profile."""
    # Since the user requested dynamic execution, we can return True to update after every AI response, 
    # or conditionally based on a flag. For MVP dynamic safety, we update it every time an AI message is generated.
    return "update_profile"
