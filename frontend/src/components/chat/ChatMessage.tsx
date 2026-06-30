'use client';

import { motion } from 'framer-motion';
import { ChatMessage as ChatMessageType } from '@/types';
import { messageVariants } from '@/lib/utils/animations';
import { Sparkles } from 'lucide-react';

interface Props { message: ChatMessageType }

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function ChatMessage({ message }: Props) {
  const isAgent  = message.sender === 'agent';
  const isSystem = message.sender === 'system' || message.isPhaseTransition;

  if (isSystem) {
    return (
      <motion.div
        variants={messageVariants}
        initial="hidden"
        animate="visible"
        className="flex justify-center my-5"
      >
        <div
          className="flex items-center gap-2.5 rounded-full px-5 py-2 text-xs font-medium"
          style={{
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.2)',
            color: 'var(--color-secondary)',
          }}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#FF6B8A]" />
          <span>{message.text}</span>
          <Sparkles className="w-3.5 h-3.5 text-[#6C3CE1]" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={messageVariants}
      initial="hidden"
      animate="visible"
      className={`flex items-end gap-2.5 ${isAgent ? 'justify-start' : 'justify-end'}`}
    >
      {/* Agent avatar dot */}
      {isAgent && (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mb-1 text-white text-xs font-bold shadow-lg"
          style={{
            background: 'linear-gradient(135deg, var(--color-secondary), #818CF8)',
            boxShadow: '0 0 12px rgba(99,102,241,0.2)',
          }}
        >
          S
        </div>
      )}

      <div className={`flex flex-col gap-1 max-w-[78%] ${isAgent ? 'items-start' : 'items-end'}`}>
        <div
          className={`
            px-4 py-3.5 rounded-2xl text-[15px] leading-relaxed font-[400]
            ${isAgent
              ? 'rounded-tl-sm'
              : 'rounded-tr-sm'
            }
          `}
          style={isAgent ? {
            background: '#FFFFFF',
            border: '1px solid rgba(0,0,0,0.05)',
            color: 'var(--color-text)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
          } : {
            background: '#EEF2FF', // Soft indigo background
            border: '1px solid rgba(99,102,241,0.1)',
            color: 'var(--color-text)', // Dark text
            boxShadow: '0 4px 12px rgba(99,102,241,0.05)',
          }}
        >
          {message.text}
        </div>
        <span className="text-[#A0A0B8] text-[10px] px-1 opacity-70">{formatTime(message.timestamp)}</span>
      </div>

      {/* User avatar dot */}
      {!isAgent && (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mb-1 text-white text-xs font-bold"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid rgba(0,0,0,0.1)',
            color: 'var(--color-text)',
          }}
        >
          U
        </div>
      )}
    </motion.div>
  );
}
