'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, ArrowRight, Heart, Brain, Compass, Target, BookOpen, ChevronRight } from 'lucide-react';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import { containerVariants, slideUpVariants } from '@/lib/utils/animations';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const TRAITS = [
  { label: 'Close Friend', percentage: 40, color: '#FF6B8A', icon: <Heart className="w-5 h-5 text-white" />, desc: 'Offers empathy, non-judgmental support, and psychological safety.' },
  { label: 'Mentor', percentage: 25, color: '#6C3CE1', icon: <Brain className="w-5 h-5 text-white" />, desc: 'Shares wisdom, recognizes overarching patterns, and guides long-term vision.' },
  { label: 'Curious Explorer', percentage: 20, color: '#00CEC9', icon: <Compass className="w-5 h-5 text-white" />, desc: 'Asks deep, probing questions to uncover hidden strengths and interests.' },
  { label: 'Career Coach', percentage: 10, color: '#FFB84D', icon: <Target className="w-5 h-5 text-white" />, desc: 'Provides actionable accountability and strict guidance when discipline drops.' },
  { label: 'Storyteller', percentage: 5, color: '#6DD5B8', icon: <BookOpen className="w-5 h-5 text-white" />, desc: 'Weaves your experiences into a cohesive, empowering personal narrative.' },
];

const FUTURE_MODULES = [
  { id: 'm1', title: '"Ekkadiki Vellali?"', translation: '(Career Direction)', desc: 'Advanced AI mapping connecting your synthesized persona to real-world career trajectories and industry demands.', status: 'In Development' },
  { id: 'm2', title: '"Ela Penchukovali?"', translation: '(Skill Development)', desc: 'Personalized curriculum generation to bridge the gap between your current skills and your ideal career path.', status: 'Upcoming' },
  { id: 'm3', title: '"Em Chesi?"', translation: '(Life Planning)', desc: 'Holistic lifestyle and financial goal integration to ensure your career aligns with your broader life vision.', status: 'Upcoming' },
];

export default function MentorsPage() {
  const { scrollYProgress } = useScroll();
  const yOffset = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <>
      <AnimatedBackground />
      <main className="min-h-screen flex flex-col items-center justify-start px-4 py-10 overflow-x-hidden relative">
        <motion.div
          className="w-full max-w-6xl relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ y: yOffset }}
        >
          {/* Navbar */}
          <motion.nav 
            variants={slideUpVariants}
            className="flex items-center justify-between w-full py-6 px-4 md:px-8 mb-16 glass-card rounded-full"
          >
            <Link href="/" className="flex items-center gap-3 group cursor-pointer relative">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-[var(--color-secondary)] to-[#818CF8] shadow-md group-hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all duration-300">
                <Sparkles className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-black text-2xl tracking-tighter text-[var(--color-text)] group-hover:text-[var(--color-secondary)] transition-colors duration-300">Baagupadu</span>
                <span className="font-medium text-[1.1rem] text-[var(--color-text-muted)] opacity-80 group-hover:text-[#818CF8] transition-colors duration-300">బాగుపడు</span>
              </div>
            </Link>
            
            <div className="hidden md:flex items-center gap-8 text-[var(--color-text-muted)] font-medium text-sm">
              <Link href="/how-it-works" className="hover:text-[var(--color-text)] transition-colors">How It Works</Link>
              <Link href="/mentors" className="text-[var(--color-secondary)] transition-colors">Mentors</Link>
              <Link href="#" className="hover:text-[var(--color-text)] transition-colors">Pricing</Link>
            </div>
            
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link href="/chat">
                <button className="px-5 py-2 rounded-full bg-[var(--color-secondary)] text-white font-medium text-sm hover:bg-[#4f51c7] transition-colors shadow-lg">
                  Start Now
                </button>
              </Link>
            </div>
          </motion.nav>

          {/* Hero Section */}
          <div className="text-center max-w-4xl mx-auto mb-24 px-4">
            <motion.h1 variants={slideUpVariants} className="text-5xl md:text-7xl font-extrabold text-[var(--color-text)] mb-6 tracking-tight leading-[1.1]">
              Meet <span className="gradient-text">Sahayam.</span>
            </motion.h1>
            <motion.p variants={slideUpVariants} className="text-xl text-[var(--color-text-muted)] leading-relaxed max-w-2xl mx-auto">
              More than a chatbot. Sahayam is a meticulously engineered AI mentor that adapts to your emotional state—acting as a companion when you need support, and a coach when you need accountability.
            </motion.p>
          </div>

          {/* Personality Blend */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="mb-32"
          >
            <div className="text-center max-w-3xl mx-auto mb-16 px-4">
              <motion.h2 variants={slideUpVariants} className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4">
                The Personality Blend
              </motion.h2>
              <motion.p variants={slideUpVariants} className="text-lg text-[var(--color-text-muted)]">
                The exact psychological architecture powering your personal mentor.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {TRAITS.map((trait, i) => (
                <motion.div
                  key={trait.label}
                  variants={slideUpVariants}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-white/70 backdrop-blur-md p-8 rounded-[2rem] border border-[var(--color-surface)] shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 rounded-2xl shadow-sm" style={{ backgroundColor: trait.color }}>
                      {trait.icon}
                    </div>
                    <div className="text-3xl font-black opacity-20" style={{ color: trait.color }}>
                      {trait.percentage}%
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-[var(--color-text)] mb-3">{trait.label}</h3>
                  <p className="text-[var(--color-text-muted)] leading-relaxed">
                    {trait.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Future Modules Roadmap */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="glass-card p-10 md:p-16 rounded-[3rem] relative overflow-hidden mb-20"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0F172A] to-[#1E293B] -z-10" />
            
            <div className="text-center max-w-3xl mx-auto mb-16 px-4">
              <motion.h2 variants={slideUpVariants} className="text-3xl md:text-4xl font-bold text-white mb-4">
                The Future of Mentorship
              </motion.h2>
              <motion.p variants={slideUpVariants} className="text-lg text-slate-300">
                The "Nenu Evaru?" (Who Am I?) module is just the beginning. The Baagupadu ecosystem is expanding into a comprehensive career architecture.
              </motion.p>
            </div>

            <div className="space-y-6">
              {FUTURE_MODULES.map((mod, i) => (
                <motion.div 
                  key={mod.id}
                  variants={slideUpVariants}
                  className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors gap-6"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-white">{mod.title}</h3>
                      <span className="text-[var(--color-secondary)] font-medium">{mod.translation}</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed max-w-2xl">
                      {mod.desc}
                    </p>
                  </div>
                  <div className="px-4 py-2 rounded-full border border-slate-500 text-slate-300 text-sm font-semibold whitespace-nowrap">
                    {mod.status}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </motion.div>
      </main>
    </>
  );
}
