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
    activeSessionId,
    setActiveSessionId,
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
        
        let sessionId = activeSessionId;
        if (!sessionId) {
          sessionId = crypto.randomUUID();
          setActiveSessionId(sessionId);
        }
        
        // Fetch from backend using api.ts which passes the token and session ID
        const data = await chatWithSahayam(text, sessionId, token);
        let reply = data.response;

        // Force a re-fetch of the profile from the backend to instantly sync new health metrics
        await loadProfile(token);

        setAgentState('typing');
        
        // Sync phase with backend
        const backendPhase = data.current_phase || 'discovery';
        if (backendPhase !== currentPhase) {
          completePhase(currentPhase);
          setPhase(backendPhase);
          
          if (backendPhase === 'synthesis' || backendPhase === 'guidance') {
            setShowVisualization(true);
          }
          
          addMessage({
            sender: 'system',
            text: `Moving to ${backendPhase.charAt(0).toUpperCase() + backendPhase.slice(1)} phase...`,
            isPhaseTransition: true,
            phase: backendPhase,
          });
        }
        
        // Check if the AI indicated the chat should end
        if (reply.includes('[END_CHAT]') || data.chat_completed) {
           reply = reply.replace('[END_CHAT]', '').trim();
           setAgentState('celebrating');
        } else {
           setAgentState('idle');
        }

        // Add the agent's message
        addMessage({
          sender: 'agent',
          text: reply,
          phase: backendPhase,
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
    [addMessage, setAgentState, setPhase, completePhase, setPersonaResult, setShowVisualization, currentPhase, activeSessionId, setActiveSessionId, getToken, loadProfile]
  );

  return { sendMessage };
}
