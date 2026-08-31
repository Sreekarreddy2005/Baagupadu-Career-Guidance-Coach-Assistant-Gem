from typing import TypedDict, Annotated, Sequence, Optional
from langchain_core.messages import BaseMessage
import operator

class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], operator.add]
    profile: dict
    current_phase: str
    inferences_made: bool           # Flag to trigger profile updates
    alerts: Annotated[Sequence[str], operator.add]  # Track safety and routing alerts
    errors: Annotated[Sequence[str], operator.add]  # Track system errors for graceful handling
    new_phase: Optional[str]        # Phase the LLM signaled to transition to
    micro_phase: Optional[str]      # Dynamically determined sub-phase (e.g. childhood, teenage, adult)
    chat_ended: bool                # Whether the LLM signaled [END_CHAT]
    db_session: Optional[object]    # AsyncSession injected from API layer for pgvector querying
    user_input: Optional[str]       # The latest user string (used for querying vectors)
    proposed_plan: Optional[str]    # Plan proposed by the planner node
    is_approved: Optional[bool]     # Evaluator's approval of the plan
    evaluator_feedback: Optional[str] # Evaluator's feedback if rejected
    extracted_traits: dict          # Incrementally extracted traits
    # Emotion Conditioning
    detected_emotion: Optional[str] # Emotion classified by the Planner
    candidate_responses: list       # List of generated responses for MMI evaluation
    # Output state
    current_response: str # The response the agent is building
    extracted_variables: dict # Any key variables extracted this turn
    
    # Internal routing state
    retrieved_rules: str # The deterministic rules loaded for this turn
    tool_context: Optional[str]     # Context from external tools (e.g., DuckDuckGo)
    is_deflection: Optional[bool]   # Whether the user deflected the previous probe
    reflection_thought: Optional[str] # The Planner's internal thought on how to handle the deflection
