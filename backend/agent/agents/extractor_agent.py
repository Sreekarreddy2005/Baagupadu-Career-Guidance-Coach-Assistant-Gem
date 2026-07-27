from typing import List, Dict, Any
from pydantic import BaseModel, Field
from langchain_core.messages import SystemMessage, AIMessage, HumanMessage
from backend.agent.state import AgentState
from backend.agent.agents.base_agent import BaseAgent

class ExtractorOutput(BaseModel):
    traits: List[str] = Field(description="A list of 1-3 new core psychological traits demonstrated by the user. If none, an empty list.")

class ExtractorAgent(BaseAgent):
    def __init__(self):
        super().__init__(purpose="logic", structured_output_model=ExtractorOutput)
        
    async def invoke(self, state: AgentState) -> Dict[str, Any]:
        """
        4. Extraction Node: Background task using Qwen (Logic).
        Incrementally extracts traits to build the Persona over time.
        """
        messages = state.get("messages", [])
        extracted_traits = state.get("extracted_traits", {})
        if "traits_uncovered" not in extracted_traits:
            extracted_traits["traits_uncovered"] = []
            
        if len(messages) >= 2:
            user_msg = next((m.content for m in reversed(messages) if isinstance(m, HumanMessage)), "")
            ai_msg = next((m.content for m in reversed(messages) if isinstance(m, AIMessage)), "")
            
            prompt = (
                "You are a background psychological extractor.\n"
                "Read this exchange and output a list of 1-3 new core psychological traits demonstrated by the user. If none, output an empty list.\n"
                f"User: {user_msg}\n"
                f"Coach: {ai_msg}\n"
            )
            
            try:
                res: ExtractorOutput = await self.structured_llm.ainvoke([SystemMessage(content=prompt)])
                for t in res.traits:
                    if t not in extracted_traits["traits_uncovered"]:
                        extracted_traits["traits_uncovered"].append(t)
            except Exception as e:
                print(f"Extractor Agent Error: {e}")
                pass
                
        return {"extracted_traits": extracted_traits}
