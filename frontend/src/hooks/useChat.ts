'use client';

import { useCallback } from 'react';
import { useChatStore } from '@/lib/store/chatStore';
import { Phase, PersonaResult } from '@/types';

// Demo conversation flow matching the Sahayam conversation phases
const DEMO_RESPONSES: Record<string, { text: string; nextPhase?: Phase; isTransition?: boolean }[]> = {
  default: [
    { text: "Oh, that's really interesting! Can you tell me more about that?" },
    { text: "I totally get that. You know, a lot of people feel the same way. What does that feel like for you?" },
    { text: "Ugh, I can imagine how that must've felt. What did you do next?" },
    { text: "Wait, that's so cool! Tell me more about that experience." },
    { text: "Hmm, I'm sensing something important here. What do you think that says about you?" },
  ],
  trust: [
    { text: "That's a great question! I'm Sahayam — think of me as that friend who's genuinely curious about your story. No judgment, just exploration 😊 What's been on your mind lately?", nextPhase: 'trust' },
    { text: "Oh, I love that you shared that. Honestly? That takes courage. What brought you to this point?" },
    { text: "That sounds like a lot. You know what, I really appreciate you opening up. Let me ask you something — when you were a kid, what did you love doing most?", isTransition: true, nextPhase: 'childhood' },
  ],
  childhood: [
    { text: "Oh wow, childhood! I'm so curious. What games did you absolutely love as a kid?" },
    { text: "That's adorable! I did the exact same thing. 😂 What subject in school made you feel most alive?" },
    { text: "Fascinating! You know what I'm noticing? You light up when you talk about that. What about your teenage years — what changed?", isTransition: true, nextPhase: 'teenage' },
  ],
  teenage: [
    { text: "Ah, the teenage years! So much going on. What were you most passionate about back then?" },
    { text: "I can totally relate to that feeling. What did that teach you about yourself?" },
    { text: "This is getting so interesting. I can see some real patterns forming. Let's jump ahead to your adult life — what does your current situation look like?", isTransition: true, nextPhase: 'adult' },
  ],
  adult: [
    { text: "Okay, so now I want to understand where you are today. What does a typical day look like for you?" },
    { text: "I hear you. And honestly, what you're describing makes a lot of sense given everything you've shared. What feels most unfulfilling right now?" },
    { text: "This is really powerful. I think I'm starting to see who you truly are. Give me a moment to put this all together... 🌟", isTransition: true, nextPhase: 'synthesis' },
  ],
  synthesis: [
    { text: "Okay — I've been listening to everything you've shared, and I can see something really beautiful emerging. You're someone who deeply values creativity, connection, and meaningful impact. Does that resonate?", nextPhase: 'synthesis' },
    { text: "Yes! I thought so. You're what I'd call 'The Curious Connector' — someone who thrives when they can blend people skills with creative problem-solving. Let me show you what this looks like for your career... 🚀", nextPhase: 'guidance' },
  ],
};

const DEMO_PERSONA: PersonaResult = {
  personaName: 'The Curious Connector',
  description:
    'You are someone who thrives at the intersection of creativity and human connection. You naturally bring people together, make complex things feel simple, and build things that matter.',
  traits: [
    { name: 'Curiosity', value: 88, description: 'Natural drive to learn and explore' },
    { name: 'Empathy', value: 92, description: 'Deep understanding of others' },
    { name: 'Creativity', value: 76, description: 'Innate ability to create and innovate' },
    { name: 'Leadership', value: 68, description: 'Natural ability to guide others' },
    { name: 'Resilience', value: 81, description: 'Strength to overcome challenges' },
  ],
  strengths: [
    { label: 'Deep Listener', icon: '👂' },
    { label: 'Creative Thinker', icon: '💡' },
    { label: 'Connector', icon: '🤝' },
    { label: 'Fast Learner', icon: '⚡' },
    { label: 'Empathetic Leader', icon: '🌟' },
  ],
  growthAreas: [
    { label: 'Self-Promotion', description: 'Learning to confidently share your achievements' },
    { label: 'Setting Limits', description: 'Creating healthy space to protect your energy' },
    { label: 'Risk-Taking', description: 'Embracing uncertainty as part of growth' },
  ],
  careerAffinities: [
    { title: 'Product Design / UX', description: 'Blending empathy with creative problem-solving', icon: '🎨' },
    { title: 'Tech Education', description: 'Teaching complex concepts with warmth and clarity', icon: '📚' },
    { title: 'AI & Human Systems', description: 'Building technology that feels deeply human', icon: '🤖' },
  ],
};

let msgIndex = 0;
let currentPhaseKey: keyof typeof DEMO_RESPONSES = 'trust';

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
    (text: string) => {
      // Add user message
      addMessage({ sender: 'user', text, phase: currentPhase });
      setAgentState('listening');

      setTimeout(() => {
        setAgentState('thinking');

        setTimeout(() => {
          setAgentState('typing');

          const phaseResponses = DEMO_RESPONSES[currentPhaseKey] ?? DEMO_RESPONSES.default;
          const response = phaseResponses[msgIndex % phaseResponses.length];
          msgIndex++;

          setTimeout(() => {
            if (response.isTransition && response.nextPhase) {
              // Phase transition message
              addMessage({
                sender: 'system',
                text: `Moving to Phase: ${response.nextPhase.charAt(0).toUpperCase() + response.nextPhase.slice(1)} Exploration`,
                isPhaseTransition: true,
                phase: response.nextPhase,
              });
              completePhase(currentPhase);
              setPhase(response.nextPhase);
              currentPhaseKey = response.nextPhase as keyof typeof DEMO_RESPONSES;
              msgIndex = 0;
            }

            if (response.nextPhase === 'guidance') {
              // Final phase — show visualization
              setTimeout(() => {
                setAgentState('celebrating');
                setPersonaResult(DEMO_PERSONA);
                setShowVisualization(true);
              }, 1500);
            }

            addMessage({
              sender: 'agent',
              text: response.text,
              phase: response.nextPhase ?? currentPhase,
            });
            setAgentState(response.nextPhase === 'guidance' ? 'celebrating' : 'idle');
          }, 800);
        }, 1200);
      }, 600);
    },
    [addMessage, setAgentState, setPhase, completePhase, setPersonaResult, setShowVisualization, currentPhase]
  );

  return { sendMessage };
}
