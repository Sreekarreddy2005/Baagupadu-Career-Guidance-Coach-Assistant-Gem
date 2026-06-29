import { Variants, TargetAndTransition } from 'framer-motion';

export const ANIMATION_DURATIONS = {
  agentEntrance: 1.2,
  messageAppear: 0.5,
  phaseTransition: 1.5,
  backgroundShift: 2.0,
  typingDot: 0.6,
};

export const agentEntranceVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: ANIMATION_DURATIONS.agentEntrance,
      ease: 'easeOut' as const,
      delay: 0.3,
    },
  },
};

export const messageVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: ANIMATION_DURATIONS.messageAppear,
      ease: 'easeOut' as const,
    },
  },
};

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
};

export const breathingAnimation: TargetAndTransition = {
  scale: [1, 1.03, 1],
  y: [0, -6, 0],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: 'easeInOut' as const,
  },
};

export const listeningAnimation: TargetAndTransition = {
  scale: [1, 1.04, 1],
  rotate: [-1, 1, -1],
  transition: {
    duration: 1.5,
    repeat: Infinity,
    ease: 'easeInOut' as const,
  },
};

export const thinkingAnimation: TargetAndTransition = {
  rotate: [0, -3, 3, 0],
  y: [0, -4, 0],
  transition: {
    duration: 2.5,
    repeat: Infinity,
    ease: 'easeInOut' as const,
  },
};

export const celebratingAnimation: TargetAndTransition = {
  scale: [1, 1.1, 1.05, 1.1, 1],
  rotate: [-3, 3, -2, 2, 0],
  transition: {
    duration: 0.8,
    ease: 'easeInOut' as const,
  },
};

export const glowPulse: TargetAndTransition = {
  scale: [1, 1.05, 1],
  opacity: [0.6, 1, 0.6],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: 'easeInOut' as const,
  },
};

export const radarChartReveal: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.0, ease: 'easeOut' as const, delay: 0.5 },
  },
};
