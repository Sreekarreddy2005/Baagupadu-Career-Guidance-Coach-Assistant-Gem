import json_repair
from langchain_core.messages import SystemMessage
from backend.core.llm_factory import get_llm
from backend.agent.state import AgentState

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
            "Output ONLY valid JSON matching this structure exactly:\n"
            "{\n"
            '  "core_identity": {"archetype_name": "...", "tagline": "...", "description": "...", "description_for_user": "..."},\n'
            '  "strengths": [{"trait": "...", "evidence": "..."}],\n'
            '  "growth_areas": [{"area": "...", "compassionate_framing": "..."}]\n'
            "}\n\n"
            f"EXTRACTED TRAITS: {extracted_traits}"
        )
        logic_llm = get_llm(purpose="logic")
        try:
            res = await logic_llm.ainvoke([SystemMessage(content=prompt)])
            s_idx = res.content.find('{')
            e_idx = res.content.rfind('}')
            if s_idx != -1 and e_idx != -1:
                persona_json = json_repair.loads(res.content[s_idx:e_idx+1])
                persona_json["traits_uncovered"] = extracted_traits
                profile["persona"] = persona_json
        except Exception as e:
            print(f"Synthesis Node Persona Error: {e}")
            
    elif current_phase == "guidance" and "roadmap" not in profile.get("guidance", {}):
        prompt = (
            "You are the Backend AI Evaluator.\n"
            "Based on these traits, generate a detailed 3-stage Career Roadmap.\n"
            "Output ONLY valid JSON matching this structure exactly:\n"
            "{\n"
            '  "primary_career_path": {"title": "...", "why": "..."},\n'
            '  "technical_path": [{"skill": "...", "description": "...", "next_skill": "..."}],\n'
            '  "action_plan": [\n'
            '    {"timeframe": "Immediate", "tasks": [{"action": "...", "points": 10, "details": "..."}]}\n'
            '  ],\n'
            '  "skill_gaps": ["...", "..."]\n'
            "}\n\n"
            f"EXTRACTED TRAITS: {extracted_traits}"
        )
        logic_llm = get_llm(purpose="logic")
        try:
            res = await logic_llm.ainvoke([SystemMessage(content=prompt)])
            s_idx = res.content.find('{')
            e_idx = res.content.rfind('}')
            if s_idx != -1 and e_idx != -1:
                roadmap_json = json_repair.loads(res.content[s_idx:e_idx+1])
                profile.setdefault("guidance", {})["roadmap"] = roadmap_json
        except Exception as e:
            print(f"Synthesis Node Roadmap Error: {e}")

    return {"profile": profile}
