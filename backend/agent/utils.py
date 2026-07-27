from backend.agent.state import AgentState

def should_execute(state: AgentState):
    """Conditional Edge from Evaluator"""
    if state.get("is_approved", True):
        return "execute"
    return "replan"

def should_synthesize(state: AgentState):
    """Conditional Edge from Extraction"""
    phase = state.get("new_phase") or state.get("current_phase")
    if phase == "synthesis":
        return "synthesize"
    elif phase == "guidance":
        return "roadmap"
    return "end"
