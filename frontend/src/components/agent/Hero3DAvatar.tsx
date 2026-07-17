'use client';

import React from 'react';
import SahayamCharacter from './SahayamCharacter';
import AuraOverlay from './AuraOverlay';
import { AgentState } from '@/types';

export default function Hero3DAvatar({ agentState = 'idle', auraColor }: { agentState?: AgentState; auraColor?: string }) {
  return (
    <div className="w-full h-full min-h-[600px] relative overflow-visible flex items-center justify-center">
      {/* 3D Canvas Layer */}
      <div className="absolute inset-0 z-10 w-full h-full pointer-events-auto">
        <SahayamCharacter mode="hero" />
      </div>

      {/* 2D Aura & Orbital Labels Layer — color-reactive */}
      <AuraOverlay auraColor={auraColor} />
    </div>
  );
}
