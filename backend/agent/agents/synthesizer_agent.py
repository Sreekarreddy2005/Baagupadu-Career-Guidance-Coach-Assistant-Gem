from typing import Dict, Any
from pydantic import BaseModel, Field
from langchain_core.messages import SystemMessage
from backend.agent.state import AgentState
from backend.agent.agents.base_agent import BaseAgent

class SynthesisOutput(BaseModel):
    is_synthesized: bool = Field(description="Always true")
    summary: str = Field(description="The synthesized summary of the user's psychological profile")

class SynthesizerAgent(BaseAgent):
    def __init__(self):
        super().__init__(purpose="logic", structured_output_model=SynthesisOutput)
        
    async def invoke(self, state: AgentState) -> Dict[str, Any]:
        """
        5. Synthesis Node: Final summary using Qwen (Logic).
        Triggered only when transitioning to Phase 5.
        """
        extracted_traits = state.get("extracted_traits", {}).get("traits_uncovered", [])
        messages = state.get("messages", [])
        
        # We might need a longer history for synthesis, but keeping it bounded for now
        history_text = self.get_recent_history(messages, k=20)
        traits_text = "\n- ".join(extracted_traits) if extracted_traits else "None recorded yet."
        
        prompt = (
            "You are the Synthesis Agent for Sahayam, a psychological career coach.\n"
            "The user has reached the end of the exploration phase.\n"
            "Your job is to read their extracted traits and recent conversation history, and generate a cohesive psychological profile summary.\n\n"
            "EXTRACTED TRAITS:\n"
            f"- {traits_text}\n\n"
            f"CONVERSATION HISTORY:\n{history_text}\n\n"
            "INSTRUCTIONS:\n"
            "Write a 1-paragraph summary that connects their childhood/teenage/adult experiences to their core motivations and career desires. Be highly analytical but empathetic."
        )
        
        try:
            res: SynthesisOutput = await self.structured_llm.ainvoke([SystemMessage(content=prompt)])
            return {"profile": {"synthesis_summary": res.summary}}
        except Exception as e:
            print(f"Synthesizer Agent Error: {e}")
            return {"profile": {"synthesis_summary": "Error generating synthesis."}}
