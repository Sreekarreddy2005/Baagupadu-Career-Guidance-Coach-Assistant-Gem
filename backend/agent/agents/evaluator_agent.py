from pathlib import Path
from langchain_core.messages import SystemMessage, HumanMessage
from backend.core.llm_factory import get_llm
from backend.agent.state import AgentState

async def evaluator_node(state: AgentState):
    """
    2. Evaluator Node: Guardrails Enforcer using Qwen (Logic).
    Checks the proposed plan against guardrails.md.
    """
    proposed_plan = state.get("proposed_plan", "")
    
    try:
        guardrails_path = Path(__file__).parent.parent.parent.parent / "gems" / "nenu_evaru" / "prompts" / "guardrails.md"
        with open(guardrails_path, "r", encoding="utf-8") as f:
            guardrails_text = f.read()
    except Exception:
        guardrails_text = ""
        
    messages = state.get("messages", [])
    
    # Format the last 4 messages to give the Evaluator full context of the tone
    recent_history = ""
    for m in messages[-4:]:
        role = "User" if isinstance(m, HumanMessage) else "Coach"
        recent_history += f"{role}: {m.content}\n"
    
    prompt = (
        "You are the Strict Evaluator Agent for a psychological career coach.\n"
        "Your job is to gatekeep the Execution Agent by reviewing its proposed plan before it is allowed to speak to the user.\n\n"
        f"GUARDRAILS (CRITICAL RULES):\n{guardrails_text}\n\n"
        f"RECENT CONVERSATION HISTORY:\n{recent_history}\n"
        f"PROPOSED PLAN FROM PLANNER:\n{proposed_plan}\n\n"
        "EVALUATION RUBRIC:\n"
        "1. SAFETY: Does this plan violate any guardrails? (e.g., trying to give advice during the exploration phase, or digging into trauma without trust).\n"
        "2. NECESSITY: Does this plan logically flow from the user's last message, or does it awkwardly pivot?\n"
        "3. TONE: Is the proposed plan too aggressive, clinical, or robotic? (It must be empathetic and organic).\n\n"
        "If the plan fails ANY of these 3 criteria, you MUST reject it.\n\n"
        "Format EXACTLY as:\n"
        "APPROVED: TRUE or FALSE\n"
        "FEEDBACK: <empty if TRUE, strict explanation of which rubric it failed and how to fix it if FALSE>"
    )
    
    logic_llm = get_llm(purpose="logic")
    try:
        res = await logic_llm.ainvoke([SystemMessage(content=prompt)])
        content = res.content.upper()
        
        is_approved = "APPROVED: TRUE" in content
        feedback = ""
        if not is_approved:
            for line in res.content.split('\n'):
                if line.startswith("FEEDBACK:"):
                    feedback = line.replace("FEEDBACK:", "").strip()
                    
        return {"is_approved": is_approved, "evaluator_feedback": feedback}
    except Exception as e:
        print(f"Evaluator Node Error: {e}")
        return {"is_approved": True, "evaluator_feedback": ""}
