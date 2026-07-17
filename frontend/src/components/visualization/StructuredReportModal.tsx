'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, Heart, Zap, MapPin, CheckCircle2, Circle } from 'lucide-react';
import { useUserProfileStore } from '@/stores/userProfileStore';
import { QualitySignalBoard } from '@/components/chat/QualitySignalBoard';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const StructuredReportModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { profile } = useUserProfileStore();
  
  if (!isOpen) return null;
  
  const persona = profile?.persona;
  const roadmap = profile?.guidance?.roadmap;
  const summary = profile?.guidance?.final_summary;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
      >
        <motion.div 
          initial={{ y: 20, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0, scale: 0.95 }}
          className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[85vh]"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
            <div>
              <h2 className="text-2xl font-serif font-bold text-slate-800">Your Structured Report</h2>
              <p className="text-sm text-slate-500 mt-1">A detailed synthesis of your persona, traits, and roadmap.</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 lg:p-8 bg-slate-50/50 space-y-10 scrollbar-thin">
            
            {/* Quality Signals & Summary */}
            {summary && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100/50">
                  <h3 className="text-sm font-bold text-indigo-800 uppercase tracking-wider mb-3">Coach Summary</h3>
                  <p className="text-indigo-900 leading-relaxed text-sm">{summary.coaching_feedback}</p>
                </div>
                <QualitySignalBoard />
              </div>
            )}

            {/* Persona Section */}
            {persona && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
                  <Heart className="text-rose-500" />
                  <h3 className="text-xl font-bold text-slate-800">Your Deep Persona</h3>
                </div>
                
                {persona.core_identity && (
                  <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm text-center space-y-3">
                    <h4 className="text-2xl font-serif font-bold text-amber-600">{persona.core_identity.archetype_name}</h4>
                    <p className="font-medium text-slate-600 italic">"{persona.core_identity.tagline}"</p>
                    <p className="text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed mt-4">
                      {persona.core_identity.description_for_user || persona.core_identity.description}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {persona.strengths && persona.strengths.length > 0 && (
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                      <h4 className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Zap size={16} /> Key Strengths
                      </h4>
                      <ul className="space-y-4">
                        {persona.strengths.map((s: any, idx: number) => (
                          <li key={idx} className="text-sm text-slate-700">
                            <strong className="text-slate-900 block mb-1">{s.trait}</strong>
                            <span className="text-slate-500 text-xs">{s.evidence}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {persona.growth_areas && persona.growth_areas.length > 0 && (
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                      <h4 className="text-sm font-bold text-amber-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Target size={16} /> Growth Areas
                      </h4>
                      <ul className="space-y-4">
                        {persona.growth_areas.map((g: any, idx: number) => (
                          <li key={idx} className="text-sm text-slate-700">
                            <strong className="text-slate-900 block mb-1">{g.area}</strong>
                            <span className="text-slate-500 text-xs">{g.compassionate_framing}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Roadmap Section */}
            {roadmap && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
                  <MapPin className="text-blue-500" />
                  <h3 className="text-xl font-bold text-slate-800">Your Action Plan</h3>
                </div>

                {roadmap.primary_career_path && (
                  <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 mb-6">
                    <h4 className="text-sm font-bold text-blue-800 uppercase tracking-wider mb-2">Recommended Path</h4>
                    <p className="text-lg font-bold text-blue-900 mb-2">{roadmap.primary_career_path.title}</p>
                    <p className="text-sm text-blue-700/80">{roadmap.primary_career_path.reasoning}</p>
                  </div>
                )}

                {roadmap.action_plan && roadmap.action_plan.length > 0 && (
                  <div className="space-y-4">
                    {roadmap.action_plan.map((period: any, idx: number) => (
                      <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-50 pb-2">
                          {period.timeframe || period.action}
                        </h4>
                        {period.tasks ? (
                          <ul className="space-y-3">
                            {period.tasks.map((t: any, tidx: number) => (
                              <li key={tidx} className="flex items-start gap-3 text-sm text-slate-600">
                                <Circle size={16} className="text-slate-300 flex-shrink-0 mt-0.5" />
                                <div>
                                  <span className="block">{t.action}</span>
                                  {t.points && <span className="text-[10px] font-bold text-amber-500 mt-1 inline-block">+{t.points} SP</span>}
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
