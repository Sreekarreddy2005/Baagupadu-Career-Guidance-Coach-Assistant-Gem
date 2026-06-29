'use client';

import { motion } from 'framer-motion';
import { ChatMessage as ChatMessageType } from '@/types';
import { messageVariants } from '@/lib/utils/animations';
import { Sparkles } from 'lucide-react';

interface Props {
  message: ChatMessageType;
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function ChatMessage({ message }: Props) {
  const isAgent = message.sender === 'agent';
  const isSystem = message.sender === 'system';
  const isTransition = message.isPhaseTransition;

  if (isTransition || isSystem) {
    return (
      <motion.div
        variants={messageVariants}
        initial="hidden"
        animate="visible"
        className="flex justify-center my-4"
      >
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2 text-sm text-white/60">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>{message.text}</span>
          <Sparkles className="w-4 h-4 text-pink-400" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={messageVariants}
      initial="hidden"
      animate="visible"
      className={`flex items-end gap-3 ${isAgent ? 'justify-start' : 'justify-end'}`}
    >
      {/* Agent avatar dot */}
      {isAgent && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 mb-1 shadow-lg shadow-indigo-500/30">
          <span className="text-white text-xs font-bold">S</span>
        </div>
      )}

      <div className={`max-w-[78%] flex flex-col ${isAgent ? 'items-start' : 'items-end'}`}>
        <div
          className={`
            px-5 py-3.5 rounded-2xl text-sm leading-relaxed
            ${isAgent
              ? 'bg-gradient-to-br from-indigo-600/30 to-purple-700/30 border border-indigo-500/30 text-white rounded-tl-sm shadow-lg shadow-indigo-500/10'
              : 'bg-white/10 border border-white/15 text-white/90 rounded-tr-sm'
            }
          `}
        >
          {message.text}
        </div>
        <span className="text-white/30 text-xs mt-1.5 px-1">
          {formatTime(message.timestamp)}
        </span>
      </div>

      {/* User avatar dot */}
      {!isAgent && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 border border-white/10 flex items-center justify-center flex-shrink-0 mb-1">
          <span className="text-white text-xs font-bold">U</span>
        </div>
      )}
    </motion.div>
  );
}
