from backend.core.config import config
from langchain_core.language_models.chat_models import BaseChatModel

def get_llm(purpose: str = "chat") -> BaseChatModel:
    provider = config.LLM_PROVIDER
    
    if provider == "ollama":
        from langchain_openai import ChatOpenAI
        model_name = config.OLLAMA_CHAT_MODEL if purpose == "chat" else config.OLLAMA_LOGIC_MODEL
        return ChatOpenAI(
            model=model_name,
            temperature=0.7 if purpose == "chat" else 0.1,
            api_key="ollama", # dummy key for local
            base_url=config.OLLAMA_BASE_URL
        )
    else:
        raise ValueError(f"Unsupported LLM_PROVIDER: {provider}. This project strictly uses 'ollama'.")
