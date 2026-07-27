'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Brain, Heart, Map, Target } from 'lucide-react';
import { containerVariants, slideUpVariants } from '@/lib/utils/animations';
import { useCompanionStore } from '@/lib/store/companionStore';
import { COMPANIONS } from '@/lib/companions';
import AuraOverlay from '@/components/agent/AuraOverlay';
import CompanionSelector from '@/components/landing/CompanionSelector';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import SahayamPersonalityWheel from '@/components/visualization/SahayamPersonalityWheel';
import { useAuth, UserButton } from '@clerk/nextjs';
import ScrollytellingSection from '@/components/landing/ScrollytellingSection';
import Navbar from '@/components/ui/Navbar';

const FEATURES = [
  { icon: <Brain className="w-8 h-8 text-[#FF6B8A]" />, title: 'Dynamic Self-Discovery', desc: 'We explore your foundational years dynamically, uncovering your core emotional blueprint and mapping your identity and values non-linearly.' },
  { icon: <Heart className="w-8 h-8 text-[#6C3CE1]" />, title: 'Pattern Recognition', desc: "By navigating through your life experiences based on emotional cues, Sahayam connects the dots between your past behaviors, ambitions, and growth patterns." },
  { icon: <Target className="w-8 h-8 text-[#00B894]" />, title: 'Persona Synthesis', desc: "We align who you are with what you do. The system synthesizes these patterns into a comprehensive understanding of your unique persona." },
  { icon: <Map className="w-8 h-8 text-[#FFB84D]" />, title: 'Actionable Accountability', desc: "Information without execution is useless. Sahayam translates your persona insights into an actionable career roadmap, tracking your progress and assigning tasks to ensure consistency." },
];

const PERSONALITY_TRAITS = [
  { label: 'Close Friend', percentage: 40, color: '#FF6B8A' },
  { label: 'Mentor', percentage: 25, color: '#6C3CE1' },
  { label: 'Curious Explorer', percentage: 20, color: '#00CEC9' },
  { label: 'Career Coach', percentage: 10, color: '#FFB84D' },
  { label: 'Storyteller', percentage: 5, color: '#6DD5B8' },
];

