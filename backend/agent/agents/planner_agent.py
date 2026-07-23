import json
from pathlib import Path
from langchain_core.messages import SystemMessage, HumanMessage
from backend.core.llm_factory import get_llm
from backend.agent.state import AgentState

async def planner_node(state: AgentState):
    """
    1. Planner Node: Lightweight Semantic Router using Qwen (Logic).
    Reads the user message + router.md.
    Outputs a short proposed plan and the phase.
    """
    messages = state.get("messages", [])
    if not messages:
        return {"proposed_plan": "Initial greeting and gentle introduction.", "new_phase": "trust"}
        
    # Format the last 4 messages to give the Planner a clear window of the conversation
    recent_history = ""
    for m in messages[-4:]:
        role = "User" if isinstance(m, HumanMessage) else "Coach"
        recent_history += f"{role}: {m.content}\n"
        
    current_phase = state.get("current_phase", "trust")
    
    try:
        router_path = Path(__file__).parent.parent.parent.parent / "gems" / "nenu_evaru" / "prompts" / "router.md"
        with open(router_path, "r", encoding="utf-8") as f:
            router_text = f.read()
    except Exception:
        router_text = ""

    prompt = (
        "You are the Strategic Planner Agent for a highly empathetic career coaching AI.\n"
        "Your job is to analyze the recent conversation and strictly determine the optimal NEXT STEP.\n\n"
        f"ROUTER LOGIC & RULES:\n{router_text}\n\n"
        f"CURRENT PHASE: {current_phase}\n"
        f"RECENT CONVERSATION HISTORY:\n{recent_history}\n"
        "INSTRUCTIONS FOR YOUR PLAN:\n"
        "1. Analyze the User's Tone: Are they vulnerable, defensive, or ready to explore?\n"
        "2. Ensure Trust is Built: If the current phase is 'trust' and the user hasn't explicitly opened up yet (e.g. they just said 'yes' or short answers), DO NOT jump to exploration. Plan to ask a gentle, open-ended question to build rapport.\n"
        "3. Psychological Pivot: If the user talks about a surface-level technical goal (e.g. 'I want to be an AI developer'), DO NOT plan to ask about tech stacks or datasets. Plan to pivot to their psychological motivations (e.g. 'Why this path? What early life experiences or emotions drove this?').\n"
        "4. Determine the Goal & Micro-Phase: If trust is built and it's time to explore, decide which specific life stage (childhood, teenage, adult) provides the best context based on router.md.\n"
        "5. Formulate the Plan: Write a highly precise, actionable directive for the Execution Agent (e.g., 'Ask a warm, open-ended question to build trust' or 'Pivot to childhood to explore early influences').\n"
        "6. Phase Transition: Only transition to 'exploration', 'synthesis' or 'guidance' if the router conditions are fully met.\n\n"
        "Format EXACTLY as:\n"
        "PLAN: <a detailed 2-3 sentence directive on what the Execution Agent must do and how it should sound>\n"
        "PHASE_OVERRIDE: <new_phase or 'none'>\n"
        "MICRO_PHASE_OVERRIDE: <childhood, teenage, adult, or none>"
    )
    
    logic_llm = get_llm(purpose="logic")
    try:
        res = await logic_llm.ainvoke([SystemMessage(content=prompt)])
        plan = ""
        phase = current_phase
        micro_phase = None
        
        if res and res.content:
            for line in res.content.split('\n'):
                if line.startswith("PLAN:"):
                    plan = line.replace("PLAN:", "").strip()
                elif line.startswith("PHASE_OVERRIDE:"):
                    override = line.replace("PHASE_OVERRIDE:", "").strip()
                    if override.lower() != "none":
                        phase = override
                elif line.startswith("MICRO_PHASE_OVERRIDE:"):
                    m_override = line.replace("MICRO_PHASE_OVERRIDE:", "").strip().lower()
                    if m_override in ["childhood", "teenage", "adult"]:
                        micro_phase = m_override
                        
        if not plan:
            return {"proposed_plan": "Continue exploration gracefully.", "new_phase": current_phase, "micro_phase": None}
            
        return {"proposed_plan": plan, "new_phase": phase, "micro_phase": micro_phase}
    except Exception as e:
        print(f"Planner Node Error: {e}")
        return {"proposed_plan": "Continue exploration gracefully.", "new_phase": current_phase, "micro_phase": None}
