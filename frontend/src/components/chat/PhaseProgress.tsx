'use client';

import { motion } from 'framer-motion';
import { useChatStore } from '@/lib/store/chatStore';
import { ACTIVE_PHASES } from '@/types';
import { Check } from 'lucide-react';

const phaseIcons: Record<string, string> = {
  'trust': '🤝',
  'childhood': '🧸',
  'teenage': '🌱',
  'adult': '🚀',
  'synthesis': '🧠',
  'guidance': '🧭'
};

export default function PhaseProgress() {
  const { currentPhase, completedPhases } = useChatStore();

  const currentIdx = Math.max(0, ACTIVE_PHASES.findIndex(p => p.id === currentPhase));

  return (
    <div className="w-full pt-4 pb-8">
      <div className="flex items-center relative max-w-4xl mx-auto px-4">
        {ACTIVE_PHASES.map((phase, idx) => {
          const isDone = completedPhases.includes(phase.id);
          const isCurrent = phase.id === currentPhase;
          
          const nodeBg = isCurrent ? 'var(--color-secondary)' : isDone ? '#4ADE80' : 'white';
          const nodeBorder = isCurrent ? 'var(--color-secondary)' : isDone ? '#4ADE80' : '#E2E8F0';
          const nodeText = (isCurrent || isDone) ? 'white' : '#94A3B8';
          const labelColor = isCurrent ? 'var(--color-text)' : '#94A3B8';

          return (
            <div key={phase.id} className="flex items-center flex-1 last:flex-none">
              <div className="relative flex flex-col items-center group">
                <motion.div
                  layout
                  initial={false}
                  animate={{
                    backgroundColor: nodeBg,
                    borderColor: nodeBorder,
                    color: nodeText,
                    scale: isCurrent ? 1.15 : 1,
                    boxShadow: isCurrent ? '0 0 0 4px rgba(99,102,241,0.2)' : isDone ? '0 0 0 2px rgba(74,222,128,0.2)' : 'none',
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="relative w-11 h-11 rounded-full flex items-center justify-center font-bold text-[16px] z-10 border-2"
                >
                  {isDone && !isCurrent ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <span>{phaseIcons[phase.id] || phase.index}</span>
                  )}
                </motion.div>
                
                <span
                  className={`absolute -bottom-8 text-[13px] font-bold whitespace-nowrap transition-colors duration-300 ${isCurrent ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}
                  style={{ color: labelColor }}
                >
                  {phase.shortLabel}
                </span>
              </div>

              {idx < ACTIVE_PHASES.length - 1 && (
                <div className="flex-1 h-[3px] relative z-0 -mx-1 overflow-hidden rounded-full">
                  <div className="absolute inset-0 bg-[#E2E8F0]" />
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-[#4ADE80] to-[var(--color-secondary)] origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isDone ? 1 : isCurrent ? 0.5 : 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
