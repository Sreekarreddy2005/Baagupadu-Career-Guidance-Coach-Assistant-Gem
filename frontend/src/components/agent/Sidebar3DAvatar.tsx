'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AgentState } from '@/types';
import { useCompanionStore } from '@/lib/store/companionStore';
import { COMPANIONS } from '@/lib/companions';

export default function Sidebar3DAvatar({ agentState = 'idle' }: { agentState?: AgentState }) {
  const [mounted, setMounted] = useState(false);
  const { activeCompanionId } = useCompanionStore();
  const activeCompanion = COMPANIONS.find(c => c.id === activeCompanionId) || COMPANIONS[0];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-full h-full min-h-[160px]" />;
  }

  return (
    <div className="w-full h-full min-h-[160px] relative flex justify-center items-end overflow-hidden pt-4">
      <motion.div
        className="w-full h-[95%] z-20 flex justify-center items-end"
        animate={activeCompanion.animation}
      >
        <img
          src={activeCompanion.image}
          alt={activeCompanion.name}
          className="w-auto h-full object-contain select-none object-bottom drop-shadow-lg"
          draggable={false}
        />
      </motion.div>
    </div>
  );
}
