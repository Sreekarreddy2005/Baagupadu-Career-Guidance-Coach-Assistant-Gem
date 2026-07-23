'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Code, ChevronRight, Sparkles } from 'lucide-react';
import { useUserProfileStore } from '@/stores/userProfileStore';

export const TechnicalRoadmapGraph: React.FC = () => {
  const { profile } = useUserProfileStore();
  const technicalPath = profile?.guidance?.roadmap?.technical_path;

  if (!technicalPath || technicalPath.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-12 text-slate-400">
        <Sparkles className="w-12 h-12 mb-4 text-slate-200" />
        <p>No technical skills mapped yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full relative px-4 py-8">
      {/* Background connector line */}
      <div className="absolute top-12 bottom-12 left-10 w-0.5 bg-gradient-to-b from-blue-400 via-indigo-500 to-emerald-500 opacity-20"></div>

      <div className="flex flex-col gap-8">
        {technicalPath.map((node: any, idx: number) => {
          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-start gap-6 relative"
            >
              {/* Node Circle */}
              <div className="w-12 h-12 rounded-2xl bg-white border-2 border-indigo-100 flex items-center justify-center flex-shrink-0 z-10 shadow-sm text-indigo-600">
                <Code size={20} />
              </div>

              {/* Content Card */}
              <div className="flex-1 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <h3 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
                  {node.skill}
                </h3>
                
                <p className="text-sm text-slate-500 leading-relaxed">
                  {node.description}
                </p>
                
                {node.next_skill && (
                  <div className="mt-4 pt-4 border-t border-slate-50 flex items-center text-xs font-semibold text-slate-400 gap-1">
                    Leads to: 
                    <span className="text-indigo-600 flex items-center bg-indigo-50 px-2 py-0.5 rounded-full ml-1">
                      {node.next_skill} <ChevronRight size={12} className="ml-1" />
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
