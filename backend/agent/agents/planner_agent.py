from typing import Optional, Dict, Any
from pydantic import BaseModel, Field
from langchain_core.messages import SystemMessage
from backend.agent.state import AgentState
from backend.agent.agents.base_agent import BaseAgent

class PlannerOutput(BaseModel):
    proposed_plan: str = Field(description="A detailed 2-3 sentence directive on what the Execution Agent must do and how it should sound")
    new_phase: str = Field(description="The new phase to transition to, or 'none' if staying in the current phase")
    micro_phase: Optional[str] = Field(description="The micro-phase to transition to ('childhood', 'teenage', 'adult', or 'none')")

class PlannerAgent(BaseAgent):
    def __init__(self):
        super().__init__(purpose="logic", structured_output_model=PlannerOutput)
        
    async def invoke(self, state: AgentState) -> Dict[str, Any]:
        """
        1. Planner Node: Lightweight Semantic Router using Qwen (Logic).
        Reads the user message + router.md.
        Outputs a short proposed plan and the phase.
        """
        messages = state.get("messages", [])
        current_phase = state.get("current_phase", "trust")
        
        if not messages:
            return {"proposed_plan": "Initial greeting and gentle introduction.", "new_phase": "trust"}
            
        recent_history = self.get_recent_history(messages, k=4)
        router_text = self.load_prompt_file(["gems", "nenu_evaru", "prompts", "router.md"])

        prompt = (
            "You are the Strategic Planner Agent for a highly empathetic career coaching AI.\n"
            "Your job is to analyze the recent conversation and strictly determine the optimal NEXT STEP.\n\n"
            f"ROUTER LOGIC & RULES:\n{router_text}\n\n"
            f"CURRENT PHASE: {current_phase}\n"
            f"RECENT CONVERSATION HISTORY:\n{recent_history}\n"
            "INSTRUCTIONS FOR YOUR PLAN:\n"
            "1. Analyze the User's Tone: Are they vulnerable, defensive, or ready to explore?\n"
            "2. Ensure Trust is Built: If the current phase is 'trust' and the user hasn't explicitly opened up yet (e.g. they just said 'yes' or short answers), DO NOT jump to exploration. Plan to ask a gentle, open-ended question to build rapport.\n"
            "3. Psychological Pivot: If the user talks about a surface-level technical goal (e.g. 'I want to be an AI developer'), DO NOT plan to ask about tech stacks or datasets. Plan to pivot to their psychological motivations (e.g. 'Why this path? What early life experiences or emotions drove this?').\n"
            "4. Determine the Goal & Micro-Phase: If trust is built and it's time to explore, decide which specific life stage (childhood, teenage, adult) provides the best context based on router.md.\n"
            "5. Formulate the Plan: Write a highly precise, actionable directive for the Execution Agent (e.g., 'Ask a warm, open-ended question to build trust' or 'Pivot to childhood to explore early influences').\n"
            "6. Non-Linear Bridging: If your plan involves jumping between life stages (e.g., childhood to adult) or categories, explicitly include a 'Bridge Technique' from router.md in your plan so the Executor knows HOW to phrase the transition smoothly without sounding abrupt.\n"
            "7. Phase Transition: Only transition to 'exploration', 'synthesis' or 'guidance' if the router conditions are fully met.\n"
        )
        
        try:
            res: PlannerOutput = await self.structured_llm.ainvoke([SystemMessage(content=prompt)])
            
            plan = res.proposed_plan
            phase = res.new_phase if res.new_phase and res.new_phase.lower() != "none" else current_phase
            micro_phase = res.micro_phase.lower() if res.micro_phase and res.micro_phase.lower() in ["childhood", "teenage", "adult"] else None
            
            if not plan:
                return {"proposed_plan": "Continue exploration gracefully.", "new_phase": current_phase, "micro_phase": None}
                
            return {"proposed_plan": plan, "new_phase": phase, "micro_phase": micro_phase}
        except Exception as e:
            print(f"Planner Agent Error: {e}")
            return {"proposed_plan": "Continue exploration gracefully.", "new_phase": current_phase, "micro_phase": None}
