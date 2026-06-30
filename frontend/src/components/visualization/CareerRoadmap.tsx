'use client';

import { motion } from 'framer-motion';
import { useChatStore } from '@/lib/store/chatStore';
import { ACTIVE_PHASES } from '@/types';
import { containerVariants, slideUpVariants } from '@/lib/utils/animations';

const ROADMAP_STEPS = [
  { icon: '📣', label: 'Marketing', subtext: '(Current)', key: 'marketing', status: 'done' },
  { icon: '📄', label: 'UI Design Fundamentals', key: 'ui', status: 'done' },
  { icon: '🔍', label: 'UX Research', key: 'ux', status: 'active' },
  { icon: '💎', label: 'Figma/Sketch', key: 'tools', status: 'pending' },
  { icon: '🖼️', label: 'Portfolio Project', key: 'portfolio', status: 'pending' },
  { icon: '💼', label: 'Hired', subtext: '(Goal)', key: 'hired', status: 'goal' },
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
      className="bg-[#1E293B] rounded-3xl p-6 h-full w-full relative overflow-hidden flex flex-col"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={slideUpVariants} className="mb-10 z-10">
        <h2 className="text-xl font-bold text-white leading-snug">
          Career Roadmap: <br />
          <span className="text-white/80 font-medium">UI/UX Designer</span>
        </h2>
      </motion.div>

      {/* Roadmap Container */}
      <div className="relative flex-1 flex flex-col justify-between py-4 z-10">
        
        {/* Wavy SVG Path */}
        <div className="absolute top-0 bottom-0 left-8 w-[200px] -z-10 pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 100 500" preserveAspectRatio="none">
            {/* Base faded path */}
            <path
              d="M 10 0 C 10 50, 80 50, 80 100 C 80 150, 10 150, 10 200 C 10 250, 80 250, 80 300 C 80 350, 10 350, 10 400 C 10 450, 80 450, 80 500"
              fill="transparent"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="4"
            />
            {/* Glowing active path */}
            <motion.path
              d="M 10 0 C 10 50, 80 50, 80 100 C 80 150, 10 150, 10 200"
              fill="transparent"
              stroke="#00CEC9"
              strokeWidth="4"
              style={{ filter: 'drop-shadow(0 0 8px rgba(0,206,201,0.8))' }}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </svg>
        </div>

        {ROADMAP_STEPS.map((step, idx) => {
          const isLeft = idx % 2 === 0;
          
          let nodeBg = 'rgba(255,255,255,0.1)';
          let nodeBorder = 'rgba(255,255,255,0.2)';
          let shadow = 'none';
          
          if (step.status === 'active') {
            nodeBg = 'rgba(0,206,201,0.2)';
            nodeBorder = '#00CEC9';
            shadow = '0 0 20px rgba(0,206,201,0.5)';
          } else if (step.status === 'goal') {
            nodeBg = 'rgba(16,185,129,0.2)';
            nodeBorder = '#10B981';
            shadow = '0 0 20px rgba(16,185,129,0.4)';
          }

          return (
            <motion.div
              key={step.key}
              className={`flex items-center gap-4 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
              initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + idx * 0.15 }}
            >
              {/* Icon Node */}
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0 z-10 transition-all backdrop-blur-md"
                style={{
                  background: nodeBg,
                  border: `2px solid ${nodeBorder}`,
                  boxShadow: shadow,
                }}
              >
                {step.icon}
              </div>

              {/* Text Label */}
              <div className={`flex flex-col ${isLeft ? 'items-start' : 'items-end text-right'}`}>
                <span className="text-white font-medium text-sm">{step.label}</span>
                {step.subtext && (
                  <span className={step.status === 'active' ? 'text-[#00CEC9] text-xs' : 'text-white/50 text-xs'}>
                    {step.subtext}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
