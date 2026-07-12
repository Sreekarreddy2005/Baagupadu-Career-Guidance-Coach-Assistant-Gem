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
import SahayamPersonalityWheel from '@/components/visualization/SahayamPersonalityWheel';

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
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-[var(--glass-border)] text-sm font-semibold text-[var(--color-text-muted)] mb-8 shadow-sm hover:shadow-[0_0_25px_rgba(108,60,225,0.25)] hover:border-[var(--color-secondary)]/40 hover:text-[var(--color-text)] transition-all duration-300 cursor-default"
              >
                Baagupadu <span className="mx-2 text-xs">/</span> బాగుపడు <span className="mx-2 text-xs">—</span> Telugu: "To Prosper & Better Oneself"
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
                <div className="relative flex items-center bg-white/80 backdrop-blur-md rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-[var(--glass-border)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300 group">
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
            className="w-full relative py-20 my-24 bg-gradient-to-b from-transparent via-indigo-50/40 to-transparent rounded-[4rem]"
          >
            <div className="flex flex-col lg:flex-row items-center gap-12 md:gap-16 px-4 md:px-8">
              {/* Agent Visual */}
              <div className="w-full lg:w-5/12 flex items-center justify-center relative">
                {/* Soft anchoring glow instead of a hard box */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-secondary)]/10 to-[#FF6B8A]/10 rounded-full blur-[60px] -z-10" />
                <div className="relative w-full h-[400px] flex items-center justify-center">
                   <AuraOverlay mode="dashboard" />
                   <SahayamCharacter mode="dashboard" />
                </div>
              </div>

              {/* Text & Traits */}
              <div className="w-full lg:w-7/12 relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] font-bold text-[11px] uppercase tracking-widest mb-6">
                  Your AI Companion
                </div>
                <h3 className="text-4xl md:text-5xl font-extrabold mb-4 text-[var(--color-text)] tracking-tight">Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-secondary)] to-[#FF6B8A]">Sahayam</span></h3>
                <h4 className="text-[20px] text-[var(--color-text-muted)] font-semibold mb-6">— Your Personal AI Mentor</h4>
                <p className="text-[var(--color-text)] font-normal leading-relaxed mb-10 text-[18px]">
                  Sahayam adapts dynamically to your needs. It acts as a friendly companion when you are consistent, transitions into a strict coach when discipline drops, and becomes a mentor when you need strategic career guidance.
                </p>

                <div className="space-y-6 bg-white/60 backdrop-blur-md p-8 rounded-[2rem] border border-[var(--glass-border)] shadow-[0_8px_32px_rgba(0,0,0,0.04)] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[var(--color-secondary)]/10 to-transparent rounded-full blur-3xl -z-10" />
                  <h5 className="text-[14px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-4">Personality Blend</h5>
                  <SahayamPersonalityWheel />
                </div>

                {/* Quote Callout */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                  className="mt-8 p-6 bg-white/80 backdrop-blur-lg border border-[var(--color-secondary)]/20 shadow-lg shadow-[var(--color-secondary)]/5 rounded-2xl relative"
                >
                  <div className="absolute -top-5 -left-2 text-6xl text-[var(--color-secondary)]/30 font-serif">&quot;</div>
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
                  whileHover={{ y: -6, scale: 1.01 }}
                  className="text-left p-10 rounded-[2rem] cursor-default transition-all duration-300 border group relative overflow-hidden bg-white/70 hover:bg-white shadow-sm hover:shadow-xl border-[var(--color-surface)]"
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
                <motion.div key={i} variants={slideUpVariants} whileHover={{ y: -5 }} className="p-8 rounded-[2rem] bg-gradient-to-br from-white to-white/60 backdrop-blur-sm border border-[var(--glass-border)] shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
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
                   <div className="absolute -left-[20px] top-0 w-11 h-11 rounded-full bg-white border-4 border-[var(--color-surface)] group-hover:border-[var(--color-secondary)] group-hover:scale-110 shadow-sm flex items-center justify-center text-lg transition-all duration-300 z-10">
                     {step.icon}
                   </div>
                   <div className="bg-white/50 hover:bg-white rounded-2xl p-6 border border-transparent hover:border-[var(--glass-border)] hover:shadow-lg transition-all duration-300 -mt-2 cursor-default">
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
                  className={`flex flex-col items-center bg-white p-6 rounded-2xl border w-full md:w-[22%] text-center transition-all duration-300 ${
                    step.active 
                      ? 'shadow-xl border-[var(--color-secondary)] ring-4 ring-[var(--color-secondary)]/10' 
                      : 'shadow-sm border-[var(--glass-border)] opacity-80 hover:opacity-100 hover:shadow-md'
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
    </>
  );
}
