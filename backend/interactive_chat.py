import sys
import os

# Add the project root to sys.path so backend modules can be imported
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.agent.sahayam_engine import SahayamAgent

def main():
    print("🤖 Initializing Sahayam Agent and loading Knowledge Base...")
    try:
        agent = SahayamAgent()
    except ValueError as e:
        print(f"\n❌ Configuration Error: {e}")
        print("Please make sure you have added your API key in the backend/.env file.")
        return
        
    print("✅ Knowledge Base Loaded Successfully!")
    print("\n" + "="*50)
    print("🗣️  Welcome to the Sahayam Interactive Chat!")
    print("Type 'exit' or 'quit' to end the conversation.")
    print("="*50 + "\n")
    
    while True:
        try:
            user_input = input("\nYou: ")
            if user_input.lower() in ['exit', 'quit']:
                print("\nSahayam: Goodbye! Take care.")
                break
                
            if not user_input.strip():
                continue
                
            print("Sahayam is thinking...")
            response = agent.chat(user_input)
            
            print(f"\nSahayam: {response}")
            
        except KeyboardInterrupt:
            print("\n\nSahayam: Goodbye! Take care.")
            break
        except Exception as e:
            print(f"\n❌ Error during LLM invocation: {e}")

if __name__ == "__main__":
    main()
