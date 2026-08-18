import os
from pydantic import BaseModel, Field
from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from backend.core.config import config

class QualitySignals(BaseModel):
    empathy_index: int = Field(description="Score 0-100: Focus on emotional validation and trust-building (The Hug).", ge=0, le=100)
    curiosity_index: int = Field(description="Score 0-100: Focus on deep questioning and probing the user's mind (The Mirror).", ge=0, le=100)
    tactical_index: int = Field(description="Score 0-100: Focus on giving actionable advice, structure, or pushing towards a goal (The Push).", ge=0, le=100)
    winning_signal: str = Field(description="Explicitly categorize the dominant trait based on the highest index score: 'Empathetic Validation', 'Deep Exploration', or 'Tactical Push'")

class EvaluatorAgent:
    def __init__(self):
        # We explicitly use the Judge model (Phi-3) which is highly optimized and separate from Llama/Qwen
        judge_model = os.getenv("OLLAMA_JUDGE_MODEL", "phi3:mini")
        
        self.llm = ChatOllama(
            model=judge_model,
            base_url=config.OLLAMA_BASE_URL,
            temperature=0.1,  # Low temperature for strict grading
        )
        
        # We use with_structured_output to force JSON grading
        self.structured_llm = self.llm.with_structured_output(QualitySignals)
        
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", """You are an expert psychological conversation evaluator. 
Your ONLY job is to grade the AI's response to the User based on 3 COMPETING metrics (0-100) and declare a clear winner.
- Empathy Index (The Hug): Did the AI focus primarily on validating feelings, building trust, and being supportive?
- Curiosity Index (The Mirror): Did the AI focus primarily on asking deep questions, extracting core truths, and exploring the user's past/fears?
- Tactical Index (The Push): Did the AI focus primarily on actionable advice, structured frameworks, or pushing the user towards a goal?

These scores should COMPETE. If the AI was highly curious (asking a deep question), the Curiosity Index should be high (80-100) while the Empathy and Tactical indexes should be lower. 
Based on the highest score, set the `winning_signal` exactly to one of these three strings: "Empathetic Validation", "Deep Exploration", or "Tactical Push".

Be strict but fair. Output ONLY the JSON grading schema. DO NOT output any text explanation.
"""),
            ("human", "User message: {user_input}\n\nAI Response to evaluate: {ai_response}")
        ])

    async def evaluate(self, user_input: str, ai_response: str) -> dict:
        try:
            chain = self.prompt | self.structured_llm
            result = await chain.ainvoke({"user_input": user_input, "ai_response": ai_response})
            
            # Convert Pydantic object to dict
            return result.model_dump()
        except Exception as e:
            print(f"Evaluator Agent Error: {e}")
            # Fallback values if evaluation fails (e.g. model timeout or format error)
            return {
                "empathy_index": 50,
                "curiosity_index": 50,
                "tactical_index": 50,
                "winning_signal": "Evaluating..."
            }
