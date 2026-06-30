'use client';

import SahayamCharacter from './SahayamCharacter';
import { AgentState } from '@/types';

export default function Sidebar3DAvatar({ agentState = 'idle' }: { agentState?: AgentState }) {
  return (
    <div className="w-full h-full min-h-[160px] relative">
      <SahayamCharacter mode="sidebar" />
    </div>
  );
}
