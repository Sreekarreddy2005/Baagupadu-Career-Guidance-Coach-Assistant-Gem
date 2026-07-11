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

    def get_all_context(self) -> str:
        """
        Aggregates all loaded knowledge into a single context string
        (useful for injecting into system prompts).
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
