'use client';

import { motion } from 'framer-motion';
import { useChatStore } from '@/lib/store/chatStore';
import { ACTIVE_PHASES } from '@/types';
import { containerVariants, slideUpVariants } from '@/lib/utils/animations';

const ROADMAP_STEPS = [
  { icon: '🎯', label: 'Goal', key: 'goal' },
  { icon: '📚', label: 'Learn', key: 'learn' },
  { icon: '💪', label: 'Build', key: 'build' },
  { icon: '🚀', label: 'Apply', key: 'apply' },
  { icon: '🌟', label: 'Thrive', key: 'thrive' },
];

const STEP_CONTENT: Record<string, string> = {
  goal: 'Become a UX Designer who bridges technology and human experience',
  learn: 'Figma, User Research, Design Systems, Psychology of UX',
  build: 'Portfolio of 3-5 empathy-driven projects solving real problems',
  apply: 'Freelance projects, open-source contributions, internships',
  thrive: 'Lead design at an impact-driven product company',
};

export default function CareerRoadmap() {
  const { personaResult } = useChatStore();
  if (!personaResult) return null;

  return (
    <motion.div
      className="bg-white/5 border border-white/10 rounded-2xl p-6 mt-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={slideUpVariants} className="mb-6">
        <h2 className="text-xl font-bold text-white">Your Career Roadmap</h2>
        <p className="text-white/50 text-sm mt-1">
          Based on your persona: {personaResult.personaName}
        </p>
      </motion.div>

      {/* Step nodes */}
      <div className="relative">
        {/* Connector line */}
        <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-30" />

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 relative z-10">
          {ROADMAP_STEPS.map((step, idx) => (
            <motion.div
              key={step.key}
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.15 }}
            >
              <motion.div
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-900/60 to-purple-900/60 border border-indigo-500/30 flex items-center justify-center text-2xl mb-3 shadow-lg"
                whileHover={{ scale: 1.08, borderColor: 'rgba(139, 92, 246, 0.7)' }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {step.icon}
              </motion.div>
              <span className="text-indigo-300 font-semibold text-sm mb-1">{step.label}</span>
              <p className="text-white/40 text-xs leading-relaxed hidden md:block">
                {STEP_CONTENT[step.key]}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Detail list for mobile */}
      <div className="md:hidden mt-6 space-y-3">
        {ROADMAP_STEPS.map((step) => (
          <div key={step.key} className="flex gap-3">
            <span className="text-xl flex-shrink-0 mt-0.5">{step.icon}</span>
            <div>
              <span className="text-white/80 font-medium text-sm">{step.label}: </span>
              <span className="text-white/40 text-sm">{STEP_CONTENT[step.key]}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
