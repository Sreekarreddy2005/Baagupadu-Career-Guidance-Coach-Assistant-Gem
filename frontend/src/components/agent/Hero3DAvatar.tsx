'use client';

import React from 'react';
import SahayamCharacter from './SahayamCharacter';
import AuraOverlay from './AuraOverlay';
import { AgentState } from '@/types';

export default function Hero3DAvatar({ agentState = 'idle' }: { agentState?: AgentState }) {
  return (
    <div className="w-full h-full min-h-[600px] relative overflow-visible flex items-center justify-center">
      {/* 3D Canvas Layer (pointer-events-auto for hover physics, but absolute to avoid boxing) */}
      <div className="absolute inset-0 z-10 w-full h-full pointer-events-auto">
        <SahayamCharacter mode="hero" />
      </div>
      
      {/* 2D Aura & Orbital Labels Layer (pointer-events-none on wrapper, auto on labels) */}
      <AuraOverlay />
    </div>
  );
}
