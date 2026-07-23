import json_repair
from langchain_core.messages import SystemMessage, AIMessage, HumanMessage
from backend.core.llm_factory import get_llm
from backend.agent.state import AgentState

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
            "Read this exchange and output a JSON list of 1-3 new core psychological traits demonstrated by the user. If none, output [].\n"
            "Format EXACTLY as:\n"
            "```json\n"
            "[\"Trait 1\", \"Trait 2\"]\n"
            "```\n"
            f"User: {user_msg}\n"
            f"Coach: {ai_msg}\n"
        )
        
        logic_llm = get_llm(purpose="logic")
        try:
            res = await logic_llm.ainvoke([SystemMessage(content=prompt)])
            s_idx = res.content.find('[')
            e_idx = res.content.rfind(']')
            if s_idx != -1 and e_idx != -1:
                new_traits = json_repair.loads(res.content[s_idx:e_idx+1])
                for t in new_traits:
                    if t not in extracted_traits["traits_uncovered"]:
                        extracted_traits["traits_uncovered"].append(t)
        except Exception:
            pass
            
    return {"extracted_traits": extracted_traits}
