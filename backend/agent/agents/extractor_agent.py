from typing import List, Dict, Any
from pydantic import BaseModel, Field
from langchain_core.messages import SystemMessage, AIMessage, HumanMessage
from backend.agent.state import AgentState
from backend.agent.agents.base_agent import BaseAgent
from backend.models import LongTermMemory
from sentence_transformers import SentenceTransformer
import asyncio

embedder = SentenceTransformer('all-MiniLM-L6-v2')

class ExtractorOutput(BaseModel):
    traits: List[str] = Field(description="A list of 1-3 new core psychological traits demonstrated by the user. If none, an empty list.")
    hard_facts: List[str] = Field(description="A list of concrete facts (e.g., 'User is an AI developer', 'User loves Elon Musk', 'User built Baagupadu'). If none, an empty list.")

class ExtractorAgent(BaseAgent):
    def __init__(self):
        super().__init__(purpose="logic", structured_output_model=ExtractorOutput)
        
    async def invoke(self, state: AgentState) -> Dict[str, Any]:
        """
        4. Extraction Node: Background task using Qwen (Logic).
        Incrementally extracts traits to build the Persona over time.
        """
        messages = state.get("messages", [])
        extracted_traits = state.get("extracted_traits", {})
        if "traits_uncovered" not in extracted_traits:
            extracted_traits["traits_uncovered"] = []
            
        db = state.get("db_session")
        profile = state.get("profile", {})
        conversation_id = profile.get("conversation_id")
        
        if len(messages) >= 2:
            user_msg = next((m.content for m in reversed(messages) if isinstance(m, HumanMessage)), "")
            ai_msg = next((m.content for m in reversed(messages) if isinstance(m, AIMessage)), "")
            
            prompt = (
                "You are a background psychological and factual extractor.\n"
                "Read this exchange and output a list of 1-3 new core psychological traits AND any concrete hard facts (e.g. profession, hobbies, specific projects mentioned) demonstrated by the user. If none, output an empty list.\n"
                f"User: {user_msg}\n"
                f"Coach: {ai_msg}\n"
            )
            
            try:
                res: ExtractorOutput = await self.structured_llm.ainvoke([SystemMessage(content=prompt)])
                for t in res.traits:
                    if t not in extracted_traits["traits_uncovered"]:
                        extracted_traits["traits_uncovered"].append(t)
                
                # Save Hard Facts to Long Term Memory
                if db and conversation_id and res.hard_facts:
                    for fact in res.hard_facts:
                        embedding = await asyncio.to_thread(embedder.encode, fact)
                        embedding = embedding.tolist()
                        ltm = LongTermMemory(
                            conversation_id=conversation_id,
                            content=fact,
                            embedding=embedding,
                            metadata_tags={"type": "hard_fact"}
                        )
                        db.add(ltm)
                    # We do not commit here, api.py will commit at the end of the request
                        
            except Exception as e:
                print(f"Extractor Agent Error: {e}")
                pass
                
        return {"extracted_traits": extracted_traits}
