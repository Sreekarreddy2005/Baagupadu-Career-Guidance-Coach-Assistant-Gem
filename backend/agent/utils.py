from backend.agent.state import AgentState

def should_execute(state: AgentState):
    """Conditional Edge from Evaluator"""
    if state.get("is_approved", True):
        return "execute"
    return "replan"

def should_synthesize(state: AgentState):
    """Conditional Edge from Extraction"""
    phase = state.get("new_phase") or state.get("current_phase")
    if phase in ["synthesis", "guidance"]:
        return "synthesize"
    return "end"
