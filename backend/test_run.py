import sys
import os

# Add the project root to sys.path so backend modules can be imported
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.agent.sahayam_engine import SahayamAgent

def main():
    print("Initializing Sahayam Agent and loading Knowledge Base...")
    try:
        agent = SahayamAgent()
    except ValueError as e:
        print(f"\nConfiguration Error: {e}")
        print("Please create a backend/.env file with the necessary API keys (e.g., OPENAI_API_KEY).")
        return
        
    print("Knowledge Base Loaded Successfully!")
    print("-" * 50)
    
    test_message = "Hi Sahayam! I want to explore my childhood memories."
    print(f"User: {test_message}")
    print("Sahayam is thinking...")
    
    try:
        response = agent.chat(test_message)
        print("-" * 50)
        print("Sahayam Response:")
        print(response)
    except Exception as e:
        print(f"Error during LLM invocation: {e}")

if __name__ == "__main__":
    main()
