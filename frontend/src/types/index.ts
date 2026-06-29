// All TypeScript types for Baagupadu

export type Phase =
  | 'idle'
  | 'trust'
  | 'childhood'
  | 'teenage'
  | 'adult'
  | 'synthesis'
  | 'guidance';

export interface PhaseConfig {
  id: Phase;
  label: string;
  index: number;
  colors: {
    from: string;
    via: string;
    to: string;
  };
  particleColor: string;
  bgDescription: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  timestamp: number;
  phase?: Phase;
  isPhaseTransition?: boolean;
}

export type AgentState =
  | 'idle'
  | 'listening'
  | 'thinking'
  | 'typing'
  | 'emphasizing'
  | 'celebrating';

export interface UserTrait {
  name: string;
  value: number; // 0-100
  description: string;
}

export interface PersonaResult {
  personaName: string;
  description: string;
  traits: UserTrait[];
  strengths: { label: string; icon: string }[];
  growthAreas: { label: string; description: string }[];
  careerAffinities: { title: string; description: string; icon: string }[];
}

export interface RoadmapStep {
  id: string;
  icon: string;
  label: string;
  title: string;
  description: string;
}

export const PHASES: PhaseConfig[] = [
  {
    id: 'idle',
    label: 'Welcome',
    index: 0,
    colors: { from: '#FF6B35', via: '#FF8C69', to: '#FFB347' },
    particleColor: '#FF8C69',
    bgDescription: 'Warm Dawn',
  },
  {
    id: 'trust',
    label: 'Trust Building',
    index: 1,
    colors: { from: '#F59E0B', via: '#EC4899', to: '#EF4444' },
    particleColor: '#F59E0B',
    bgDescription: 'Warm Sunset',
  },
  {
    id: 'childhood',
    label: 'Childhood',
    index: 2,
    colors: { from: '#60A5FA', via: '#F472B6', to: '#A78BFA' },
    particleColor: '#60A5FA',
    bgDescription: 'Dreamy Day',
  },
  {
    id: 'teenage',
    label: 'Teenage',
    index: 3,
    colors: { from: '#1E40AF', via: '#7C3AED', to: '#4C1D95' },
    particleColor: '#7C3AED',
    bgDescription: 'Vibrant Night',
  },
  {
    id: 'adult',
    label: 'Adult',
    index: 4,
    colors: { from: '#059669', via: '#0284C7', to: '#0EA5E9' },
    particleColor: '#059669',
    bgDescription: 'Sophisticated',
  },
  {
    id: 'synthesis',
    label: 'Synthesis',
    index: 5,
    colors: { from: '#4F46E5', via: '#7C3AED', to: '#B45309' },
    particleColor: '#7C3AED',
    bgDescription: 'Cosmic',
  },
  {
    id: 'guidance',
    label: 'Guidance',
    index: 6,
    colors: { from: '#D97706', via: '#F59E0B', to: '#FEF3C7' },
    particleColor: '#F59E0B',
    bgDescription: 'Golden Horizon',
  },
];

export const ACTIVE_PHASES: PhaseConfig[] = PHASES.filter(
  (p) => p.id !== 'idle'
);
