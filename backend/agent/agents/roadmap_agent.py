from typing import List, Dict, Any
from pydantic import BaseModel, Field
from langchain_core.messages import SystemMessage
from backend.agent.state import AgentState
from backend.agent.agents.base_agent import BaseAgent

class RoadmapMilestone(BaseModel):
    title: str = Field(description="Title of the milestone (e.g., 'Master Core AI Concepts')")
    description: str = Field(description="A brief description of what to achieve")
    timeline: str = Field(description="Expected timeline (e.g., 'Months 1-3')")

class AccountabilityTask(BaseModel):
    task: str = Field(description="Specific actionable task (e.g., 'Build a RAG system')")
    why: str = Field(description="Why this matters based on their persona")
    status: str = Field(description="Always 'pending'")

class RoadmapOutput(BaseModel):
    roadmap: List[RoadmapMilestone] = Field(description="3-5 major career milestones")
    accountability: List[AccountabilityTask] = Field(description="3-5 concrete accountability tasks")

class RoadmapAgent(BaseAgent):
    def __init__(self):
        super().__init__(purpose="logic", structured_output_model=RoadmapOutput)
        
    async def invoke(self, state: AgentState) -> Dict[str, Any]:
        """
        6. Roadmap Node: Generates the personalized roadmap and accountability tasks.
        Triggered when phase transitions to 'guidance'.
        """
        profile = state.get("profile", {})
        extracted_traits = state.get("extracted_traits", {}).get("traits_uncovered", [])
        synthesis = profile.get("synthesis_summary", "No summary available.")
        
        traits_text = "\n- ".join(extracted_traits) if extracted_traits else "None recorded."
        
        prompt = (
            "You are the Roadmap and Accountability Generator for Sahayam.\n"
            "The user has reached the 'guidance' phase. Your job is to translate their psychological profile and career goals into a structured roadmap.\n\n"
            "USER PROFILE:\n"
            f"Traits: {traits_text}\n"
            f"Synthesis: {synthesis}\n\n"
            "INSTRUCTIONS:\n"
            "Generate 3-5 high-level milestones for their roadmap, and 3-5 highly specific, actionable accountability tasks tailored entirely to their goals (e.g., if they are an AI developer, give AI-specific tasks)."
        )
        
        try:
            res: RoadmapOutput = await self.structured_llm.ainvoke([SystemMessage(content=prompt)])
            
            roadmap_data = {
                "roadmap": [m.model_dump() for m in res.roadmap],
                "accountability": [t.model_dump() for t in res.accountability]
            }
            
            # We merge the generated guidance into the existing profile
            # so the api.py can save it
            existing_profile = dict(profile)
            existing_profile["guidance"] = roadmap_data
            
            return {"profile": existing_profile}
            
        except Exception as e:
            print(f"Roadmap Agent Error: {e}")
            existing_profile = dict(profile)
            existing_profile["guidance"] = {"roadmap": [], "accountability": []}
            return {"profile": existing_profile}
