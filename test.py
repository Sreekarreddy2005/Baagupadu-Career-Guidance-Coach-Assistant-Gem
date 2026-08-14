from dotenv import load_dotenv
load_dotenv("backend/.env")
from backend.agent.sahayam_engine import SahayamAgent
agent = SahayamAgent()
print("Success!")
