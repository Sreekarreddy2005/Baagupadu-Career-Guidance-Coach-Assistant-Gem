'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, ArrowRight, Layers, Fingerprint, MapPin, Compass, Search, Target } from 'lucide-react';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import { containerVariants, slideUpVariants } from '@/lib/utils/animations';

const PHASES = [
  {
    phase: 'Phase 1',
    title: 'Trust Building',
    focus: 'Psychological Safety',
    desc: 'We start with a warm welcome. Sahayam creates a safe, judgment-free space so you can open up without fear.',
    icon: <HeartHandshakeIcon className="w-8 h-8 text-[#FF6B8A]" />,
  },
  {
    phase: 'Phase 2',
    title: 'Childhood (0-12)',
    focus: 'Core Emotional Blueprint',
    desc: 'Exploring your early family dynamics, curiosity, and play to understand the foundational patterns that shaped you.',
    icon: <Fingerprint className="w-8 h-8 text-[#6C3CE1]" />,
  },
  {
    phase: 'Phase 3',
    title: 'Teenage (13-19)',
    focus: 'Identity & Resilience',
    desc: 'We dive into your identity formation, friendships, and core values developed during your most transformative years.',
    icon: <Compass className="w-8 h-8 text-[#00B894]" />,
  },
  {
    phase: 'Phase 4',
    title: 'Adult (20-30)',
    focus: 'Ambition & Growth',
    desc: 'Connecting the dots between your adult career experiences, skills, purpose, and current life state.',
    icon: <MapPin className="w-8 h-8 text-[#FFB84D]" />,
  },
  {
    phase: 'Phase 5',
    title: 'Synthesis',
    focus: 'Comprehensive Persona',
    desc: 'Sahayam weaves together the patterns from your past to reveal a profound, synthesized understanding of who you are.',
    icon: <Layers className="w-8 h-8 text-[#00CEC9]" />,
  },
  {
    phase: 'Phase 6',
    title: 'Guidance Delivery',
    focus: 'Actionable Roadmap',
    desc: 'We translate your deep self-knowledge into a concrete, personalized career roadmap with clear action steps.',
    icon: <Target className="w-8 h-8 text-[#6DD5B8]" />,
  },
];

// Helper icon
function HeartHandshakeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      <path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66" />
      <path d="m18 15-2-2" />
      <path d="m15 18-2-2" />
    </svg>
  );
}

export default function HowItWorksPage() {
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
              <Link href="/how-it-works" className="text-[var(--color-secondary)] transition-colors">How It Works</Link>
              <Link href="/mentors" className="hover:text-[var(--color-text)] transition-colors">Mentors</Link>
              <Link href="#" className="hover:text-[var(--color-text)] transition-colors">Pricing</Link>
            </div>
            
            <div className="flex items-center gap-4">
              <Link href="/chat">
                <button className="px-5 py-2 rounded-full bg-[var(--color-secondary)] text-white font-medium text-sm hover:bg-[#4f51c7] transition-colors shadow-lg">
                  Start Now
                </button>
              </Link>
            </div>
          </motion.nav>

          {/* Hero Section */}
          <div className="text-center max-w-4xl mx-auto mb-32 px-4">
            <motion.div variants={slideUpVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 text-red-600 font-semibold text-sm mb-6">
              <Search className="w-4 h-4" />
              The Information Paradox
            </motion.div>
            <motion.h1 variants={slideUpVariants} className="text-5xl md:text-6xl font-extrabold text-[var(--color-text)] mb-6 tracking-tight leading-[1.1]">
              Knowledge without clarity <br className="hidden md:block"/> is just <span className="gradient-text">noise.</span>
            </motion.h1>
            <motion.p variants={slideUpVariants} className="text-xl text-[var(--color-text-muted)] leading-relaxed mb-10">
              The internet gave us unlimited access to educational content, but it produced an "Information Paradox"—leaving you with decision paralysis and shallow learning. Baagupadu cuts through the noise by starting with the most important subject: <strong>You.</strong>
            </motion.p>
          </div>

          {/* 6-Phase Journey Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="mb-32"
          >
            <div className="text-center max-w-3xl mx-auto mb-16 px-4">
              <motion.h2 variants={slideUpVariants} className="text-3xl md:text-5xl font-bold text-[var(--color-text)] mb-4 tracking-tight">
                The 6-Phase Discovery Journey
              </motion.h2>
              <motion.p variants={slideUpVariants} className="text-lg text-[var(--color-text-muted)]">
                We replace boring surveys with deep, empathetic conversations. Sahayam guides you through your past to illuminate your future.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
              {PHASES.map((phase, i) => (
                <motion.div
                  key={phase.title}
                  variants={slideUpVariants}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="bg-white/70 backdrop-blur-md p-8 rounded-[2rem] border border-[var(--color-surface)] shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span className="text-8xl font-black text-[var(--color-secondary)]">{i + 1}</span>
                  </div>
                  
                  <div className="mb-6 p-4 rounded-2xl w-fit bg-[var(--color-surface)] shadow-sm relative z-10">
                    {phase.icon}
                  </div>
                  <div className="inline-block px-3 py-1 bg-[var(--color-surface)] text-[var(--color-text-muted)] text-xs font-bold rounded-full mb-4 uppercase tracking-widest relative z-10">
                    {phase.phase}
                  </div>
                  <h3 className="text-2xl font-bold text-[var(--color-text)] mb-2 relative z-10">{phase.title}</h3>
                  <h4 className="text-sm font-semibold text-[var(--color-secondary)] mb-4 uppercase tracking-wide relative z-10">{phase.focus}</h4>
                  <p className="text-[var(--color-text-muted)] leading-relaxed relative z-10">
                    {phase.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Engine Description */}
          <motion.div
            variants={slideUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="glass-card p-12 text-center rounded-[3rem] mb-20 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-secondary)]/10 to-[#6DD5B8]/10 -z-10" />
            <h2 className="text-4xl font-extrabold text-[var(--color-text)] mb-6">Powered by the <span className="text-[var(--color-secondary)]">"Nenu Evaru?"</span> Engine</h2>
            <p className="text-lg text-[var(--color-text-muted)] max-w-3xl mx-auto mb-10 leading-relaxed">
              "Nenu Evaru?" (Telugu for "Who Am I?") is our foundational AI framework. It dynamically adapts its conversational tone to match your emotional state, identifying patterns in your history to generate a deeply personalized career synthesis.
            </p>
            <Link href="/chat">
              <button className="px-8 py-4 rounded-full bg-[var(--color-text)] text-white font-bold text-lg hover:bg-[var(--color-secondary)] transition-colors shadow-2xl">
                Experience the Journey
              </button>
            </Link>
          </motion.div>

        </motion.div>
      </main>
    </>
  );
}
