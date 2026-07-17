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
    elif provider == "openai":
        from langchain_openai import ChatOpenAI
        if not config.OPENAI_API_KEY:
            raise ValueError("OPENAI_API_KEY is not set in environment.")
        return ChatOpenAI(
            model="gpt-4o",
            temperature=0.7,
            api_key=config.OPENAI_API_KEY
        )
    elif provider == "gemini":
        from langchain_google_genai import ChatGoogleGenerativeAI
        if not config.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY is not set in environment.")
        return ChatGoogleGenerativeAI(
            model="gemini-3.5-flash",
            temperature=0.7,
            api_key=config.GEMINI_API_KEY
        )
    elif provider == "anthropic":
        from langchain_anthropic import ChatAnthropic
        if not config.ANTHROPIC_API_KEY:
            raise ValueError("ANTHROPIC_API_KEY is not set in environment.")
        return ChatAnthropic(
            model="claude-3-5-sonnet-20240620",
            temperature=0.7,
            api_key=config.ANTHROPIC_API_KEY
        )
    else:
        raise ValueError(f"Unsupported LLM_PROVIDER: {provider}")
