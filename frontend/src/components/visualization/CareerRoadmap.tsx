'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserProfileStore } from '@/stores/userProfileStore';
import { containerVariants, slideUpVariants } from '@/lib/utils/animations';
import { CheckCircle2, CircleDashed, Clock } from 'lucide-react';
import { TechnicalRoadmapGraph } from './TechnicalRoadmapGraph';

export default function CareerRoadmap() {
  const { profile } = useUserProfileStore();
  const roadmap = profile?.guidance?.roadmap;
  
  // Default to the first timeframe in the action plan, usually "Immediate"
  const defaultTab = roadmap?.action_plan?.[0]?.timeframe || 'Immediate';
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  if (!roadmap || !roadmap.action_plan) return null;

  const currentPlan = roadmap.action_plan.find((p: any) => p.timeframe === activeTab) || roadmap.action_plan[0];

  return (
    <motion.div
      className="bg-[#1E293B] rounded-3xl p-6 h-full w-full relative overflow-y-auto overflow-x-hidden flex flex-col"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={slideUpVariants} className="mb-6 z-10 flex flex-col gap-2">
        <h2 className="text-xl font-bold text-white leading-snug">
          Career Roadmap
        </h2>
        <p className="text-sm font-medium text-amber-400">
          {roadmap.primary_career_path?.title || 'Your Path'}
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex bg-white/5 p-1 rounded-xl mb-6 border border-white/10 z-10">
        {roadmap.action_plan.map((plan: any) => (
          <button
            key={plan.timeframe}
            onClick={() => setActiveTab(plan.timeframe)}
            className={`flex-1 text-xs font-semibold py-2 rounded-lg transition-all ${
              activeTab === plan.timeframe
                ? 'bg-[var(--color-secondary)] text-white shadow-md'
                : 'text-white/60 hover:text-white/90 hover:bg-white/5'
            }`}
          >
            {plan.timeframe}
          </button>
        ))}
        {roadmap.technical_path && (
          <button
            onClick={() => setActiveTab('Technical Map')}
            className={`flex-1 text-xs font-semibold py-2 rounded-lg transition-all ${
              activeTab === 'Technical Map'
                ? 'bg-[var(--color-secondary)] text-white shadow-md'
                : 'text-white/60 hover:text-white/90 hover:bg-white/5'
            }`}
          >
            Technical Map
          </button>
        )}
      </div>

      {/* Active Tab Content */}
      <div className="relative flex-1 flex flex-col gap-4 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col gap-4"
          >
            {activeTab === 'Technical Map' ? (
              <div className="bg-white rounded-2xl flex-1 overflow-y-auto">
                <TechnicalRoadmapGraph />
              </div>
            ) : (
              currentPlan.tasks?.map((task: any, idx: number) => (
                <div 
                  key={idx}
                  className="group flex gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all"
                >
                  <div className="mt-1 flex-shrink-0">
                    <CircleDashed className="text-white/30 group-hover:text-amber-400 transition-colors" size={18} />
                  </div>
                  <div className="flex flex-col flex-1 gap-1">
                    <p className="text-sm font-medium text-white/90 leading-relaxed">
                      {task.action}
                    </p>
                    {task.points && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <Clock size={12} className="text-[var(--color-secondary)]" />
                        <span className="text-[10px] font-bold text-[var(--color-secondary)] uppercase tracking-wider">
                          {task.points} SP
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {roadmap.skill_gaps && roadmap.skill_gaps.length > 0 && (
         <motion.div variants={slideUpVariants} className="mt-8 pt-6 border-t border-white/10">
            <h3 className="text-white/80 font-bold text-xs uppercase tracking-wider mb-3">Skills to Develop</h3>
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
