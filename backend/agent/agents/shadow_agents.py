import asyncio
import os
from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from backend.core.llm_factory import get_llm

class ShadowEngine:
    """
    The Multi-Hypothesis Engine. Runs invisible agents to debate the user's hidden psychological state.
    """
    def __init__(self):
        # We can use the fast judge model for shadow agents to keep latency low
        self.llm = get_llm(purpose="judge")
        
        self.empath_prompt = ChatPromptTemplate.from_messages([
            ("system", "You are the Empath Shadow Agent. Your job is to analyze the user's latest message and generate a single 1-sentence hypothesis about what deep emotion, fatigue, or insecurity they are feeling right now. Focus on their need for validation. DO NOT give advice. Just give the 1-sentence hypothesis starting with 'Hypothesis: '."),
            ("human", "{user_msg}")
        ])
        
        self.skeptic_prompt = ChatPromptTemplate.from_messages([
            ("system", "You are the Skeptic Shadow Agent. Your job is to analyze the user's latest message and generate a single 1-sentence hypothesis challenging their narrative. Are they avoiding something? Making excuses? Lacking accountability? DO NOT give advice. Just give the 1-sentence hypothesis starting with 'Hypothesis: '."),
            ("human", "{user_msg}")
        ])

    async def analyze(self, user_msg: str) -> dict:
        """
        Runs both the Empath and Skeptic agents concurrently on the user message.
        """
        try:
            empath_chain = self.empath_prompt | self.llm
            skeptic_chain = self.skeptic_prompt | self.llm
            
            empath_task = empath_chain.ainvoke({"user_msg": user_msg})
            skeptic_task = skeptic_chain.ainvoke({"user_msg": user_msg})
            
            results = await asyncio.gather(empath_task, skeptic_task, return_exceptions=True)
            
            empath_result = results[0].content if not isinstance(results[0], Exception) else "Hypothesis: Unable to determine empathy state."
            skeptic_result = results[1].content if not isinstance(results[1], Exception) else "Hypothesis: Unable to determine skeptic state."
            
            print(f"Shadow Agent [Empath]: {empath_result}", flush=True)
            print(f"Shadow Agent [Skeptic]: {skeptic_result}", flush=True)
            
            return {
                "empath_hypothesis": empath_result,
                "skeptic_hypothesis": skeptic_result
            }
        except Exception as e:
            print(f"Shadow Engine Error: {e}")
            return {
                "empath_hypothesis": "",
                "skeptic_hypothesis": ""
            }
