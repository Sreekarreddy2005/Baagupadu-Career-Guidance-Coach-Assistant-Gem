import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    # Default to 'openai' but can be changed via environment variable
    LLM_PROVIDER = os.getenv("LLM_PROVIDER", "openai").lower()
    
    # API Keys
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
    
    # Ollama Local Models
    OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434/v1")
    OLLAMA_CHAT_MODEL = os.getenv("OLLAMA_CHAT_MODEL", "llama3.1")
    OLLAMA_LOGIC_MODEL = os.getenv("OLLAMA_LOGIC_MODEL", "qwen2.5")

    # Knowledge Base Path (relative to the project root)
    PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    
config = Config()
