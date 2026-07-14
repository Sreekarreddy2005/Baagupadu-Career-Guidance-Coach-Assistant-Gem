from typing import TypedDict, Annotated, Sequence
from langchain_core.messages import BaseMessage
import operator

class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], operator.add]
    profile: dict
    current_phase: str
    inferences_made: bool # Flag to trigger profile updates
    alerts: Annotated[Sequence[str], operator.add] # Track safety and routing alerts
    errors: Annotated[Sequence[str], operator.add] # Track system errors for graceful handling
