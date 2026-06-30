// All TypeScript types for Bagupadu

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
  shortLabel: string;
  index: number;
  agentMood: string;      // shown around agent
  agentEmoji: string;
  moodColor: string;      // accent color for this phase
  particleColors: string[];
  gradient: [string, string, string]; // [from, via, to]
  bgDescription: string;
  chatMood: string;       // tone description for users
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

// ── Phase configurations (new premium palette) ──────────────────────────────
export const PHASES: PhaseConfig[] = [
  {
    id: 'idle',
    label: 'Welcome',
    shortLabel: 'Welcome',
    index: 0,
    agentMood: 'Ready to meet you',
    agentEmoji: '👋',
    moodColor: '#6C3CE1',
    particleColors: ['#6C3CE1', '#FF6B8A', '#2D1B69', '#6DD5B8'],
    gradient: ['#2D1B69', '#6C3CE1', '#FF6B8A'],
    bgDescription: 'Futuristic Glow',
    chatMood: 'premium',
  },
  {
    id: 'trust',
    label: 'Trust Building',
    shortLabel: 'Trust',
    index: 1,
    agentMood: 'Getting to know you',
    agentEmoji: '👂',
    moodColor: '#FF6B8A',
    particleColors: ['#FFB84D', '#FF6B8A', '#6C3CE1'],
    gradient: ['#FFB84D', '#FF6B8A', '#6C3CE1'],
    bgDescription: 'Warm Sunset',
    chatMood: 'warm & friendly',
  },
  {
    id: 'childhood',
    label: 'Childhood',
    shortLabel: 'Childhood',
    index: 2,
    agentMood: 'Exploring Childhood...',
    agentEmoji: '✨',
    moodColor: '#74B9FF',
    particleColors: ['#74B9FF', '#FDCB6E', '#FF6B8A'],
    gradient: ['#74B9FF', '#FDCB6E', '#FF6B8A'],
    bgDescription: 'Dreamy Day',
    chatMood: 'soft & nostalgic',
  },
  {
    id: 'teenage',
    label: 'Teenage Years',
    shortLabel: 'Teenage',
    index: 3,
    agentMood: 'Reliving your spark...',
    agentEmoji: '⚡',
    moodColor: '#6C3CE1',
    particleColors: ['#6C3CE1', '#00CEC9', '#FF6B8A'],
    gradient: ['#2D1B69', '#6C3CE1', '#00CEC9'],
    bgDescription: 'Vibrant Night',
    chatMood: 'energetic & curious',
  },
  {
    id: 'adult',
    label: 'Adult Life',
    shortLabel: 'Adult',
    index: 4,
    agentMood: 'Understanding you today...',
    agentEmoji: '🌿',
    moodColor: '#00B894',
    particleColors: ['#00B894', '#0984E3', '#6C3CE1'],
    gradient: ['#00B894', '#0984E3', '#2D1B69'],
    bgDescription: 'Grounded Present',
    chatMood: 'clear & focused',
  },
  {
    id: 'synthesis',
    label: 'Synthesis',
    shortLabel: 'Synthesis',
    index: 5,
    agentMood: 'Reflecting...',
    agentEmoji: '💭',
    moodColor: '#FDCB6E',
    particleColors: ['#6C3CE1', '#FDCB6E', '#FF6B8A'],
    gradient: ['#2D1B69', '#6C3CE1', '#FDCB6E'],
    bgDescription: 'Cosmic Insight',
    chatMood: 'deep & thoughtful',
  },
  {
    id: 'guidance',
    label: 'Guidance',
    shortLabel: 'Guidance',
    index: 6,
    agentMood: 'Finding Your Path...',
    agentEmoji: '🎯',
    moodColor: '#FFB84D',
    particleColors: ['#FFB84D', '#FF6B8A', '#FDCB6E'],
    gradient: ['#FFB84D', '#FF6B8A', '#FDCB6E'],
    bgDescription: 'Golden Horizon',
    chatMood: 'empowering & clear',
  },
];

export const ACTIVE_PHASES: PhaseConfig[] = PHASES.filter((p) => p.id !== 'idle');
