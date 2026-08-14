import os
from pydantic import BaseModel, Field
from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from backend.core.config import config

class QualitySignals(BaseModel):
    empathy_score: int = Field(description="Score 0-100: How well the AI validated feelings without sounding robotic.", ge=0, le=100)
    user_resonance: int = Field(description="Score 0-100: How deeply the response connected with the user's specific context.", ge=0, le=100)
    insight_score: int = Field(description="Score 0-100: Did the AI uncover something meaningful (high) or just make small talk (low)?", ge=0, le=100)
    overall_rating: int = Field(description="Score 0-100: Overall evaluation of this response.", ge=0, le=100)

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
Your ONLY job is to grade the AI's response to the User based on 4 metrics (0-100).
- Empathy: 100 means true, human-like validation. 0 means robotic or dismissive.
- Resonance: 100 means highly specific to the user's context. 0 means generic platitudes.
- Insight: 100 means it asks a deep, revealing question. 0 means basic small-talk.
- Overall: The aggregated score of how good this response is.

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
                "empathy_score": 50,
                "user_resonance": 50,
                "insight_score": 50,
                "overall_rating": 50
            }
