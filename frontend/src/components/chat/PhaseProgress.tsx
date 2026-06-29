'use client';

import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useChatStore } from '@/lib/store/chatStore';
import { ACTIVE_PHASES } from '@/types';

export default function PhaseProgress() {
  const { currentPhase, completedPhases } = useChatStore();

  return (
    <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-hide">
      {ACTIVE_PHASES.map((phase, idx) => {
        const isCompleted = completedPhases.includes(phase.id);
        const isCurrent = currentPhase === phase.id;
        const isUpcoming = !isCompleted && !isCurrent;

        return (
          <div key={phase.id} className="flex items-center gap-1 flex-shrink-0">
            {/* Phase node */}
            <motion.div
              className="flex flex-col items-center gap-1"
              animate={isCurrent ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div
                className={`
                  relative w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500
                  ${isCompleted
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/40'
                    : isCurrent
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/40 ring-2 ring-indigo-400/40 ring-offset-1 ring-offset-transparent'
                    : 'bg-white/5 text-white/30 border border-white/10'
                  }
                `}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <span>{phase.index}</span>
                )}

                {/* Current phase animated ring */}
                {isCurrent && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-indigo-400"
                    animate={{ scale: [1, 1.5, 1.5], opacity: [0.8, 0, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                  />
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[10px] font-medium whitespace-nowrap transition-colors duration-300 ${
                  isCurrent
                    ? 'text-indigo-300'
                    : isCompleted
                    ? 'text-emerald-400'
                    : 'text-white/25'
                }`}
              >
                {phase.label}
              </span>
            </motion.div>

            {/* Connector line */}
            {idx < ACTIVE_PHASES.length - 1 && (
              <div className="flex-shrink-0 w-6 flex items-center mb-4">
                <div
                  className={`h-0.5 w-full transition-all duration-700 ${
                    isCompleted ? 'bg-emerald-500/60' : 'bg-white/10'
                  }`}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
