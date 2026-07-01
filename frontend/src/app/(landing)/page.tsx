'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, ArrowRight, Brain, Heart, Map, Target } from 'lucide-react';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import { containerVariants, slideUpVariants } from '@/lib/utils/animations';
import SahayamCharacter from '@/components/agent/SahayamCharacter';
import AuraOverlay from '@/components/agent/AuraOverlay';
import Hero3DAvatar from '@/components/agent/Hero3DAvatar';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const FEATURES = [
  { icon: <Brain className="w-8 h-8 text-[#FF6B8A]" />, title: 'Deep Self-Discovery', desc: 'We explore your foundational years—childhood (0-12) to uncover your core emotional blueprint, and teenage years (13-19) to map your identity and values.' },
  { icon: <Heart className="w-8 h-8 text-[#6C3CE1]" />, title: 'Pattern Recognition', desc: "By analyzing your adult experiences (20-30), Sahayam connects the dots between your past behaviors, ambitions, and growth patterns." },
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

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const yOffset = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <>
      <AnimatedBackground />
      <main className="min-h-screen flex flex-col items-center justify-start text-center px-4 py-20 overflow-x-hidden relative">
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
            className="flex items-center justify-between w-full py-6 px-4 md:px-8 mb-16"
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
              <Link href="/mentors" className="hover:text-[var(--color-text)] transition-colors">Mentors</Link>
              <Link href="#" className="hover:text-[var(--color-text)] transition-colors">Pricing</Link>
              <Link href="#" className="hover:text-[var(--color-text)] transition-colors">Resources</Link>
            </div>
            
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link href="#" className="hidden sm:block text-[var(--color-text-muted)] font-medium text-sm hover:text-[var(--color-text)] transition-colors">Login</Link>
              <Link href="/chat">
                <button className="px-5 py-2 rounded-full border border-[var(--color-secondary)] text-[var(--color-secondary)] font-medium text-sm hover:bg-[var(--color-secondary)] hover:text-white transition-colors">
                  Sign Up Free
                </button>
              </Link>
            </div>
          </motion.nav>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-32 px-4 md:px-8 text-left">
            <div className="flex-1 max-w-xl">
              <motion.div
                variants={slideUpVariants}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-indigo-50/80 backdrop-blur-sm border border-[var(--color-secondary)]/30 text-[var(--color-secondary)] font-bold text-[11px] uppercase tracking-widest mb-6 shadow-sm"
              >
                Baagupadu <span className="text-[var(--color-text-muted)]/50">/</span> <span className="text-[var(--color-text)] font-semibold lowercase tracking-normal text-sm capitalize">బాగుపడు</span> <span className="text-[var(--color-text-muted)]/50">—</span> <span className="text-[var(--color-text-muted)]">Telugu: "To Prosper & Better Oneself"</span>
              </motion.div>
              <motion.h1
                variants={slideUpVariants}
                className="text-[48px] md:text-[64px] lg:text-[72px] text-[var(--color-text)] font-extrabold mb-6 tracking-tight leading-[1.1]"
              >
                Discover Who <br className="hidden md:block" />
                You Truly Are.
              </motion.h1>

              <motion.p
                variants={slideUpVariants}
                className="text-[var(--color-text-muted)] text-[18px] md:text-[20px] font-normal leading-relaxed mb-10"
              >
                The internet gave us unlimited access to knowledge, but it created an &quot;Information Paradox&quot;—confusion, lack of direction, and shallow learning. Sahayam is not just an AI chatbot; it is a personalized mentoring ecosystem designed to help you think independently, make better decisions, and take control of your life and career.
              </motion.p>

              <motion.div variants={slideUpVariants} className="flex flex-col sm:flex-row gap-4 items-center">
                <Link href="/chat">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center gap-2 text-white font-medium rounded-full px-8 py-4 text-[16px] transition-all bg-[var(--color-secondary)] hover:bg-[#4f51c7] shadow-[0_8px_20px_rgba(99,102,241,0.3)]"
                  >
                    Start My 6-Phase Journey
                    <ArrowRight className="w-4 h-4" />
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
            
            <div className="flex-1 w-full flex justify-center lg:justify-end relative lg:translate-x-12">
              <motion.div variants={slideUpVariants} className="w-full max-w-[500px] aspect-square relative z-10">
                <Hero3DAvatar />
              </motion.div>
              {/* Decorative background glow for 3D area */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-[var(--color-secondary)] to-[#E27D60] rounded-full blur-[100px] opacity-[0.08] -z-10" />
            </div>
          </div>

          {/* Sahayam Introduction Section */}
          <motion.div
            id="sahayam"
            variants={slideUpVariants}
            className="w-full glass-card p-10 md:p-16 mb-40 text-left relative overflow-hidden bg-white/70 shadow-2xl"
          >
            <div className="flex flex-col lg:flex-row items-center gap-16">
              {/* Agent Visual */}
              <div className="w-full lg:w-5/12">
                <div className="relative w-full h-[400px] overflow-visible flex items-center justify-center">
                   <AuraOverlay mode="dashboard" />
                   <SahayamCharacter mode="dashboard" />
                </div>
              </div>

              {/* Text & Traits */}
              <div className="w-full lg:w-7/12">
                <h3 className="text-4xl md:text-5xl font-extrabold mb-4 text-[var(--color-text)] tracking-tight">Meet <span className="gradient-text">Sahayam</span></h3>
                <h4 className="text-[20px] text-[var(--color-text-muted)] font-semibold mb-6">— Your Personal AI Mentor</h4>
                <p className="text-[var(--color-text)] font-normal leading-relaxed mb-10 text-[18px]">
                  Sahayam adapts dynamically to your needs. It acts as a friendly companion when you are consistent, transitions into a strict coach when discipline drops, and becomes a mentor when you need strategic career guidance.
                </p>

                <div className="space-y-6">
                  <h5 className="text-[14px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-4">Personality Blend</h5>
                  <div className="flex flex-wrap gap-3">
                    {PERSONALITY_TRAITS.map((trait, i) => (
                      <motion.div
                        key={trait.label}
                        className="px-5 py-2 rounded-full font-medium text-white shadow-md flex items-center gap-2"
                        style={{ backgroundColor: trait.color }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, type: "spring" }}
                      >
                        <span>{trait.label}</span>
                        <span className="opacity-80 text-sm">{trait.percentage}%</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Quote Callout */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                  className="mt-10 p-6 bg-white/50 border border-[var(--color-surface)] rounded-2xl relative"
                >
                  <div className="absolute -top-4 -left-2 text-6xl text-[var(--color-secondary)]/20 font-serif">&quot;</div>
                  <p className="text-[17px] font-medium italic text-[var(--color-text)] relative z-10">
                    The moment a person realizes that the world is shaped by people no smarter than them, everything changes.
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>

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
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="text-left p-10 rounded-[2rem] cursor-default transition-all duration-300 bg-white/70 hover:bg-white shadow-sm hover:shadow-xl border border-[var(--color-surface)] group relative overflow-hidden"
                >
                  <div className="mb-6 p-4 rounded-2xl w-fit bg-[var(--color-surface)] shadow-sm relative z-10">
                    {f.icon}
                  </div>
                  <h3 className="text-[20px] text-[var(--color-text)] font-semibold mb-4 relative z-10 tracking-tight">{f.title}</h3>
                  <p className="text-[var(--color-text-muted)] text-[16px] font-normal leading-relaxed relative z-10">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </motion.div>
      </main>
    </>
  );
}
