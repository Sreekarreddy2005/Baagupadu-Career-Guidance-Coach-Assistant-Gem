// All TypeScript types for Bagupadu

export type Phase =
  | 'idle'
  | 'discovery'
  | 'exploration'
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

export interface HealthMetrics {
  overall_score: number;
  depth_score: number;
  vulnerability_score: number;
  self_awareness_score: number;
  consistency_score: number;
  last_calculated_at: string;
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
    label: 'Building Trust',
    shortLabel: 'Trust',
    index: 1,
    agentMood: 'Getting to know you',
    agentEmoji: '🤝',
    moodColor: '#4ADE80',
    particleColors: ['#4ADE80', '#FFB84D', '#74B9FF'],
    gradient: ['#14532D', '#4ADE80', '#74B9FF'],
    bgDescription: 'Forest Light',
    chatMood: 'friendly & relaxed',
  },
  {
    id: 'discovery',
    label: 'Initial Discovery',
    shortLabel: 'Discovery',
    index: 2,
    agentMood: 'Getting to know you',
    agentEmoji: '👂',
    moodColor: '#FF6B8A',
    particleColors: ['#FFB84D', '#FF6B8A', '#6C3CE1'],
    gradient: ['#FFB84D', '#FF6B8A', '#6C3CE1'],
    bgDescription: 'Warm Sunset',
    chatMood: 'warm & friendly',
  },
  {
    id: 'exploration',
    label: 'Dynamic Exploration',
    shortLabel: 'Exploration',
    index: 3,
    agentMood: 'Exploring your journey...',
    agentEmoji: '✨',
    moodColor: '#74B9FF',
    particleColors: ['#74B9FF', '#FDCB6E', '#FF6B8A'],
    gradient: ['#74B9FF', '#FDCB6E', '#FF6B8A'],
    bgDescription: 'Dreamy Day',
    chatMood: 'curious & open',
  },
  {
    id: 'synthesis',
    label: 'Synthesis',
    shortLabel: 'Synthesis',
    index: 4,
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
    index: 5,
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
