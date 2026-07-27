from pathlib import Path
from typing import List, Type, Any, Dict
from pydantic import BaseModel
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage, BaseMessage
from backend.core.llm_factory import get_llm
from backend.agent.state import AgentState

class BaseAgent:
    def __init__(self, purpose: str = "logic", structured_output_model: Type[BaseModel] = None):
        """
        Initializes the agent with the appropriate LLM.
        :param purpose: 'logic' (Qwen/Deepseek) or 'chat' (Llama/Empathetic models)
        :param structured_output_model: Pydantic model for structured JSON output
        """
        self.purpose = purpose
        self.llm = get_llm(purpose=purpose)
        if structured_output_model:
            self.structured_llm = self.llm.with_structured_output(structured_output_model)
        else:
            self.structured_llm = None
            
    def get_recent_history(self, messages: List[BaseMessage], k: int = 4) -> str:
        """
        Formats the last 'k' messages into a readable string format.
        """
        if not messages:
            return ""
            
        recent_history = ""
        for m in messages[-k:]:
            role = "User" if isinstance(m, HumanMessage) else "Coach"
            recent_history += f"{role}: {m.content}\n"
        return recent_history
        
    def load_prompt_file(self, file_path_parts: List[str]) -> str:
        """
        Loads a markdown prompt file from the project directory.
        :param file_path_parts: List of path components relative to the project root
                                e.g., ["gems", "nenu_evaru", "prompts", "router.md"]
        """
        try:
            # Assumes this script is in backend/agent/agents/base_agent.py (4 levels deep)
            base_path = Path(__file__).parent.parent.parent.parent
            target_path = base_path.joinpath(*file_path_parts)
            with open(target_path, "r", encoding="utf-8") as f:
                return f.read()
        except Exception as e:
            print(f"Error loading prompt file {'/'.join(file_path_parts)}: {e}")
            return ""
            
    async def invoke(self, state: AgentState) -> Dict[str, Any]:
        """
        The main method that will be called by LangGraph.
        Must be implemented by subclasses.
        """
        raise NotImplementedError("Subclasses must implement the invoke method.")
