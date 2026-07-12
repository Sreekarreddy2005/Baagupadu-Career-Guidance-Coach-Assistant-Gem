'use client';

import { useCallback } from 'react';
import { useChatStore } from '@/lib/store/chatStore';

export function useDemoChat() {
  const {
    addMessage,
    setAgentState,
    setPhase,
    completePhase,
    setPersonaResult,
    setShowVisualization,
    currentPhase,
  } = useChatStore();

  const sendMessage = useCallback(
    async (text: string) => {
      // Add user message
      addMessage({ sender: 'user', text, phase: currentPhase });
      setAgentState('listening');

      try {
        setAgentState('thinking');
        
        // Fetch from backend
        const response = await fetch('http://localhost:8000/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: text }),
        });
        
        const data = await response.json();
        let reply = data.response;

        setAgentState('typing');
        
        // Check if the AI indicated the chat should end
        if (reply.includes('[END_CHAT]')) {
           reply = reply.replace('[END_CHAT]', '').trim();
           
           setTimeout(() => {
             setAgentState('celebrating');
             completePhase('exploration');
             setPhase('synthesis');
             
             // Transition visually through the final phases
             setTimeout(() => {
               completePhase('synthesis');
               setPhase('guidance');
               setShowVisualization(true);
             }, 1000);
           }, 1500);
           
        } else {
           setAgentState('idle');
           
           // Automatically transition UI from Discovery to Exploration after first message
           if (currentPhase === 'discovery') {
              completePhase('discovery');
              setPhase('exploration');
              addMessage({
                sender: 'system',
                text: 'Moving to Dynamic Exploration phase...',
                isPhaseTransition: true,
                phase: 'exploration',
              });
           }
        }

        // Add the agent's message
        addMessage({
          sender: 'agent',
          text: reply,
          phase: currentPhase === 'discovery' ? 'exploration' : currentPhase,
        });

      } catch (error) {
        console.error("Error communicating with backend:", error);
        setAgentState('idle');
        addMessage({
          sender: 'system',
          text: 'Error: Could not reach the Sahayam backend. Please ensure the server is running.',
          phase: currentPhase,
        });
      }
    },
    [addMessage, setAgentState, setPhase, completePhase, setPersonaResult, setShowVisualization, currentPhase]
  );

  return { sendMessage };
}
