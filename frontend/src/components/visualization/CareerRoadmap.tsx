'use client';

import { motion } from 'framer-motion';
import { useUserProfileStore } from '@/stores/userProfileStore';
import { containerVariants, slideUpVariants } from '@/lib/utils/animations';

export default function CareerRoadmap() {
  const { profile } = useUserProfileStore();
  const roadmap = profile?.guidance?.roadmap;
  
  if (!roadmap || !roadmap.action_plan) return null;

  return (
    <motion.div
      className="bg-[#1E293B] rounded-3xl p-6 h-full w-full relative overflow-y-auto overflow-x-hidden flex flex-col"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={slideUpVariants} className="mb-8 z-10">
        <h2 className="text-xl font-bold text-white leading-snug">
          Career Roadmap: <br />
          <span className="text-white/80 font-medium">{roadmap.primary_career_path?.title || 'Your Path'}</span>
        </h2>
      </motion.div>

      {/* Roadmap Container */}
      <div className="relative flex-1 flex flex-col gap-6 py-4 z-10">
        
        {roadmap.action_plan.map((step: any, idx: number) => {
          const isLeft = idx % 2 === 0;
          const isFirst = idx === 0;
          const isLast = idx === roadmap.action_plan.length - 1;
          
          let nodeBg = isFirst ? 'rgba(99,102,241,0.2)' : isLast ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.1)';
          let nodeBorder = isFirst ? 'var(--color-secondary)' : isLast ? '#4ADE80' : 'rgba(255,255,255,0.2)';
          let shadow = isFirst ? '0 0 20px rgba(99,102,241,0.5)' : isLast ? '0 0 20px rgba(74,222,128,0.4)' : 'none';

          return (
            <motion.div
              key={idx}
              className={`flex items-start gap-4 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
              initial={{ opacity: 0, scale: 0.8, x: isLeft ? -20 : 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 1 + idx * 0.6, type: "spring" }}
            >
              {/* Icon Node */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm flex-shrink-0 z-10 transition-all backdrop-blur-md font-bold text-white mt-1"
                style={{
                  background: nodeBg,
                  border: `2px solid ${nodeBorder}`,
                  boxShadow: shadow,
                }}
              >
                {idx + 1}
              </div>

              {/* Text Label */}
              <div className={`flex flex-col bg-white/5 rounded-xl p-3 border border-white/10 ${isLeft ? 'items-start' : 'items-end text-right'} w-full`}>
                <span className="text-[var(--color-secondary)] font-bold text-xs uppercase tracking-wider mb-1">
                  {step.timeframe}
                </span>
                
                {/* Check if it's the old schema (single action) or new schema (tasks array) */}
                {step.action && !step.tasks && (
                  <span className="text-white/90 text-xs leading-relaxed">
                    {step.action}
                  </span>
                )}
                
                {step.tasks && step.tasks.length > 0 && (
                  <ul className={`flex flex-col gap-2 mt-1 w-full ${isLeft ? 'items-start text-left' : 'items-end text-right'}`}>
                    {step.tasks.map((t: any, i: number) => (
                      <li key={i} className="text-white/90 text-xs leading-relaxed flex flex-col">
                        <span className="font-medium">• {t.action}</span>
                        <span className="text-[10px] text-amber-300 font-bold ml-3 mt-0.5">{t.points} SP</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {roadmap.skill_gaps && roadmap.skill_gaps.length > 0 && (
         <motion.div variants={slideUpVariants} className="mt-8 pt-6 border-t border-white/10">
            <h3 className="text-white/80 font-bold text-sm mb-3">Skills to Develop:</h3>
            <div className="flex flex-wrap gap-2">
               {roadmap.skill_gaps.map((skill: string, idx: number) => (
                  <span key={idx} className="bg-white/10 text-white/80 px-3 py-1 rounded-full text-xs font-medium">
                     {skill}
                  </span>
               ))}
            </div>
         </motion.div>
      )}
    </motion.div>
  );
}
