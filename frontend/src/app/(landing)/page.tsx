'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Brain, ArrowRight, Target, Heart, Map } from 'lucide-react';
import { slideUpVariants, containerVariants, agentEntranceVariants } from '@/lib/utils/animations';

const FEATURES = [
  {
    icon: <Brain className="w-7 h-7 text-indigo-400" />,
    title: 'Deep Self-Discovery',
    desc: 'A 6-phase journey that uncovers who you truly are at your core',
  },
  {
    icon: <Heart className="w-7 h-7 text-pink-400" />,
    title: 'Empathetic Companion',
    desc: 'Sahayam is not a chatbot — it\'s a warm, intelligent friend who really listens',
  },
  {
    icon: <Map className="w-7 h-7 text-emerald-400" />,
    title: 'Visual Career Roadmap',
    desc: 'A personalized roadmap generated from your unique story and strengths',
  },
  {
    icon: <Target className="w-7 h-7 text-amber-400" />,
    title: 'Persona Synthesis',
    desc: 'Discover your core persona and the career paths that match who you are',
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-20">
      <motion.div
        className="w-full max-w-5xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div variants={slideUpVariants} className="flex justify-center mb-8">
          <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-5 py-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-indigo-300 text-sm font-medium">
              AI-Powered Career Mentoring
            </span>
          </div>
        </motion.div>

        {/* Agent preview illustration */}
        <motion.div
          variants={agentEntranceVariants}
          className="flex justify-center mb-10"
        >
          <div className="relative w-48 h-48">
            {/* Outer glow */}
            <motion.div
              className="absolute inset-0 rounded-full blur-3xl"
              style={{
                background:
                  'radial-gradient(circle, rgba(124,58,237,0.4), rgba(79,70,229,0.2), transparent 70%)',
              }}
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <svg viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full relative z-10 drop-shadow-2xl">
              <defs>
                <radialGradient id="lBodyGrad" cx="50%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="#818CF8" />
                  <stop offset="100%" stopColor="#4F46E5" />
                </radialGradient>
                <radialGradient id="lHeadGrad" cx="50%" cy="35%" r="60%">
                  <stop offset="0%" stopColor="#A78BFA" />
                  <stop offset="100%" stopColor="#6D28D9" />
                </radialGradient>
              </defs>
              <rect x="45" y="120" width="110" height="80" rx="22" fill="url(#lBodyGrad)" />
              <rect x="80" y="108" width="40" height="20" rx="8" fill="#6D28D9" />
              <ellipse cx="100" cy="90" rx="55" ry="50" fill="url(#lHeadGrad)" />
              <ellipse cx="80" cy="85" rx="12" ry="13" fill="white" opacity="0.95" />
              <ellipse cx="120" cy="85" rx="12" ry="13" fill="white" opacity="0.95" />
              <ellipse cx="82" cy="86" rx="6.5" ry="7.5" fill="#1E1B4B" />
              <ellipse cx="122" cy="86" rx="6.5" ry="7.5" fill="#1E1B4B" />
              <circle cx="84" cy="84" r="2" fill="white" opacity="0.9" />
              <circle cx="124" cy="84" r="2" fill="white" opacity="0.9" />
              <path d="M 86 110 Q 100 120 114 110" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.8" />
              <rect x="13" y="125" width="32" height="52" rx="16" fill="url(#lBodyGrad)" />
              <rect x="155" y="125" width="32" height="52" rx="16" fill="url(#lBodyGrad)" />
              <circle cx="45" cy="90" r="8" fill="#6D28D9" />
              <circle cx="155" cy="90" r="8" fill="#6D28D9" />
              <circle cx="45" cy="90" r="4" fill="#A78BFA" opacity="0.9" />
              <circle cx="155" cy="90" r="4" fill="#A78BFA" opacity="0.9" />
            </svg>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={slideUpVariants}
          className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6"
        >
          Meet{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Sahayam
          </span>
          <br />
          <span className="text-4xl md:text-5xl text-white/70">Your Career Guide</span>
        </motion.h1>

        <motion.p
          variants={slideUpVariants}
          className="text-white/50 text-xl max-w-2xl mx-auto leading-relaxed mb-10"
        >
          Not a quiz. Not a test. A real conversation with an AI that understands your story
          and helps you find the career path that feels genuinely{' '}
          <em className="text-white/70">right</em>.
        </motion.p>

        {/* CTA */}
        <motion.div variants={slideUpVariants} className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
          <Link href="/chat">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-2xl px-8 py-4 shadow-2xl shadow-indigo-500/30 text-lg transition-all"
            >
              <Sparkles className="w-5 h-5" />
              Start My Journey
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
          <button className="flex items-center gap-2 bg-white/5 border border-white/15 hover:bg-white/10 text-white/70 hover:text-white rounded-2xl px-8 py-4 text-lg font-medium transition-all">
            Learn More
          </button>
        </motion.div>

        {/* Features */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {FEATURES.map((f) => (
            <motion.div
              key={f.title}
              variants={slideUpVariants}
              className="bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl p-6 text-left transition-all duration-300 group"
              whileHover={{ y: -3 }}
            >
              <div className="mb-4">{f.icon}</div>
              <h3 className="text-white font-semibold mb-2 text-base">{f.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </main>
  );
}
