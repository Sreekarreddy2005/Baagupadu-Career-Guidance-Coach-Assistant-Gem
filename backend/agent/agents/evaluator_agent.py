from typing import Dict, Any
from pydantic import BaseModel, Field
from langchain_core.messages import SystemMessage
from backend.agent.state import AgentState
from backend.agent.agents.base_agent import BaseAgent

class EvaluatorOutput(BaseModel):
    is_approved: bool = Field(description="True if the plan is approved, False if it violates guardrails")
    evaluator_feedback: str = Field(description="Empty string if approved. If rejected, strict explanation of which rubric it failed and how to fix it")

class EvaluatorAgent(BaseAgent):
    def __init__(self):
        super().__init__(purpose="logic", structured_output_model=EvaluatorOutput)
        
    async def invoke(self, state: AgentState) -> Dict[str, Any]:
        """
        2. Evaluator Node: Guardrails Enforcer using Qwen (Logic).
        Checks the proposed plan against guardrails.md.
        """
        proposed_plan = state.get("proposed_plan", "")
        messages = state.get("messages", [])
        
        guardrails_text = self.load_prompt_file(["gems", "nenu_evaru", "prompts", "guardrails.md"])
        recent_history = self.get_recent_history(messages, k=4)
        
        prompt = (
            "You are the Strict Evaluator Agent for a psychological career coach.\n"
            "Your job is to gatekeep the Execution Agent by reviewing its proposed plan before it is allowed to speak to the user.\n\n"
            f"GUARDRAILS (CRITICAL RULES):\n{guardrails_text}\n\n"
            f"RECENT CONVERSATION HISTORY:\n{recent_history}\n"
            f"PROPOSED PLAN FROM PLANNER:\n{proposed_plan}\n\n"
            "EVALUATION RUBRIC:\n"
            "1. SAFETY: Does this plan violate any guardrails? (e.g., trying to give advice during the exploration phase, or digging into trauma without trust).\n"
            "2. NECESSITY: Does this plan logically flow from the user's last message, or does it awkwardly pivot?\n"
            "3. TONE: Is the proposed plan too aggressive, clinical, or robotic? (It must be empathetic and organic).\n\n"
            "If the plan fails ANY of these 3 criteria, you MUST reject it by setting is_approved to false and providing feedback.\n"
        )
        
        try:
            res: EvaluatorOutput = await self.structured_llm.ainvoke([SystemMessage(content=prompt)])
            return {"is_approved": res.is_approved, "evaluator_feedback": res.evaluator_feedback}
        except Exception as e:
            print(f"Evaluator Agent Error: {e}")
            return {"is_approved": True, "evaluator_feedback": ""}
