'use client';

import React, { useState } from 'react';
import { Target, CheckCircle2, Circle, HelpCircle, ChevronDown, ChevronUp, Calendar, Clock, CalendarDays } from 'lucide-react';
import { useUserProfileStore } from '@/stores/userProfileStore';
import { useDemoChat } from '@/hooks/useChat';
import { motion, AnimatePresence } from 'framer-motion';

export const AccountabilityTracker: React.FC = () => {
  const { profile, completedTasks, toggleTask } = useUserProfileStore();
  const { sendMessage } = useDemoChat();
  const roadmap = profile?.guidance?.roadmap;
  
  const [expandedTimeframes, setExpandedTimeframes] = useState<Record<string, boolean>>({
    'Immediate': true, // Default open
  });
  
  const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({});

  if (!roadmap || !roadmap.action_plan || roadmap.action_plan.length === 0) return null;

  const toggleTimeframe = (timeframe: string) => {
    setExpandedTimeframes(prev => ({ ...prev, [timeframe]: !prev[timeframe] }));
  };

  const toggleDetails = (taskId: string) => {
    setExpandedDetails(prev => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const handleStruggling = (taskAction: string) => {
    // Send a message to Sahayam to start the conversation
    sendMessage(`I'm struggling to complete this task: "${taskAction}". Can you help me break it down or figure out what's blocking me?`);
  };

  return (
    <div className="w-full bg-[#f8f9fa] rounded-2xl p-6 border border-black/5 shadow-sm mt-6">
      <div className="flex justify-between items-start mb-5">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold tracking-widest text-emerald-700 uppercase">
            Progress Tracker
          </span>
          <h2 className="text-xl font-serif font-bold text-slate-800">
            Accountability
          </h2>
        </div>
        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
          <Target size={16} />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {roadmap.action_plan.map((period: any, idx: number) => {
          // Check if old schema (no tasks array) or new schema
          const isOldSchema = !period.tasks && period.action;
          const tasks = isOldSchema ? [{ id: `old-${idx}`, action: period.action, points: 100 }] : period.tasks;
          const isExpanded = expandedTimeframes[period.timeframe];
          
          let timeframeIcon = <Calendar size={14} />;
          let headerColor = "text-slate-700";
          let bgHeader = "bg-slate-50";
          
          const tName = period.timeframe.toLowerCase();
          if (tName.includes('daily')) {
            timeframeIcon = <Clock size={14} className="text-blue-500" />;
            headerColor = "text-blue-800";
            bgHeader = "bg-blue-50/50";
          } else if (tName.includes('week')) {
            timeframeIcon = <CalendarDays size={14} className="text-emerald-500" />;
            headerColor = "text-emerald-800";
            bgHeader = "bg-emerald-50/50";
          } else if (tName.includes('month')) {
            timeframeIcon = <Calendar size={14} className="text-purple-500" />;
            headerColor = "text-purple-800";
            bgHeader = "bg-purple-50/50";
          }

          return (
            <div key={idx} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <button 
                onClick={() => toggleTimeframe(period.timeframe)}
                className={`w-full px-4 py-3 ${bgHeader} flex justify-between items-center hover:opacity-80 transition-colors`}
              >
                <div className="flex items-center gap-2">
                  {timeframeIcon}
                  <span className={`font-bold ${headerColor} uppercase tracking-wider text-xs`}>{period.timeframe}</span>
                </div>
                {isExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="flex flex-col"
                  >
                    {tasks.map((task: any, tIdx: number) => {
                      const isDone = completedTasks[task.action];
                      
                      return (
                        <div key={task.id || tIdx} className="p-4 border-t border-slate-100 flex items-start gap-3 transition-colors hover:bg-slate-50">
                          <button 
                            onClick={() => toggleTask(task.action)}
                            className={`mt-0.5 flex-shrink-0 transition-colors ${isDone ? 'text-emerald-500' : 'text-slate-300 hover:text-emerald-400'}`}
                          >
                            {isDone ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                          </button>
                          
                          <div className="flex flex-col w-full">
                            <span 
                              onClick={() => task.details && toggleDetails(task.action)}
                              className={`text-sm mb-1 ${task.details ? 'cursor-pointer hover:text-blue-600' : ''} ${isDone ? 'text-emerald-900 line-through opacity-70' : 'text-slate-700'}`}
                            >
                              {task.action}
                            </span>
                            
                            <AnimatePresence>
                              {expandedDetails[task.action] && task.details && (
                                <motion.div 
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="text-xs text-slate-500 mt-2 mb-3 bg-white p-3 rounded-lg border border-slate-100"
                                >
                                  {task.details}
                                </motion.div>
                              )}
                            </AnimatePresence>
                            
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                +{task.points || 100} SP
                              </span>
                              
                              <div className="flex items-center gap-4">
                                {task.details && (
                                  <button 
                                    onClick={() => toggleDetails(task.action)}
                                    className="text-[10px] font-semibold text-slate-400 hover:text-slate-600"
                                  >
                                    {expandedDetails[task.action] ? 'Hide Details' : 'View Details'}
                                  </button>
                                )}
                                {!isDone && (
                                  <button 
                                    onClick={() => handleStruggling(task.action)}
                                    className="text-[10px] flex items-center gap-1 font-semibold text-slate-400 hover:text-blue-500 transition-colors"
                                  >
                                    <HelpCircle size={12} />
                                    Struggling?
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};
