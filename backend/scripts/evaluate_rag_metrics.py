import asyncio
import os
import sys
from pathlib import Path
from pydantic import BaseModel, Field

backend_dir = Path(__file__).parent.parent
sys.path.append(str(backend_dir.parent))
sys.path.append(str(backend_dir))

from langchain_core.messages import HumanMessage, SystemMessage
from backend.agent.sahayam_engine import SahayamAgent
from backend.database import AsyncSessionLocal
from langchain_ollama import ChatOllama
from backend.core.config import config

# Metrics Judge Output Schema
class RAGMetricsScore(BaseModel):
    groundedness: int = Field(description="Score 0-10: How well is the AI response strictly backed by the provided Context Rules? (10 = perfectly supported, 0 = complete hallucination/unrelated).")
    answer_relevance: int = Field(description="Score 0-10: How directly did the AI address the user's intent? (10 = highly relevant, 0 = completely missed the point).")
    internal_reasoning: str = Field(description="Brief justification for these scores.")

# Distinct-2 Calculator
def calculate_distinct_n(text: str, n: int = 2) -> float:
    words = text.lower().split()
    if len(words) < n:
        return 1.0
    ngrams = set(tuple(words[i:i+n]) for i in range(len(words)-n+1))
    return len(ngrams) / (len(words) - n + 1)

async def evaluate_metrics():
    print("🚀 Initializing LangGraph Engine...")
    agent = SahayamAgent()
    judge_llm = ChatOllama(model=os.getenv("OLLAMA_JUDGE_MODEL", "phi3:mini"), base_url=config.OLLAMA_BASE_URL, temperature=0.1)
    structured_judge = judge_llm.with_structured_output(RAGMetricsScore)

    test_inputs = [
        "I'm so frustrated right now, stop asking me questions.",
        "I think I want to learn React, how do I start?",
        "I don't know what to do with my life, I feel completely stuck."
    ]

    print("\n" + "="*50)
    print("📊 RAG METRICS EVALUATION SUITE")
    print("="*50 + "\n")

    async with AsyncSessionLocal() as db:
        for idx, user_input in enumerate(test_inputs):
            print(f"[{idx+1}/{len(test_inputs)}] Testing Input: '{user_input}'")
            
            # Setup State
            state = {
                "messages": [HumanMessage(content=user_input)],
                "profile": {"conversation_id": 9999, "session_progress": {"current_phase": "trust"}},
                "current_phase": "trust",
                "inferences_made": False,
                "alerts": [],
                "errors": [],
                "new_phase": None,
                "micro_phase": None,
                "chat_ended": False,
                "db_session": db,
                "user_input": user_input,
                "proposed_plan": None,
                "is_approved": None,
                "evaluator_feedback": None,
                "extracted_traits": {"traits_uncovered": []},
                "retrieved_rules": ""
            }

            # Invoke Graph
            print("   -> Running Graph (Retrieval + Executor + Evaluator)...")
            try:
                final_state = await agent.app.ainvoke(state)
            except Exception as e:
                print(f"   -> [ERROR] Graph failed: {e}")
                continue
                
            ai_response = final_state.get("current_response", "")
            retrieved_rules = final_state.get("retrieved_rules", "None")
            
            # Score Groundedness and Relevance
            print("   -> Running phi3:mini Judge...")
            prompt = (
                "You are an expert RAG Evaluator.\n"
                f"User Input: {user_input}\n"
                f"Retrieved Context Rules:\n{retrieved_rules}\n\n"
                f"AI Output: {ai_response}\n\n"
                "Evaluate Groundedness (does the Output strictly follow the Context Rules?) and Answer Relevance (does the Output address the User Input?)."
            )
            
            try:
                judge_result = await structured_judge.ainvoke([SystemMessage(content=prompt)])
                groundedness = judge_result.groundedness
                relevance = judge_result.answer_relevance
                reasoning = judge_result.internal_reasoning
            except Exception as e:
                print(f"   -> [ERROR] Judge failed: {e}")
                groundedness, relevance, reasoning = 0, 0, "Judge Error"

            # Score Distinct-2
            d2 = calculate_distinct_n(ai_response, 2)

            print("\n   [RESULTS]")
            print(f"   - AI Response: {ai_response}")
            print(f"   - Groundedness: {groundedness}/10")
            print(f"   - Answer Relevance: {relevance}/10")
            print(f"   - Distinct-2: {d2:.2f}")
            print(f"   - Judge Reasoning: {reasoning}")
            print("-" * 50 + "\n")

if __name__ == "__main__":
    asyncio.run(evaluate_metrics())
