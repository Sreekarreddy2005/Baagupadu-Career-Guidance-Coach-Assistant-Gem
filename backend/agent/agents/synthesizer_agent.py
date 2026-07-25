from typing import List, Optional
from pydantic import BaseModel, Field
from langchain_core.messages import SystemMessage
from backend.core.llm_factory import get_llm
from backend.agent.state import AgentState

# Pydantic Models for Persona
class CoreIdentity(BaseModel):
    archetype_name: str
    tagline: str
    description: str
    description_for_user: str

class Strength(BaseModel):
    trait: str
    evidence: str

class GrowthArea(BaseModel):
    area: str
    compassionate_framing: str

class PersonaProfile(BaseModel):
    core_identity: CoreIdentity
    strengths: List[Strength]
    growth_areas: List[GrowthArea]

# Pydantic Models for Roadmap
class CareerPath(BaseModel):
    title: str
    why: str

class TechnicalPathItem(BaseModel):
    skill: str
    description: str
    next_skill: str

class ActionTask(BaseModel):
    action: str
    points: int
    details: str

class ActionStage(BaseModel):
    timeframe: str
    tasks: List[ActionTask]

class CareerRoadmap(BaseModel):
    primary_career_path: CareerPath
    technical_path: List[TechnicalPathItem]
    action_plan: List[ActionStage]
    skill_gaps: List[str]


async def synthesis_node(state: AgentState):
    """
    5. Synthesis Node: Evaluator LLM (Qwen).
    Generates the final Persona/Roadmap JSON based ONLY on extracted_traits.
    Triggered only when transitioning to synthesis or guidance.
    """
    current_phase = state.get("current_phase", "trust")
    extracted_traits = state.get("extracted_traits", {}).get("traits_uncovered", [])
    profile = state.get("profile", {})
    
    if current_phase == "synthesis" and "persona" not in profile:
        prompt = (
            "You are the Backend AI Evaluator.\n"
            "Based on these extracted user traits, generate a deep Persona Profile.\n"
            f"EXTRACTED TRAITS: {extracted_traits}"
        )
        logic_llm = get_llm(purpose="logic")
        structured_llm = logic_llm.with_structured_output(PersonaProfile)
        try:
            res: PersonaProfile = await structured_llm.ainvoke([SystemMessage(content=prompt)])
            persona_dict = res.model_dump()
            persona_dict["traits_uncovered"] = extracted_traits
            profile["persona"] = persona_dict
        except Exception as e:
            print(f"Synthesis Node Persona Error: {e}")
            
    elif current_phase == "guidance" and "roadmap" not in profile.get("guidance", {}):
        prompt = (
            "You are the Backend AI Evaluator.\n"
            "Based on these traits, generate a detailed 3-stage Career Roadmap.\n"
            f"EXTRACTED TRAITS: {extracted_traits}"
        )
        logic_llm = get_llm(purpose="logic")
        structured_llm = logic_llm.with_structured_output(CareerRoadmap)
        try:
            res: CareerRoadmap = await structured_llm.ainvoke([SystemMessage(content=prompt)])
            profile.setdefault("guidance", {})["roadmap"] = res.model_dump()
        except Exception as e:
            print(f"Synthesis Node Roadmap Error: {e}")

    return {"profile": profile}
