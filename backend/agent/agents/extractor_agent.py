from typing import List
from pydantic import BaseModel, Field
from langchain_core.messages import SystemMessage, AIMessage, HumanMessage
from backend.core.llm_factory import get_llm
from backend.agent.state import AgentState

class ExtractorOutput(BaseModel):
    traits: List[str] = Field(description="A list of 1-3 new core psychological traits demonstrated by the user. If none, an empty list.")

async def extraction_node(state: AgentState):
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
        
        logic_llm = get_llm(purpose="logic")
        structured_llm = logic_llm.with_structured_output(ExtractorOutput)
        
        try:
            res: ExtractorOutput = await structured_llm.ainvoke([SystemMessage(content=prompt)])
            for t in res.traits:
                if t not in extracted_traits["traits_uncovered"]:
                    extracted_traits["traits_uncovered"].append(t)
        except Exception as e:
            print(f"Extraction Node Error: {e}")
            pass
            
    return {"extracted_traits": extracted_traits}
