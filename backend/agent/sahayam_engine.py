from langgraph.graph import StateGraph, START, END
from langchain_core.messages import HumanMessage
from backend.agent.state import AgentState
from backend.agent.nodes import router_node, responder_node, profile_updater_node, should_update_profile

class SahayamAgent:
    def __init__(self):
        # Build the LangGraph
        workflow = StateGraph(AgentState)
        
        # Add Nodes
        workflow.add_node("router", router_node)
        workflow.add_node("responder", responder_node)
        workflow.add_node("profile_updater", profile_updater_node)
        
        # Add Edges
        workflow.add_edge(START, "router")
        workflow.add_edge("router", "responder")
        
        # Conditional routing after responder
        workflow.add_conditional_edges(
            "responder",
            should_update_profile,
            {
                "update_profile": "profile_updater"
            }
        )
        
        workflow.add_edge("profile_updater", END)
        
        # Compile the graph
        self.app = workflow.compile()
        self.chat_history = []

    def chat(self, user_input: str, profile: dict = None) -> str:
        """
        Sends the user's message through the LangGraph state machine.
        """
        self.chat_history.append(HumanMessage(content=user_input))
        
        # Token optimization for context window
        if len(self.chat_history) > 10:
            self.chat_history = self.chat_history[-10:]

        # Initialize State
        state = {
            "messages": self.chat_history,
            "profile": profile or {},
            "current_phase": profile.get("session_progress", {}).get("current_phase", "discovery") if profile else "discovery",
            "inferences_made": False,
            "alerts": [],
            "errors": []
        }

        # Invoke the Graph
        result = self.app.invoke(state)
        
        # The result state contains the updated messages and profile
        updated_messages = result.get("messages", [])
        
        # Extract the AI's response (the last message)
        ai_response = ""
        if updated_messages:
            last_msg = updated_messages[-1]
            if last_msg.type == "ai":
                ai_response = last_msg.content
                # Save it back to our local history so it persists across calls
                self.chat_history.append(last_msg)
                
        # Update the profile object in place so the caller (api.py) has the newest version
        if profile is not None and "profile" in result:
            profile.update(result["profile"])

        return ai_response
