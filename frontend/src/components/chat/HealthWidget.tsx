'use client';

import React from 'react';
import { HealthMetrics } from '@/types';
import { Activity, ShieldCheck } from 'lucide-react';

interface HealthWidgetProps {
  metrics?: HealthMetrics;
}

export const HealthWidget: React.FC<HealthWidgetProps> = ({ metrics }) => {
  if (!metrics) return null;

  return (
    <div className="w-full bg-[#f8f9fa] rounded-2xl p-6 border border-black/5 shadow-sm">
      
      {/* Header section */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold tracking-widest text-amber-700 uppercase">
            Quality Signals
          </span>
          <h2 className="text-xl font-serif font-bold text-slate-800">
            Response health
          </h2>
        </div>
        <div className="w-8 h-8 rounded-lg bg-slate-200/60 flex items-center justify-center text-slate-600">
          <Activity size={16} />
        </div>
      </div>

      {/* 2x2 Grid for Metrics */}
      <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-6">
        
        {/* Metric 1 */}
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-slate-600">Consistency</span>
          <span className="text-2xl font-bold text-slate-900">{metrics.consistency_score}%</span>
        </div>

        {/* Metric 2 */}
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-slate-600">Vulnerability</span>
          <span className="text-2xl font-bold text-slate-900">{metrics.vulnerability_score}%</span>
        </div>

        {/* Metric 3 */}
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-slate-600">Self-Awareness</span>
          <span className="text-2xl font-bold text-slate-900">{metrics.self_awareness_score}%</span>
        </div>

        {/* Metric 4 */}
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-slate-600">Depth</span>
          <span className="text-2xl font-bold text-slate-900">{metrics.depth_score}%</span>
        </div>

      </div>

      {/* Footer section */}
      <div className="flex flex-col gap-2 pt-4 border-t border-slate-200/60">
        <div className="flex items-center gap-2 text-slate-700 font-semibold text-xs">
          <ShieldCheck size={14} />
          <span>Evaluated live</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-500">
          These are aggregate extraction signals used by Sahayam to orchestrate the conversation, not user performance scores.
        </p>
      </div>

    </div>
  );
};
