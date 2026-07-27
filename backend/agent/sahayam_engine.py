from langgraph.graph import StateGraph, START, END
from langchain_core.messages import HumanMessage, AIMessage
from backend.agent.state import AgentState
from backend.agent.agents.planner_agent import PlannerAgent
from backend.agent.agents.evaluator_agent import EvaluatorAgent
from backend.agent.agents.executor_agent import ExecutorAgent
from backend.agent.agents.extractor_agent import ExtractorAgent
from backend.agent.agents.synthesizer_agent import SynthesizerAgent
from backend.agent.agents.roadmap_agent import RoadmapAgent
from backend.agent.utils import should_execute, should_synthesize
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from backend.models import Message

class SahayamAgent:
    def __init__(self):
        workflow = StateGraph(AgentState)
        
        # Instantiate Agents
        planner = PlannerAgent()
        evaluator = EvaluatorAgent()
        executor = ExecutorAgent()
        extractor = ExtractorAgent()
        synthesizer = SynthesizerAgent()
        roadmap = RoadmapAgent()
        
        # Add Nodes
        workflow.add_node("planner", planner.invoke)
        workflow.add_node("evaluator", evaluator.invoke)
        workflow.add_node("executor", executor.invoke)
        workflow.add_node("extraction", extractor.invoke)
        workflow.add_node("synthesis", synthesizer.invoke)
        workflow.add_node("roadmap", roadmap.invoke)
        
        # 1. Routing & Evaluation Loop
        workflow.add_edge(START, "planner")
        workflow.add_edge("planner", "evaluator")
        workflow.add_conditional_edges(
            "evaluator",
            should_execute,
            {
                "execute": "executor",
                "replan": "planner"
            }
        )
        
        # 2. Execution & Extraction
        workflow.add_edge("executor", "extraction")
        
        # 3. Final Synthesis Check
        workflow.add_conditional_edges(
            "extraction",
            should_synthesize,
            {
                "synthesize": "synthesis",
                "roadmap": "roadmap",
                "end": END
            }
        )
        workflow.add_edge("synthesis", END)
        workflow.add_edge("roadmap", END)
        
        self.app = workflow.compile()

    async def chat_async(self, user_input: str, profile: dict, session_id: str, db: AsyncSession) -> str:
        conversation_id = profile.get("conversation_id")
        
        chat_history = []
        if conversation_id:
            result = await db.execute(
                select(Message)
                .where(Message.conversation_id == conversation_id)
                .order_by(Message.timestamp.desc())
                .limit(4)
            )
            raw_messages = result.scalars().all()
            raw_messages.reverse()
            
            for msg in raw_messages:
                if msg.content == user_input and msg.role == "user" and msg == raw_messages[-1]:
                    pass
                elif msg.role == "user":
                    chat_history.append(HumanMessage(content=msg.content))
                elif msg.role == "ai":
                    chat_history.append(AIMessage(content=msg.content))

        chat_history.append(HumanMessage(content=user_input))

        state = {
            "messages": chat_history,
            "profile": profile,
            "current_phase": profile.get("session_progress", {}).get("current_phase", "trust"),
            "inferences_made": False,
            "alerts": [],
            "errors": [],
            "new_phase": None,
            "micro_phase": profile.get("session_progress", {}).get("micro_phase", None),
            "chat_ended": False,
            "db_session": db,
            "user_input": user_input,
            "proposed_plan": None,
            "is_approved": None,
            "evaluator_feedback": None,
            "extracted_traits": {"traits_uncovered": profile.get("persona", {}).get("traits_uncovered", [])}
        }

        result = await self.app.ainvoke(state)
        
        updated_messages = result.get("messages", [])
        ai_response = ""
        
        if updated_messages:
            last_msg = updated_messages[-1]
            if last_msg.type == "ai":
                ai_response = last_msg.content
                
        if "profile" in result:
            profile.update(result["profile"])
            
        # Update progress phase based on graph result
        if result.get("new_phase"):
            profile.setdefault("session_progress", {})["current_phase"] = result.get("new_phase")
        if result.get("micro_phase"):
            profile.setdefault("session_progress", {})["micro_phase"] = result.get("micro_phase")

        return ai_response

# Expose the compiled graph for LangGraph Studio visualization
graph = SahayamAgent().app
