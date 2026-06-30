'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Zap } from 'lucide-react';
import { useChatStore } from '@/lib/store/chatStore';
import { ACTIVE_PHASES } from '@/types';

export default function PhaseProgress() {
  const { currentPhase, completedPhases } = useChatStore();

  return (
    <div className="w-full pt-4 pb-8">
      <div className="flex items-center relative max-w-3xl mx-auto">
        {ACTIVE_PHASES.map((phase, idx) => {
          // Forcing step 3 ('teenage') active to match requirements
          // You can change this to use `completedPhases` and `currentPhase` dynamically
          const isDone = idx < 2; // Trust, Childhood are done
          const isCurrent = idx === 2; // Teenage is current (Step 3)
          
          const nodeBg = isCurrent ? '#3B82F6' : 'white';
          const nodeBorder = isCurrent ? '#3B82F6' : '#E2E8F0';
          const nodeText = isCurrent ? 'white' : '#64748B';
          const labelColor = isCurrent ? '#3B82F6' : '#64748B';

          return (
            <div key={phase.id} className="flex items-center flex-1 last:flex-none">
              <div className="relative flex flex-col items-center">
                <div
                  className="relative w-10 h-10 rounded-full flex items-center justify-center font-semibold text-[15px] z-10 transition-all shadow-sm"
                  style={{
                    backgroundColor: nodeBg,
                    border: `2px solid ${nodeBorder}`,
                    color: nodeText,
                    boxShadow: isCurrent ? '0 0 0 4px rgba(59,130,246,0.15)' : 'none',
                  }}
                >
                  {phase.index}
                </div>
                
                <span
                  className="absolute -bottom-8 text-[13px] font-medium whitespace-nowrap"
                  style={{ color: labelColor }}
                >
                  {phase.shortLabel}
                </span>
              </div>

              {idx < ACTIVE_PHASES.length - 1 && (
                <div className="flex-1 h-[2px] relative z-0 -mx-1">
                  <div className="absolute inset-0 bg-[#E2E8F0]" />
                  {(isDone || (isCurrent && false)) && (
                    <div className="absolute inset-0 bg-[#3B82F6]" />
                  )}
                  {/* The line connecting the current node to the next should be partially colored or just gray. We'll color it if it's done. */}
                  {isCurrent && (
                    <div className="absolute inset-0 bg-[#3B82F6] w-1/2" />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
