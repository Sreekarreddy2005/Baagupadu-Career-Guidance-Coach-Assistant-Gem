'use client';

import { useCallback } from 'react';
import { useChatStore } from '@/lib/store/chatStore';
import { useUserProfileStore } from '@/stores/userProfileStore';
import { useAuth } from '@clerk/nextjs';
import { chatWithSahayam } from '@/lib/api';

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
  const { loadProfile } = useUserProfileStore();
  const { getToken } = useAuth();

  const sendMessage = useCallback(
    async (text: string) => {
      // Add user message
      addMessage({ sender: 'user', text, phase: currentPhase });
      setAgentState('listening');

      try {
        setAgentState('thinking');
        
        const token = await getToken();
        if (!token) {
          throw new Error("You must be logged in to chat.");
        }
        
        // Fetch from backend using api.ts which passes the token
        const data = await chatWithSahayam(text, token);
        let reply = data.response;

        // Force a re-fetch of the profile from the backend to instantly sync new health metrics
        await loadProfile(token);

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
          text: `Error: Could not reach the Sahayam backend. ${error}`,
          phase: currentPhase,
        });
      }
    },
    [addMessage, setAgentState, setPhase, completePhase, setPersonaResult, setShowVisualization, currentPhase, getToken, loadProfile]
  );

  return { sendMessage };
}
