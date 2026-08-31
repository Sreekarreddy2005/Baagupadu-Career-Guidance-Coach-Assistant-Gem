from typing import Dict, Any
from langchain_core.messages import AIMessage, SystemMessage
from backend.agent.agents.base_agent import BaseAgent
from backend.agent.state import AgentState
from pydantic import BaseModel, Field

class MMIEvaluatorOutput(BaseModel):
    selected_index: int = Field(description="The index (0, 1, or 2) of the best candidate response.")
    internal_reasoning: str = Field(description="Brief reason for selection based on MMI, uniqueness, and emotion alignment.")

class MMIEvaluatorAgent(BaseAgent):
    def __init__(self):
        super().__init__(purpose="logic", structured_output_model=MMIEvaluatorOutput)

    async def invoke(self, state: AgentState) -> Dict[str, Any]:
        """
        Evaluator Node (MMI Reranking):
        Takes the candidate responses from the Executor and scores them.
        Selects the most unique, emotionally aligned response.
        """
        candidates = state.get("candidate_responses", [])
        if not candidates:
            # Fallback if candidates are missing
            return {"messages": [AIMessage(content="I hear you.")]}
            
        if len(candidates) == 1:
            # If only one candidate was generated, just use it
            return {"messages": [AIMessage(content=candidates[0])]}

        detected_emotion = state.get("detected_emotion", "Neutral")
        
        system_prompt = (
            "You are the internal Evaluator Agent for Sahayam.\n"
            "Your job is to read 3 candidate responses and select the absolute BEST one.\n\n"
            "SCORING CRITERIA (MMI & Emotion Reranking):\n"
            "1. UNIQUENESS (Distinct-N): Reject generic, boring responses like 'That makes sense' or 'I understand'. Pick the one with the most organic, unique phrasing.\n"
            f"2. EMOTION ALIGNMENT: The user's detected emotion is {detected_emotion}. Which response mirrors, validates, or handles this emotion best?\n"
            "3. PERSONA: Reject robotic or preachy responses. Pick the one that sounds like a warm, insightful human friend.\n\n"
            "Here are the candidates:\n"
        )
        
        for i, cand in enumerate(candidates):
            system_prompt += f"\n[CANDIDATE {i}]:\n{cand}\n"
            
        system_prompt += "\nOutput the index (0, 1, or 2) of the best candidate."
        
        try:
            result = await self.structured_llm.ainvoke([SystemMessage(content=system_prompt)])
            best_idx = result.selected_index
            if best_idx not in range(len(candidates)):
                best_idx = 0
                
            best_response = candidates[best_idx]
            
            return {
                "messages": [AIMessage(content=best_response)],
                "current_response": best_response
            }
        except Exception as e:
            print(f"MMI Evaluator Agent Error: {e}")
            return {
                "messages": [AIMessage(content=candidates[0])],
                "current_response": candidates[0]
            }