const MODES = [
  { id: 0, label: 'Empathetic',  chipLabel: 'Empathetic',  icon: Heart,    color: '#FF6B8A', gradFrom: '#FF6B8A', gradTo: '#FF8E53',  desc: 'Friend Mode'  },
  { id: 1, label: 'Coach Mode',  chipLabel: 'Coach Mode',  icon: Target,   color: '#6366F1', gradFrom: '#6366F1', gradTo: '#818CF8',  desc: 'Strict Mode'  },
  { id: 2, label: 'Mentor Mode', chipLabel: 'Mentor Mode', icon: Brain,    color: '#06B6D4', gradFrom: '#06B6D4', gradTo: '#6366F1',  desc: 'Wisdom Mode' },
  { id: 3, label: 'Always On',   chipLabel: 'Always On',   icon: Sparkles, color: '#10B981', gradFrom: '#10B981', gradTo: '#06B6D4',  desc: 'Live Mode'    },
] as const;

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const yOffset = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const { isSignedIn, isLoaded } = useAuth();
  const { activeCompanionId } = useCompanionStore();
  const activeCompanion = COMPANIONS.find(c => c.id === activeCompanionId) || COMPANIONS[0];
  const [activeModeIdx, setActiveModeIdx] = useState(0);
  const activeMode = MODES[activeModeIdx];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveModeIdx(prev => (prev + 1) % MODES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full">
      <Navbar />
      <main className="min-h-screen flex flex-col items-center justify-start text-center relative pt-24 pb-20">

        <motion.div
          className="w-full max-w-6xl relative z-10 px-4 mt-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-32 px-4 md:px-8 text-left mt-8">
            <div className="flex-1 max-w-xl">
              <motion.div
                variants={slideUpVariants}
                className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-strong border border-[var(--color-secondary)]/20 shadow-[0_4px_20px_rgba(99,102,241,0.15)] hover:shadow-[0_4px_25px_rgba(99,102,241,0.25)] transition-all duration-300 cursor-default group mb-8"
              >
                <div className="w-6 h-6 rounded-full bg-[var(--color-secondary)]/10 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--color-secondary)] group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <div className="flex items-center gap-2 text-[14px]">
                  <span className="font-bold text-[var(--color-text)] tracking-wide">బాగుపడు</span>
                  <span className="text-[var(--color-text-muted)] text-[12px] font-medium">(Baagupadu)</span>
                  <div className="w-1 h-1 rounded-full bg-[var(--color-text-muted)]/40 mx-1"></div>
                  <span className="font-semibold bg-gradient-to-r from-[var(--color-secondary)] to-[#FF6B8A] bg-clip-text text-transparent">
                    "To Prosper & Better Oneself"
                  </span>
                </div>
              </motion.div>
              
              <motion.h1
                variants={slideUpVariants}
                className="text-[48px] md:text-[64px] lg:text-[72px] text-[var(--color-text)] font-extrabold mb-6 tracking-tight leading-[1.1]"
              >
                Understand Your Past. <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-secondary)] via-[#FF6B8A] to-[#FFB84D] drop-shadow-sm">Shape Your Future.</span>
              </motion.h1>

              <motion.p
                variants={slideUpVariants}
                className="text-[var(--color-text-muted)] text-[18px] md:text-[20px] font-medium leading-relaxed mb-8 max-w-lg"
              >
                Sahayam is your personalized AI mentor. Discover your true identity, gain absolute clarity, and receive actionable guidance for your life and career.
              </motion.p>

              {/* Interactive Preview Element */}
              <motion.div variants={slideUpVariants} className="w-full max-w-lg mb-10">
                <div className="relative flex items-center glass-strong rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-[var(--glass-border)] hover:shadow-[0_8px_24px_rgba(99,102,241,0.15)] transition-all duration-300 group">
                  <input
                    type="text"
                    placeholder="Ask Sahayam anything..."
                    className="w-full bg-transparent px-6 py-4 outline-none text-[var(--color-text)] placeholder-[var(--color-text-muted)]/70 text-[15px] font-medium"
                    suppressHydrationWarning
                  />
                  <button suppressHydrationWarning className="absolute right-2 top-2 bottom-2 bg-[var(--color-text)] hover:bg-[var(--color-primary-dark)] text-white px-5 rounded-full text-sm font-semibold transition-all shadow-sm group-hover:scale-[1.02] active:scale-95 flex items-center gap-1">
                    Ask
                  </button>
                </div>
              </motion.div>
              
              <motion.div variants={slideUpVariants} className="flex flex-col sm:flex-row gap-4 items-center">
                <Link href="/chat">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center gap-3 bg-[var(--color-secondary)] hover:bg-[#5658d6] text-white font-bold rounded-2xl px-8 py-4 text-[16px] transition-all shadow-[0_8px_24px_rgba(108,60,225,0.3)] w-full sm:w-auto"
                    suppressHydrationWarning
                  >
                    Meet Your Mentor
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
                <div className="flex items-center gap-3 sm:ml-4 text-sm text-[var(--color-text-muted)]">
                  <div className="flex items-center">
                    <span className="text-yellow-500 text-lg mr-1">★</span>
                    <span className="font-semibold text-[var(--color-text)]">4.9</span> Rating
                  </div>
                  <div className="w-1 h-1 rounded-full bg-gray-300" />
                  <span>Joined by 12k+ professionals.</span>
                </div>
              </motion.div>
            </div>

            <div className="flex-1 w-full flex justify-center lg:justify-end relative lg:translate-x-12 h-full min-h-[500px]">
              <motion.div variants={slideUpVariants} className="w-full max-w-[500px] relative z-20">
                <CompanionSelector />
              </motion.div>
              {/* Decorative background glow for 3D area */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-[var(--color-secondary)] to-[#E27D60] rounded-full blur-[100px] opacity-[0.08] -z-10" />
            </div>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════
            SCROLLYTELLING SECTION (Replika-Inspired)
        ═══════════════════════════════════════════════════════════ */}
        <div className="w-full relative z-20 bg-transparent -mt-20">
          <ScrollytellingSection />
        </div>

        <motion.div
          className="w-full max-w-6xl relative z-10 px-4 mt-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* ═══════════════════════════════════════════════════════════
              Meet Sahayam — Theme-Matched Redesign
          ═══════════════════════════════════════════════════════════ */}
          <motion.section
            id="sahayam"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={containerVariants}
            className="w-full relative my-24 overflow-hidden rounded-[3rem]"
          >
            {/* ── Background: matches site warm palette ── */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-secondary)]/8 via-[var(--color-background)] to-[var(--color-accent)]/6 rounded-[3rem]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_25%_30%,rgba(99,102,241,0.10)_0%,transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_75%,rgba(226,125,96,0.08)_0%,transparent_55%)]" />
            {/* Subtle dot grid — visible in light mode */}
            <div className="absolute inset-0 opacity-[0.25]" style={{
              backgroundImage: 'radial-gradient(rgba(99,102,241,0.25) 1px, transparent 1px)',
              backgroundSize: '28px 28px'
            }} />

            <div className="relative z-10 px-6 md:px-12 py-16 md:py-20">

              {/* ── Section Header ── */}
              <motion.div variants={slideUpVariants} className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-secondary)]/25 bg-[var(--color-secondary)]/8 text-[var(--color-secondary)] font-bold text-[11px] uppercase tracking-widest mb-5">
                  <Sparkles className="w-3 h-3" /> Your AI Companion
                </div>
                <h2 className="text-5xl md:text-6xl font-black text-[var(--color-text)] tracking-tight mb-4">
                  Meet{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-secondary)] via-[#FF6B8A] to-[var(--color-accent)]">
                    Sahayam
                  </span>
                </h2>
                <p className="text-[var(--color-text-muted)] text-[18px] max-w-xl mx-auto font-medium leading-relaxed">
                  An AI that <em className="text-[var(--color-text)] not-italic font-semibold">listens</em> like a best friend, <em className="text-[var(--color-text)] not-italic font-semibold">guides</em> like a mentor, and <em className="text-[var(--color-text)] not-italic font-semibold">pushes</em> like a coach — all in one conversation.
                </p>
              </motion.div>

              {/* ── Main Stage: 3-column layout ── */}
              <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10 mb-14">

                {/* Left trait cards */}
                <motion.div variants={containerVariants} className="flex flex-col gap-4 w-full lg:w-[28%]">
                  {[
                    { icon: Heart, label: 'Emotional Memory', desc: 'Remembers what you felt, not just what you said', color: '#FF6B8A', bg: 'bg-[#FF6B8A]/5 border-[#FF6B8A]/15' },
                    { icon: Brain, label: 'Non-Linear Thinking', desc: 'Explores your story in the order it matters emotionally', color: '#6366F1', bg: 'bg-[#6366F1]/5 border-[#6366F1]/15' },
                    { icon: Sparkles, label: 'Persona Synthesis', desc: 'Builds your career identity from 8 life-stage signals', color: '#06B6D4', bg: 'bg-[#06B6D4]/5 border-[#06B6D4]/15' },
                  ].map(({ icon: Icon, label, desc, color, bg }) => (
                    <motion.div
                      key={label}
                      variants={slideUpVariants}
                      whileHover={{ x: 4, scale: 1.02 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className={`flex items-start gap-3 p-4 glass-card cursor-default shadow-sm hover:shadow-md transition-shadow`}
                    >
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ background: `${color}18` }}>
                        <Icon size={17} style={{ color }} />
                      </div>
                      <div>
                        <p className="text-[var(--color-text)] font-bold text-sm mb-0.5">{label}</p>
                        <p className="text-[var(--color-text-muted)] text-[12px] leading-relaxed">{desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Centre: Avatar stage */}
                <motion.div
                  variants={slideUpVariants}
                  className="relative w-full lg:w-[42%] flex flex-col items-center"
                >
                  {/* Glowing disc — color follows active mode */}
                  <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] rounded-full blur-[60px]"
                    animate={{ background: `radial-gradient(circle, ${activeMode.color}30 0%, ${activeMode.color}12 55%, transparent 80%)` }}
                    transition={{ duration: 0.8 }}
                  />
                  {/* Spinning rings — inner ring tints to active mode color */}
                  <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[310px] h-[310px] rounded-full animate-[spin_25s_linear_infinite] border-dashed"
                    animate={{ borderColor: `${activeMode.color}40` }}
                    transition={{ duration: 0.8 }}
                    style={{ border: '1px dashed' }}
                  />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[370px] h-[370px] border border-[var(--color-accent)]/10 rounded-full animate-[spin_40s_linear_infinite_reverse]" />

                  {/* Avatar canvas — AuraOverlay reacts to active mode color */}
                  <div className="relative w-[320px] h-[320px] md:w-[370px] md:h-[370px] flex justify-center items-end">
                    <AuraOverlay mode="dashboard" auraColor={activeMode.color} />
                    <motion.div
                      className="w-full h-[90%] z-20 flex justify-center items-end"
                      animate={activeCompanion.animation}
                    >
                      <img
                        src={activeCompanion.image}
                        alt={activeCompanion.name}
                        className="w-auto h-full object-contain select-none object-bottom drop-shadow-2xl"
                        draggable={false}
                      />
                    </motion.div>
                  </div>

                  {/* Active mode label — floats below avatar, transitions smoothly */}
                  <motion.div
                    key={activeMode.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.35 }}
                    className="absolute -bottom-7 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1.5 rounded-full border shadow-md whitespace-nowrap z-20"
                    style={{
                      background: `${activeMode.color}15`,
                      borderColor: `${activeMode.color}35`,
                    }}
                  >
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: activeMode.color }} />
                    <span className="text-[11px] font-bold" style={{ color: activeMode.color }}>
                      {activeMode.label} — {activeMode.desc}
                    </span>
                  </motion.div>

                  {/* Floating pill chips — active one highlights, others dim */}
                  {MODES.map((m, idx) => {
                    const isActive = idx === activeModeIdx;
                    const positions = [
                      'top-6 left-2 md:left-4',
                      'top-10 right-2 md:right-4',
                      'bottom-8 left-2 md:left-4',
                      'bottom-4 right-2 md:right-4',
                    ];
                    const floatAnims = ['float-a 4s ease-in-out infinite', 'float-b 5s ease-in-out infinite', 'float-c 4.5s ease-in-out infinite', 'float-a 6s ease-in-out infinite reverse'];
                    const ModeIcon = m.icon;
                    return (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + idx * 0.15, type: 'spring' }}
                        animate={{
                          opacity: isActive ? 1 : 0.45,
                          scale: isActive ? 1.08 : 1,
                        }}
                        className={`absolute ${positions[idx]} flex items-center gap-1.5 glass-strong shadow-md rounded-full pl-1.5 pr-3 py-1.5 z-20 transition-all duration-500`}
                        style={{
                          animation: floatAnims[idx],
                          border: isActive ? `1.5px solid ${m.color}` : '1px solid rgba(0,0,0,0.06)',
                          boxShadow: isActive ? `0 0 12px ${m.color}35` : undefined,
                        }}
                      >
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                          style={{ background: `linear-gradient(135deg, ${m.gradFrom}, ${m.gradTo})` }}
                        >
                          <ModeIcon size={10} className="text-white" />
                        </div>
                        <span className="text-[11px] font-bold" style={{ color: isActive ? m.color : 'var(--color-text)' }}>
                          {m.chipLabel}
                        </span>
                      </motion.div>
                    );
                  })}
                </motion.div>

                {/* Right trait cards */}
                <motion.div variants={containerVariants} className="flex flex-col gap-4 w-full lg:w-[28%]">
                  {[
                    { icon: Target, label: 'Adaptive Pressure', desc: 'Gets stricter when you slack, warmer when you push forward', color: '#FFB84D' },
                    { icon: Map, label: 'Actionable Roadmap', desc: 'Converts your persona into a step-by-step career path', color: '#10B981' },
                    { icon: ArrowRight, label: 'Bridges the Gap', desc: 'Kills the space between knowing what you want and actually getting there', color: '#E27D60' },
                  ].map(({ icon: Icon, label, desc, color }) => (
                    <motion.div
                      key={label}
                      variants={slideUpVariants}
                      whileHover={{ x: -4, scale: 1.02 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className="flex items-start gap-3 p-4 glass-card cursor-default shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ background: `${color}18` }}>
                        <Icon size={17} style={{ color }} />
                      </div>
                      <div>
                        <p className="text-[var(--color-text)] font-bold text-sm mb-0.5">{label}</p>
                        <p className="text-[var(--color-text-muted)] text-[12px] leading-relaxed">{desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* ── Bottom: Personality Wheel + Description ── */}
              <motion.div
                variants={slideUpVariants}
                className="flex flex-col lg:flex-row items-center gap-10 glass-card p-8 md:p-10"
              >
                {/* Left: Description + mode pills */}
                <div className="w-full lg:w-1/2">
                  <p className="text-[var(--color-text-muted)] text-sm font-bold uppercase tracking-widest mb-3">Personality Composition</p>
                  <h3 className="text-2xl md:text-3xl font-black text-[var(--color-text)] mb-4 leading-tight">
                    Sahayam isn&apos;t one thing.<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-accent)]">
                      It&apos;s everything you need.
                    </span>
                  </h3>
                  <p className="text-[var(--color-text-muted)] text-[15px] leading-relaxed mb-6">
                    The personality blend shifts based on where you are in your journey. It leads with empathy, follows with strategy, and always ends with accountability.
                  </p>
                  {/* Mode pills */}
                  <div className="flex flex-wrap gap-2.5">
                    {[
                      { label: 'Friend', pct: '40%', color: '#FF6B8A' },
                      { label: 'Mentor', pct: '25%', color: '#6C3CE1' },
                      { label: 'Explorer', pct: '20%', color: '#00CEC9' },
                      { label: 'Coach', pct: '10%', color: '#FFB84D' },
                      { label: 'Storyteller', pct: '5%', color: '#6DD5B8' },
                    ].map(({ label, pct, color }) => (
                      <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-strong">
                        <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                        <span className="text-[var(--color-text)] text-xs font-bold">{label}</span>
                        <span className="text-[var(--color-text-muted)] text-xs">{pct}</span>
                      </div>
                    ))}
                  </div>

                  {/* Quote */}
                  <div className="mt-6 p-5 rounded-2xl border border-[var(--color-secondary)]/15 bg-[var(--color-secondary)]/5 relative">
                    <div className="absolute -top-4 -left-1 text-5xl text-[var(--color-secondary)]/25 font-serif leading-none">&ldquo;</div>
                    <p className="text-[var(--color-text)] text-[14px] font-medium italic relative z-10 pt-1 leading-relaxed">
                      The moment a person realizes the world is shaped by people no smarter than them, everything changes.
                    </p>
                  </div>
                </div>

                {/* Right: Personality wheel */}
                <div className="w-full lg:w-1/2 flex justify-center">
                  <SahayamPersonalityWheel />
                </div>
              </motion.div>

            </div>
          </motion.section>

          {/* Features Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="mb-24"
          >
            <div className="text-center max-w-3xl mx-auto mb-16 px-4">
              <motion.h2 variants={slideUpVariants} className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4 tracking-tight">
                The Bridge from Knowing to Doing
              </motion.h2>
              <motion.p variants={slideUpVariants} className="text-lg text-[var(--color-text-muted)]">
                We replace boring surveys with deep, empathetic conversations using the &quot;Imagine...&quot; and &quot;Remember when...&quot; frameworks.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {FEATURES.map((f, i) => (
                <motion.div
                  key={f.title}
                  variants={slideUpVariants}
                  whileHover={{ y: -6, scale: 1.01 }}
                  className="text-left p-10 cursor-default transition-all duration-300 group relative overflow-hidden glass-card hover:bg-white/60"
                >
                  <div className="mb-6 p-4 rounded-2xl w-fit relative z-10 transition-transform duration-500 group-hover:scale-110 bg-[var(--color-surface)] shadow-sm">
                    {f.icon}
                  </div>
                  <h3 className="text-[20px] font-bold mb-4 relative z-10 tracking-tight text-[var(--color-text)]">
                    {f.title}
                  </h3>
                  <p className="text-[var(--color-text-muted)] text-[16px] font-medium leading-relaxed relative z-10">
                    {f.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Trust Building / Testimonials */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="mb-32 w-full"
          >
            <div className="text-center max-w-3xl mx-auto mb-16 px-4">
              <h2 className="text-[14px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-4">Backed by Science & Trusted by Leaders</h2>
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500 mt-8">
                <span className="text-xl md:text-2xl font-bold font-serif">Stanford <span className="text-sm font-sans block text-center font-normal">Methodology</span></span>
                <span className="text-xl md:text-2xl font-bold font-serif">MIT <span className="text-sm font-sans block text-center font-normal">Research</span></span>
                <span className="text-xl md:text-2xl font-bold tracking-tight">Y Combinator</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: "Alex Chen", role: "Product Designer", quote: "Sahayam helped me understand exactly why I was stuck in my career. The synthesis phase connected dots from my childhood that I never realized were driving my decisions today." },
                { name: "Sarah Jenkins", role: "Software Engineer", quote: "Unlike normal AI that just outputs text, this felt like a real conversation with a mentor who actually remembered my past and cared about my emotional growth." },
                { name: "David M.", role: "Startup Founder", quote: "The career roadmap generated after the dynamic exploration journey was incredibly precise. It didn't just give me roles; it gave me the exact psychological reasons why I would excel in them." }
              ].map((t, i) => (
                <motion.div key={i} variants={slideUpVariants} whileHover={{ y: -5 }} className="p-8 glass-card transition-all duration-300 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-secondary)]/5 rounded-full blur-2xl group-hover:bg-[var(--color-secondary)]/10 transition-colors" />
                  <div className="flex text-yellow-400 mb-6 relative z-10">{'★'.repeat(5)}</div>
                  <p className="text-[var(--color-text)] font-medium mb-8 leading-relaxed text-[15px] italic relative z-10">"{t.quote}"</p>
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-100 to-pink-100" />
                    <div>
                      <div className="text-[15px] font-bold text-[var(--color-text)]">{t.name}</div>
                      <div className="text-[13px] font-medium text-[var(--color-text-muted)]">{t.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Six-Phase Journey Timeline */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="mb-40 w-full max-w-4xl mx-auto"
          >
            <div className="text-center mb-20 px-4">
              <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--color-text)] mb-6 tracking-tight">An Adventure to the Self</h2>
              <p className="text-[18px] text-[var(--color-text-muted)] font-medium max-w-2xl mx-auto">Experience a dynamic, non-linear exploration journey powered by our emotional router before receiving a single piece of career advice.</p>
            </div>

            <div className="relative ml-4 md:ml-12">
              {/* Vertical Line */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[var(--color-secondary)] via-[#FF6B8A] to-[var(--color-warm)] opacity-20 rounded-full" />

              {[
                { phase: 'Initial Discovery', icon: '🤝', duration: 'Dynamic', outcome: 'Establishing emotional safety & baseline' },
                { phase: 'Dynamic Exploration', icon: '✨', duration: 'Dynamic', outcome: 'Non-linear traversal of life stages based on emotional cues' },
                { phase: 'Synthesis', icon: '🧠', duration: 'System', outcome: 'Connecting dots to form your unique persona' },
                { phase: 'Guidance', icon: '🧭', duration: 'Ongoing', outcome: 'Actionable career roadmap' }
              ].map((step, i) => (
                <motion.div key={step.phase} variants={slideUpVariants} className="relative pl-12 pb-16 group">
                  <div className="absolute -left-[20px] top-0 w-11 h-11 rounded-full glass-strong border-[3px] border-white group-hover:border-[var(--color-secondary)] group-hover:scale-110 shadow-sm flex items-center justify-center text-lg transition-all duration-300 z-10">
                    {step.icon}
                  </div>
                  <div className="glass-card p-6 hover:bg-white/60 transition-all duration-300 -mt-2 cursor-default">
                    <h3 className="text-[22px] font-bold text-[var(--color-text)] mb-2 group-hover:text-[var(--color-secondary)] transition-colors">{step.phase}</h3>
                    <div className="flex gap-4 text-[14px] font-semibold text-[var(--color-text-muted)]">
                      <span className="bg-[var(--color-surface)] px-3 py-1 rounded-full text-[var(--color-text)]">{step.duration}</span>
                      <span className="py-1">{step.outcome}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Ecosystem Roadmap */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="mb-8 w-full bg-gradient-to-br from-[#F8FAFC] to-[var(--surface-color)] p-12 md:p-16 rounded-[3rem] border border-[var(--glass-border)] shadow-sm relative overflow-hidden"
          >
            {/* Background elements */}
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-[var(--color-secondary)] rounded-full blur-[100px] opacity-[0.05]" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#FF6B8A] rounded-full blur-[100px] opacity-[0.05]" />

            <div className="text-center max-w-3xl mx-auto mb-20 px-4 relative z-10">
              <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--color-text)] mb-6 tracking-tight">The Ecosystem Roadmap</h2>
              <p className="text-[18px] text-[var(--color-text-muted)] font-medium">This is where Baagupadu is heading. We are building a comprehensive life-navigation platform.</p>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
              <div className="hidden md:block absolute top-1/2 left-10 right-10 h-[2px] bg-gradient-to-r from-[var(--color-secondary)] via-[var(--glass-border)] to-[var(--glass-border)] -translate-y-1/2 -z-10" />

              {[
                { title: 'Nenu Evaru?', desc: 'Self Discovery', active: true },
                { title: 'Career Path', desc: 'Direction', active: false },
                { title: 'Skill Builder', desc: 'Development', active: false },
                { title: 'Life Plan', desc: 'Long-term', active: false }
              ].map((step, i) => (
                <motion.div
                  key={step.title}
                  variants={slideUpVariants}
                  whileHover={{ y: -5 }}
                  className={`flex flex-col items-center glass-card p-6 w-full md:w-[22%] text-center transition-all duration-300 ${step.active
                    ? 'border-[var(--color-secondary)] ring-2 ring-[var(--color-secondary)]/10'
                    : 'opacity-80 hover:opacity-100'
                    }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-4 ${step.active ? 'bg-[var(--color-secondary)] text-white' : 'bg-[var(--color-surface)] text-[var(--color-text-muted)]'}`}>
                    {i + 1}
                  </div>
                  <div className={`text-[16px] font-bold mb-1 ${step.active ? 'text-[var(--color-text)]' : 'text-[var(--color-text-muted)]'}`}>{step.title}</div>
                  <div className="text-[13px] font-medium text-[var(--color-text-muted)]">{step.desc}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </motion.div>

        {/* Footer */}
        <footer className="w-full max-w-6xl mt-8 border-t border-[var(--glass-border)] pt-12 pb-12 px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
            <div className="max-w-xs">
              <Link href="/" className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-[var(--color-secondary)] to-[#818CF8] shadow-sm">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-black text-xl tracking-tighter text-[var(--color-text)]">Baagupadu</span>
              </Link>
              <p className="text-[var(--color-text-muted)] font-medium text-sm leading-relaxed">
                The AI-powered mentoring ecosystem that understands who you are before advising you on what to become.
              </p>
            </div>

            <div className="flex flex-wrap gap-12 md:gap-24">
              <div>
                <h4 className="font-bold text-[var(--color-text)] mb-6 text-[13px] uppercase tracking-widest">Product</h4>
                <ul className="space-y-4 text-sm font-medium text-[var(--color-text-muted)]">
                  <li><Link href="#" className="hover:text-[var(--color-secondary)] transition-colors">Nenu Evaru?</Link></li>
                  <li><Link href="#" className="hover:text-[var(--color-secondary)] transition-colors">Career Path</Link></li>
                  <li><Link href="#" className="hover:text-[var(--color-secondary)] transition-colors">Skill Builder</Link></li>
                  <li><Link href="#" className="hover:text-[var(--color-secondary)] transition-colors">Pricing</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-[var(--color-text)] mb-6 text-[13px] uppercase tracking-widest">Company</h4>
                <ul className="space-y-4 text-sm font-medium text-[var(--color-text-muted)]">
                  <li><Link href="#" className="hover:text-[var(--color-secondary)] transition-colors">About Us</Link></li>
                  <li><Link href="#" className="hover:text-[var(--color-secondary)] transition-colors">Manifesto</Link></li>
                  <li><Link href="#" className="hover:text-[var(--color-secondary)] transition-colors">Contact</Link></li>
                  <li><Link href="#" className="hover:text-[var(--color-secondary)] transition-colors">Privacy Policy</Link></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-[var(--glass-border)] text-sm font-medium text-[var(--color-text-muted)]">
            <p>© {new Date().getFullYear()} Baagupadu. All rights reserved.</p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <Link href="#" className="hover:text-[var(--color-text)] transition-colors">Twitter</Link>
              <Link href="#" className="hover:text-[var(--color-text)] transition-colors">LinkedIn</Link>
              <Link href="#" className="hover:text-[var(--color-text)] transition-colors">Instagram</Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
