import os
import json
from backend.core.config import config

class KnowledgeBaseLoader:
    def __init__(self):
        self.root = config.PROJECT_ROOT
        self.gems_dir = os.path.join(self.root, "gems", "nenu_evaru")
        self.shared_dir = os.path.join(self.root, "shared")

    def _read_file(self, path: str) -> str:
        if not os.path.exists(path):
            return ""
        with open(path, "r", encoding="utf-8") as f:
            return f.read()

    def get_prompts(self) -> dict:
        prompts_dir = os.path.join(self.gems_dir, "prompts")
        prompts = {}
        if os.path.exists(prompts_dir):
            for file in os.listdir(prompts_dir):
                if file.endswith(".md"):
                    name = file.replace(".md", "")
                    prompts[name] = self._read_file(os.path.join(prompts_dir, file))
        return prompts

    def get_frameworks(self) -> dict:
        frameworks_dir = os.path.join(self.gems_dir, "frameworks")
        frameworks = {}
        if os.path.exists(frameworks_dir):
            for file in os.listdir(frameworks_dir):
                if file.endswith(".json"):
                    name = file.replace(".json", "")
                    content = self._read_file(os.path.join(frameworks_dir, file))
                    try:
                        frameworks[name] = json.loads(content)
                    except json.JSONDecodeError:
                        frameworks[name] = content
        return frameworks

    def get_question_banks(self) -> dict:
        banks_dir = os.path.join(self.gems_dir, "question_banks")
        banks = {}
        if os.path.exists(banks_dir):
            for file in os.listdir(banks_dir):
                if file.endswith(".json"):
                    name = file.replace(".json", "")
                    content = self._read_file(os.path.join(banks_dir, file))
                    try:
                        banks[name] = json.loads(content)
                    except json.JSONDecodeError:
                        banks[name] = content
        return banks

    def get_phase_context(self, phase: str) -> str:
        """
        Dynamically orchestrates and aggregates ONLY the markdown files, JSON frameworks, 
        and JSON question banks needed for the specific conversational phase.
        """
        context_parts = []
        prompts = self.get_prompts()
        frameworks = self.get_frameworks()
        banks = self.get_question_banks()
        
        # Always include core system instructions
        if "system_prompt" in prompts:
            context_parts.append(f"Document: system_prompt\n{prompts['system_prompt']}\n")

        # Always include the efficiency engine — applies globally across ALL phases
        if "efficient_persona_engine" in prompts:
            context_parts.append(f"Document: efficient_persona_engine (GLOBAL CONSTRAINT — HIGHEST PRIORITY)\n{prompts['efficient_persona_engine']}\n")
            
        # 1. Orchestrate Markdown Files
        target_md = []
        target_json_fw = []
        target_json_qb = []
        
        if phase == "discovery" or phase == "exploration":
            target_md = [
                "router", "trust_building_phase", "childhood_exploration", 
                "teenage_exploration", "adult_exploration", "hybrid_questioning", 
                "question_transformation", "trait_inference"
            ]
            target_json_qb = ["childhood_questions", "teenage_questions", "adult_questions"]
            target_json_fw = ["trait_framework"]
            
        elif phase == "synthesis":
            target_md = ["persona_building", "trait_inference"]
            target_json_qb = []
            target_json_fw = ["trait_framework", "persona_framework"]
            
        elif phase == "guidance":
            target_md = ["guidance_delivery"]
            target_json_qb = []
            target_json_fw = ["career_framework"]
            
        else:
            # Fallback
            target_md = ["router"]

        # Append Markdown Prompts
        context_parts.append(f"--- PHASE SPECIFIC INSTRUCTIONS ({phase.upper()}) ---")
        for file in target_md:
            if file in prompts:
                context_parts.append(f"Document: {file}\n{prompts[file]}\n")
                
        # Append JSON Frameworks
        if target_json_fw:
            context_parts.append("--- FRAMEWORKS ---")
            for fw in target_json_fw:
                if fw in frameworks:
                    context_parts.append(f"Framework: {fw}\n{json.dumps(frameworks[fw], indent=2)}\n")
                    
        # Append JSON Question Banks
        if target_json_qb:
            context_parts.append("--- QUESTION BANKS ---")
            for qb in target_json_qb:
                if qb in banks:
                    context_parts.append(f"Question Bank: {qb}\n{json.dumps(banks[qb], indent=2)}\n")
                    
        return "\n".join(context_parts)

    def get_all_context(self) -> str:
        """
        Legacy method that dumps everything. Use get_phase_context instead.
        """
        context_parts = []
        
        prompts = self.get_prompts()
        if prompts:
            context_parts.append("--- PROMPTS AND ROUTING RULES ---")
            for k, v in prompts.items():
                context_parts.append(f"Document: {k}\n{v}\n")
                
        frameworks = self.get_frameworks()
        if frameworks:
            context_parts.append("--- FRAMEWORKS ---")
            for k, v in frameworks.items():
                context_parts.append(f"Framework: {k}\n{json.dumps(v, indent=2)}\n")
                
        banks = self.get_question_banks()
        if banks:
            context_parts.append("--- QUESTION BANKS ---")
            for k, v in banks.items():
                context_parts.append(f"Question Bank: {k}\n{json.dumps(v, indent=2)}\n")
                
        return "\n".join(context_parts)
