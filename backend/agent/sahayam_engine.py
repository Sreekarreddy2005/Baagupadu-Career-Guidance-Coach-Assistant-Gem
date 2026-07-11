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
            "Given the user's input, respond as Sahayam following the routing rules."
        )
        return base_prompt

    def chat(self, user_input: str) -> str:
        """
        Sends the user's message to the LLM along with the knowledge base context.
        """
        from langchain_core.messages import AIMessage
        
        self.chat_history.append(HumanMessage(content=user_input))
        
        messages = [SystemMessage(content=self._system_prompt)] + self.chat_history
        
        # Invoke the LLM
        response = self.llm.invoke(messages)
        
        # Save AI response to history
        self.chat_history.append(AIMessage(content=response.content))
        
        return response.content
