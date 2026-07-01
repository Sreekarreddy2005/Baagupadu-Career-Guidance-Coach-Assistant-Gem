import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatMessage, AgentState, Phase, PersonaResult } from '@/types';

interface ChatStore {
  messages: ChatMessage[];
  agentState: AgentState;
  currentPhase: Phase;
  completedPhases: Phase[];
  isOpen: boolean;
  personaResult: PersonaResult | null;
  showVisualization: boolean;

  // Actions
  addMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setAgentState: (state: AgentState) => void;
  setPhase: (phase: Phase) => void;
  completePhase: (phase: Phase) => void;
  setPersonaResult: (result: PersonaResult) => void;
  setShowVisualization: (show: boolean) => void;
  clearMessages: () => void;
}

const INITIAL_MESSAGE: ChatMessage = {
  id: 'init-1',
  sender: 'agent',
  text: "Hey! I'm Sahayam 😊 I'm so glad you're here. I'm not your average career coach — I'm more like that friend who really gets you. My goal is simple: to help you understand who you truly are, so you can find a path that actually feels right. Not just right on paper, but right in your heart. Ready to begin?",
  timestamp: Date.now(),
  phase: 'idle',
};

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      messages: [INITIAL_MESSAGE],
      agentState: 'idle',
      currentPhase: 'trust',
      completedPhases: [],
      isOpen: true,
      personaResult: null,
      showVisualization: false,

      addMessage: (msg) =>
        set((state) => ({
          messages: [
            ...state.messages,
            {
              ...msg,
              id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              timestamp: Date.now(),
            },
          ],
        })),

      setAgentState: (agentState) => set({ agentState }),

      setPhase: (currentPhase) => set({ currentPhase }),

      completePhase: (phase) =>
        set((state) => ({
          completedPhases: state.completedPhases.includes(phase)
            ? state.completedPhases
            : [...state.completedPhases, phase],
        })),

      setPersonaResult: (personaResult) => set({ personaResult }),

      setShowVisualization: (showVisualization) => set({ showVisualization }),

      clearMessages: () => set({ 
        messages: [INITIAL_MESSAGE], 
        currentPhase: 'trust', 
        completedPhases: [],
        agentState: 'idle',
        showVisualization: false,
        personaResult: null,
      }),
    }),
    {
      name: 'baagupadu-chat-session',
      partialize: (state) => ({
        messages: state.messages,
        currentPhase: state.currentPhase,
        completedPhases: state.completedPhases,
        personaResult: state.personaResult,
      }),
    }
  )
);
