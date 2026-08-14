from backend.core.config import config
from langchain_core.language_models.chat_models import BaseChatModel

def get_llm(purpose: str = "chat") -> BaseChatModel:
    provider = config.LLM_PROVIDER
    
    if provider == "ollama":
        from langchain_openai import ChatOpenAI
        if purpose == "chat":
            return ChatOpenAI(
                model=config.OLLAMA_CHAT_MODEL,
                temperature=0.8,
                top_p=0.9,
                presence_penalty=0.6,
                api_key="ollama", # dummy key for local
                base_url=config.OLLAMA_BASE_URL
            )
        else:
            return ChatOpenAI(
                model=config.OLLAMA_LOGIC_MODEL,
                temperature=0.1,
                api_key="ollama", # dummy key for local
                base_url=config.OLLAMA_BASE_URL
            )
    else:
        raise ValueError(f"Unsupported LLM_PROVIDER: {provider}. This project strictly uses 'ollama'.")
