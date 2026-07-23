'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChatMessage as ChatMessageType } from '@/types';
import { messageVariants } from '@/lib/utils/animations';
import { Sparkles } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

interface Props { message: ChatMessageType }

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function ChatMessage({ message }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const { user } = useUser();
  const isAgent  = message.sender === 'agent';
  const isSystem = message.sender === 'system' || message.isPhaseTransition;

  // User initials from Clerk, fallback to "U"
  const userInitials = user?.firstName
    ? `${user.firstName[0]}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : 'U';
  const userImage = user?.imageUrl;

  // Safety fallback for old crashed localStorage states
  const textContent = typeof message.text === 'string'
    ? message.text
    : (message.text as any)?.text || JSON.stringify(message.text);

  if (isSystem) {
    return (
      <motion.div
        variants={messageVariants}
        initial="hidden"
        animate="visible"
        role="status"
        aria-live="polite"
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
          <Sparkles className="w-3.5 h-3.5 text-[#FF6B8A]" aria-hidden="true" />
          <span>{textContent}</span>
          <Sparkles className="w-3.5 h-3.5 text-[#6C3CE1]" aria-hidden="true" />
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
      {/* Agent avatar */}
      {isAgent && (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mb-1 text-white text-xs font-bold shadow-lg"
          aria-hidden="true"
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
          className={`px-6 py-4 rounded-2xl text-[16px] leading-relaxed font-[450] ${isAgent ? 'rounded-tl-sm' : 'rounded-tr-sm'}`}
          style={isAgent ? {
            background: '#FFFFFF',
            border: '1px solid rgba(0,0,0,0.05)',
            color: 'var(--color-text)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          } : {
            background: '#EEF2FF',
            border: '1px solid rgba(99,102,241,0.15)',
            color: 'var(--color-text)',
            boxShadow: '0 8px 16px rgba(99,102,241,0.1)',
          }}
        >
          {isAgent ? (
            // ── Markdown rendering for AI messages ──
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                strong: ({ children }) => <strong className="font-bold text-[var(--color-text)]">{children}</strong>,
                em: ({ children }) => <em className="italic">{children}</em>,
                ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-2">{children}</ol>,
                li: ({ children }) => <li className="text-[var(--color-text)]">{children}</li>,
                code: ({ children, className }) => {
                  const isBlock = className?.includes('language-');
                  return isBlock
                    ? <code className="block bg-black/5 rounded-lg px-3 py-2 text-sm font-mono my-2 overflow-x-auto">{children}</code>
                    : <code className="bg-black/8 rounded px-1.5 py-0.5 text-sm font-mono">{children}</code>;
                },
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-[var(--color-secondary)] pl-3 italic text-[var(--color-text-muted)] my-2">
                    {children}
                  </blockquote>
                ),
                hr: () => <hr className="border-black/10 my-3" />,
              }}
            >
              {textContent}
            </ReactMarkdown>
          ) : (
            textContent
          )}
        </div>
        <span className="text-[#A0A0B8] text-[10px] px-1 opacity-70" aria-label={`Sent at ${mounted ? formatTime(message.timestamp) : ''}`}>
          {mounted ? formatTime(message.timestamp) : ''}
        </span>
      </div>

      {/* User avatar — real initials/image from Clerk */}
      {!isAgent && (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mb-1 text-xs font-bold overflow-hidden"
          aria-hidden="true"
          style={{
            background: userImage ? 'transparent' : 'var(--color-secondary)',
            border: '1px solid rgba(99,102,241,0.2)',
            color: 'white',
          }}
        >
          {userImage
            ? <img src={userImage} alt="" className="w-full h-full object-cover" />
            : userInitials
          }
        </div>
      )}
    </motion.div>
  );
}
