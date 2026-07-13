from langchain_core.messages import SystemMessage, HumanMessage
from backend.core.llm_factory import get_llm
from backend.knowledge_base.loader import KnowledgeBaseLoader

class SahayamAgent:
    def __init__(self):
        self.llm = get_llm()
        self.kb_loader = KnowledgeBaseLoader()
        self._system_prompt = self._build_system_prompt()
        self.chat_history = []

    def _build_system_prompt(self) -> str:
        """
        Constructs the master system prompt by embedding the dynamic knowledge base files.
        """
        kb_context = self.kb_loader.get_all_context()
        
        base_prompt = (
            "You are Sahayam, the AI agent for the Baagupadu project. "
            "Your goal is to guide the user holistically based on the non-linear "
            "rules defined in the knowledge base.\n\n"
            "Below is the complete knowledge base containing the Router rules, "
            "Exploration prompts, Frameworks, and Question Banks. "
            "You MUST adhere strictly to these rules when responding to the user.\n\n"
            "=== KNOWLEDGE BASE START ===\n"
            f"{kb_context}\n"
            "=== KNOWLEDGE BASE END ===\n\n"
            "Given the user's input, respond as Sahayam following the routing rules.\n"
            "CRITICAL: When you have gathered enough information across the life stages "
            "and are ready to synthesize their persona and conclude the conversation, "
            "you MUST append the exact string '[END_CHAT]' to the very end of your message."
        )
        return base_prompt

    def chat(self, user_input: str, profile: dict = None) -> str:
        """
        Sends the user's message to the LLM along with the knowledge base context.
        Injects the user profile if provided.
        """
        from langchain_core.messages import AIMessage
        import json
        
        self.chat_history.append(HumanMessage(content=user_input))
        
        messages = [SystemMessage(content=self._system_prompt)]
        
        if profile:
            profile_context = f"\n\nCURRENT USER PROFILE STATE:\n{json.dumps(profile, indent=2)}\n\nUse this profile to maintain context and update your patterns/inferences."
            messages[0].content += profile_context
            
        messages += self.chat_history
        
        # Invoke the LLM
        response = self.llm.invoke(messages)
        
        # Extract content string safely (Gemini sometimes returns a list of blocks)
        content = response.content
        if isinstance(content, list):
            content = "".join([
                block.get("text", "") if isinstance(block, dict) else str(block) 
                for block in content
            ])
        elif not isinstance(content, str):
            content = str(content)
            
        # Save AI response to history
        self.chat_history.append(AIMessage(content=content))
        
        # Token optimization: Keep only the last 5 exchanges (10 messages)
        if len(self.chat_history) > 10:
            self.chat_history = self.chat_history[-10:]
        
        return content
