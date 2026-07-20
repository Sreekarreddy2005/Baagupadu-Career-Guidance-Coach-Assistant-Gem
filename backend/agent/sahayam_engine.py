from langgraph.graph import StateGraph, START, END
from langchain_core.messages import HumanMessage, AIMessage
from backend.agent.state import AgentState
from backend.agent.nodes import router_node, responder_node, profile_updater_node, should_update_profile, context_router_node
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from backend.models import Message

class SahayamAgent:
    def __init__(self):
        workflow = StateGraph(AgentState)
        
        workflow.add_node("context_router", context_router_node)
        workflow.add_node("router", router_node)
        workflow.add_node("responder", responder_node)
        workflow.add_node("profile_updater", profile_updater_node)
        
        workflow.add_edge(START, "context_router")
        workflow.add_edge("context_router", "router")
        workflow.add_edge("router", "responder")
        
        workflow.add_conditional_edges(
            "responder",
            should_update_profile,
            {
                "update_profile": "profile_updater"
            }
        )
        
        workflow.add_edge("profile_updater", END)
        self.app = workflow.compile()

    async def chat_async(self, user_input: str, profile: dict, session_id: str, db: AsyncSession) -> str:
        """
        Asynchronous chat that fetches recent messages from relational DB
        and passes the DB session to nodes for pgvector queries.
        """
        conversation_id = profile.get("conversation_id")
        
        # 1. Fetch short-term memory (last 4 messages) from relational DB
        chat_history = []
        if conversation_id:
            result = await db.execute(
                select(Message)
                .where(Message.conversation_id == conversation_id)
                .order_by(Message.timestamp.desc())
                .limit(4)
            )
            raw_messages = result.scalars().all()
            # Reverse to chronological order
            raw_messages.reverse()
            
            for msg in raw_messages:
                # Don't duplicate the user_input that was just saved by api.py
                # Actually, api.py saves it BEFORE calling this, so it's already in the DB.
                if msg.content == user_input and msg.role == "user" and msg == raw_messages[-1]:
                    pass # We will append it manually below to keep LangChain state clean
                elif msg.role == "user":
                    chat_history.append(HumanMessage(content=msg.content))
                elif msg.role == "ai":
                    chat_history.append(AIMessage(content=msg.content))

        # Append the new human message (even if api.py saved it, it's easier to explicitly add here for state)
        chat_history.append(HumanMessage(content=user_input))

        # Initialize State
        state = {
            "messages": chat_history,
            "profile": profile,
            "current_phase": profile.get("session_progress", {}).get("current_phase", "discovery"),
            "inferences_made": False,
            "alerts": [],
            "errors": [],
            "new_phase": None,
            "micro_phase": None,
            "chat_ended": False,
            "db_session": db, # Pass db session to graph nodes
            "user_input": user_input # specifically for embedding generation
        }

        # Invoke the Graph Asynchronously
        result = await self.app.ainvoke(state)
        
        updated_messages = result.get("messages", [])
        ai_response = ""
        
        if updated_messages:
            last_msg = updated_messages[-1]
            if last_msg.type == "ai":
                ai_response = last_msg.content
                
        if "profile" in result:
            profile.update(result["profile"])

        return ai_response
