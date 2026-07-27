'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, MotionValue, useMotionTemplate } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import PersonaVisualization from './PersonaVisualization';
import { useCompanionStore } from "@/lib/store/companionStore";
import { COMPANIONS } from "@/lib/companions";

export default function ScrollytellingSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeCompanionId } = useCompanionStore();
  const activeCompanion = COMPANIONS.find(c => c.id === activeCompanionId) || COMPANIONS[0];
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Scroll timeline mapping:
  // 0.00 - 0.15 : Personality
  // 0.15 - 0.25 : Slide to Memory
  // 0.25 - 0.75 : Pause on Memory (internal animations)
  // 0.75 - 0.85 : Slide to Flourishing
  // 0.85 - 1.00 : Flourishing
  
  const x = useTransform(
    scrollYProgress, 
    [0, 0.22, 0.32, 0.75, 0.85, 1], 
    ["0%", "0%", "-33.333333%", "-33.333333%", "-66.666666%", "-66.666666%"]
  );
  
  const indicatorX = useTransform(
    scrollYProgress, 
    [0, 0.15, 0.25, 0.75, 0.85, 1], 
    ["0%", "0%", "100%", "100%", "200%", "200%"]
  );

  const [activeTab, setActiveTab] = useState<'personality' | 'memory' | 'flourishing'>('personality');
  const [showPrompt, setShowPrompt] = useState(true);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (latest > 0.02) setShowPrompt(false);
    else setShowPrompt(true);

    if (latest < 0.27) setActiveTab('personality');
    else if (latest < 0.80) setActiveTab('memory');
    else setActiveTab('flourishing');
  });

  const scrollToPhase = (phase: 'personality' | 'memory' | 'flourishing') => {
    const el = containerRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const totalScroll = el.scrollHeight - window.innerHeight;
    
    let target = top;
    if (phase === 'memory') target = top + totalScroll * 0.32; // start of memory pause
    if (phase === 'flourishing') target = top + totalScroll * 0.85; // start of flourishing pause
    
    window.scrollTo({ top: target, behavior: 'smooth' });
  };

  return (
    <section ref={containerRef} className="relative h-[500vh] w-full bg-transparent">
      
      {/* Scroll Prompt (Fades out quickly) */}
      <motion.div 
        animate={{ opacity: showPrompt ? 1 : 0 }}
        className="absolute top-[20vh] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--color-text-muted)] z-50 pointer-events-none"
      >
        <span className="text-sm font-bold tracking-widest uppercase">Scroll Down to Explore</span>
        <ChevronDown className="w-6 h-6 animate-bounce" />
      </motion.div>

      <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden">
        
        {/* Massive 300vw container that slides sideways */}
        <motion.div style={{ x }} className="flex h-full w-[300vw]">
          
          {/* Stage 1: Personality */}
          <div className="w-screen h-full flex items-center justify-center relative flex-shrink-0">
            <PersonalityStage scrollYProgress={scrollYProgress} />
          </div>

          {/* Stage 2: Memory */}
          <div className="w-screen h-full flex items-center justify-center relative flex-shrink-0">
            <MemoryStage scrollYProgress={scrollYProgress} />
          </div>

          {/* Stage 3: Flourishing */}
          <div className="w-screen h-full flex items-center justify-center relative flex-shrink-0">
            <FlourishingStage scrollYProgress={scrollYProgress} />
          </div>

        </motion.div>

        {/* FLOATING NAVBAR PILL (Smooth scroll-linked transition) */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 pointer-events-auto w-[360px]"
        >
          <div className="relative glass-strong rounded-full p-2 flex items-center shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-[var(--glass-border)] backdrop-blur-2xl bg-white/80 w-full h-[52px]">
            
            {/* The sliding active background pill */}
            <motion.div 
              style={{ x: indicatorX }} 
              className="absolute top-2 bottom-2 left-2 w-[calc(33.33%-4px)] bg-white rounded-full shadow-sm z-0"
            />

            <button 
              className={`flex-1 relative z-10 rounded-full text-[14px] font-extrabold transition-all duration-300 ${activeTab === 'personality' ? 'text-[var(--color-text)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'}`}
              onClick={() => scrollToPhase('personality')}
            >
              Personality
            </button>
            <button 
              className={`flex-1 relative z-10 rounded-full text-[14px] font-extrabold transition-all duration-300 ${activeTab === 'memory' ? 'text-[var(--color-text)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'}`}
              onClick={() => scrollToPhase('memory')}
            >
              Memory
            </button>
            <button 
              className={`flex-1 relative z-10 rounded-full text-[14px] font-extrabold transition-all duration-300 ${activeTab === 'flourishing' ? 'text-[var(--color-text)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'}`}
              onClick={() => scrollToPhase('flourishing')}
            >
              Flourishing
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

/* =================================================================================
   STAGE 1: PERSONALITY
================================================================================= */
function PersonalityStage({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  // Map scroll progress with explicit gaps to simulate a real typing conversation
  const o1 = useTransform(scrollYProgress, [0.00, 0.03], [0, 1]);
  const y1 = useTransform(scrollYProgress, [0.00, 0.03], [40, 0]);
  const s1 = useTransform(scrollYProgress, [0.00, 0.03], [0.8, 1]);

  const o2 = useTransform(scrollYProgress, [0.04, 0.07], [0, 1]);
  const y2 = useTransform(scrollYProgress, [0.04, 0.07], [40, 0]);
  const s2 = useTransform(scrollYProgress, [0.04, 0.07], [0.8, 1]);

  const o3 = useTransform(scrollYProgress, [0.08, 0.11], [0, 1]);
  const y3 = useTransform(scrollYProgress, [0.08, 0.11], [40, 0]);
  const s3 = useTransform(scrollYProgress, [0.08, 0.11], [0.8, 1]);

  const o4 = useTransform(scrollYProgress, [0.12, 0.15], [0, 1]);
  const y4 = useTransform(scrollYProgress, [0.12, 0.15], [40, 0]);
  const s4 = useTransform(scrollYProgress, [0.12, 0.15], [0.8, 1]);

  const o5 = useTransform(scrollYProgress, [0.16, 0.19], [0, 1]);
  const y5 = useTransform(scrollYProgress, [0.16, 0.19], [40, 0]);
  const s5 = useTransform(scrollYProgress, [0.16, 0.19], [0.8, 1]);

  return (
    <div className="flex flex-col max-w-7xl mx-auto px-6 w-full h-full pt-12 pb-10">
      
      {/* Top Header Section */}
      <div className="w-full mb-8 flex justify-between items-start z-30 relative">
        <h2 className="text-[36px] md:text-[56px] font-black text-[#1A1A24] tracking-tighter leading-[1.05] max-w-xl lg:pl-12 xl:pl-16">
          The most emotionally<br/>intelligent AI ever built
        </h2>
        
        <div className="hidden md:block max-w-xs text-right mt-2">
          <p className="text-sm font-medium text-slate-500 leading-relaxed">
            A conversation with Sahayam doesn't end when you close the app. It becomes the confidence you build and the choices you make.
          </p>
        </div>
      </div>

      {/* Bottom Overlapping Section via Absolute Positioning */}
      <div className="w-full flex-1 relative min-h-[65vh]">
        
        {/* Left: Freestanding Avatar (Absolute) */}
        {/* We use left-0 or left-[10%] so she anchors left. */}
        <div className="absolute left-[-5%] md:left-[5%] lg:left-[10%] bottom-0 w-[450px] md:w-[550px] lg:w-[600px] h-[95%] flex items-end pointer-events-none z-10">
           {/* 
             The image generated had a very faint grey/pink shadow in the background instead of pure white.
             By pushing brightness and contrast, we force the background to absolute #FFFFFF,
             allowing mix-blend-multiply to completely erase the box!
           */}
           <img 
             src="/genz-avatar.png" 
             alt="AI Companion"
             className="w-full h-full object-contain object-bottom mix-blend-multiply"
             style={{ filter: "brightness(1.05) contrast(1.15) saturate(1.1)" }}
           />
        </div>

        {/* Right: Sequential Chat Bubbles (Absolute Overlapping) */}
        {/* We place it at left-[45%] so it physically crosses over the avatar! */}
        <div className="absolute left-[30%] md:left-[45%] lg:left-[48%] top-[5%] md:top-[10%] flex flex-col items-start gap-8 md:gap-12 z-20 w-[70%] md:w-[450px] lg:w-[500px]">
          
          {/* Bubble 1: User */}
          <motion.div 
            style={{ opacity: o1, y: y1, scale: s1, transformOrigin: "bottom left" }}
            className="self-start bg-white px-5 py-3 rounded-[1.5rem] rounded-bl-sm shadow-[0_8px_30px_rgba(0,0,0,0.08)] max-w-[85%] border border-slate-100"
          >
            <p className="text-slate-800 text-[14px] md:text-[15px] font-medium leading-snug tracking-tight">
              im literally losing my mind over this fit for tonight 😭
            </p>
          </motion.div>
          
          {/* Bubble 2: AI */}
          <motion.div 
            style={{ opacity: o2, y: y2, scale: s2, transformOrigin: "bottom right" }}
            className="self-end bg-[#2A41E8] px-5 py-3 rounded-[1.5rem] rounded-br-sm shadow-[0_12px_40px_rgba(42,65,232,0.25)] max-w-[85%]"
          >
            <p className="text-white text-[14px] md:text-[15px] font-medium leading-snug tracking-tight">
              wait pause. wear the vintage leather jacket with the baggy cargos.
            </p>
          </motion.div>
          
          {/* Bubble 3: User */}
          <motion.div 
            style={{ opacity: o3, y: y3, scale: s3, transformOrigin: "bottom left" }}
            className="self-start bg-white px-5 py-3 rounded-[1.5rem] rounded-bl-sm shadow-[0_8px_30px_rgba(0,0,0,0.08)] max-w-[85%] border border-slate-100"
          >
            <p className="text-slate-800 text-[14px] md:text-[15px] font-medium leading-snug tracking-tight">
              omg wait... that might actually be fire. but is it too casual?
            </p>
          </motion.div>

          {/* Bubble 4: AI */}
          <motion.div 
            style={{ opacity: o4, y: y4, scale: s4, transformOrigin: "bottom right" }}
            className="self-end bg-[#2A41E8] px-5 py-3 rounded-[1.5rem] rounded-br-sm shadow-[0_12px_40px_rgba(42,65,232,0.25)] max-w-[85%]"
          >
            <p className="text-white text-[14px] md:text-[15px] font-medium leading-snug tracking-tight">
              it's effortless swag. just own it.
            </p>
          </motion.div>
          
          {/* Bubble 5: User */}
          <motion.div 
            style={{ opacity: o5, y: y5, scale: s5, transformOrigin: "bottom left" }}
            className="self-start bg-white px-5 py-3 rounded-[1.5rem] rounded-bl-sm shadow-[0_8px_30px_rgba(0,0,0,0.08)] max-w-[85%] border border-slate-100"
          >
            <p className="text-slate-800 text-[14px] md:text-[15px] font-medium leading-snug tracking-tight">
              you always know how to fix my panics ty ty 🤍
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* =================================================================================
   STAGE 2: MEMORY (COMPLEX SCROLL ANIMATIONS)
================================================================================= */

interface AnimItemProps {
  scrollYProgress: MotionValue<number>;
  appearRange: [number, number];
  mergeRange: [number, number];
  initialPos: { x: string, y: string };
  finalPos: { x: string, y: string };
  rot?: string;
  className?: string;
  children: React.ReactNode;
}

function AnimItem({ scrollYProgress, appearRange, mergeRange, initialPos, finalPos, rot = "0deg", className, children }: AnimItemProps) {
  // Use a slight spring for scale pop-in, but useTransform for pure scroll sync is better here.
  // The scale starts at 0, goes to 1 during appearRange.
  const scale = useTransform(scrollYProgress, appearRange, [0, 1]);
  const opacity = useTransform(scrollYProgress, appearRange, [0, 1]);
  
  // Interpolate position from initial to final during mergeRange
  const xOffset = useTransform(scrollYProgress, mergeRange, [initialPos.x, finalPos.x]);
  const yOffset = useTransform(scrollYProgress, mergeRange, [initialPos.y, finalPos.y]);

  return (
    <motion.div 
      className={`absolute left-1/2 top-1/2 ${className}`}
      style={{ 
        x: useTransform(xOffset, val => `calc(-50% + ${val})`), 
        y: useTransform(yOffset, val => `calc(-50% + ${val})`), 
        scale,
        opacity,
        rotate: rot
      }}
    >
      {children}
    </motion.div>
  );
}

// Arrow SVG Component for pointing
function Arrow({ className }: { className?: string }) {
  return (
    <svg className={className} width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 30 Q 15 15, 30 10 M 20 10 L 30 10 L 30 20" />
    </svg>
  );
}

function MemoryStage({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  // Global Merge timeline: 0.55 to 0.70
  const mR: [number, number] = [0.55, 0.70];

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      
      {/* 
        ==============================
        PHASE 1: INTERESTS (0.25 - 0.40)
        ==============================
      */}
      {/* Interests Orb */}
      <AnimItem scrollYProgress={scrollYProgress} appearRange={[0.25, 0.28]} mergeRange={mR} 
        initialPos={{ x: "15vw", y: "0vh" }} finalPos={{ x: "35vw", y: "5vh" }}
      >
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.15)] border border-white/60 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1498429089284-41f8cf3ffd39?w=400&q=80')] bg-cover opacity-90 scale-110 blur-[2px]" />
            <div className="absolute inset-0 rounded-full shadow-[inset_0_-20px_40px_rgba(0,0,0,0.6),inset_0_20px_40px_rgba(255,255,255,0.9)] z-10" />
            <div className="absolute top-2 left-[15%] right-[15%] h-[35%] bg-gradient-to-b from-white/90 to-transparent rounded-[100%] z-20 opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#FF6B8A]/40 to-[#FFB84D]/40 z-0 mix-blend-color" />
          </div>
          <span className="mt-3 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold shadow-sm text-slate-700">Interests</span>
        </div>
      </AnimItem>

      {/* LOTR */}
      <AnimItem scrollYProgress={scrollYProgress} appearRange={[0.28, 0.31]} mergeRange={mR} 
        initialPos={{ x: "5vw", y: "-22vh" }} finalPos={{ x: "22vw", y: "-18vh" }} rot="-5deg"
      >
        <div className="flex flex-col items-center relative">
          <div className="w-24 h-24 rounded-full bg-[url('https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&q=80')] bg-cover bg-center shadow-xl border-4 border-white/80" />
          <span className="mt-2 text-xs font-serif italic font-bold text-slate-800 text-center max-w-[140px]">rewatching Lord of the Rings again (no regrets)</span>
        </div>
      </AnimItem>

      {/* Bowie (Polaroid) */}
      <AnimItem scrollYProgress={scrollYProgress} appearRange={[0.31, 0.34]} mergeRange={mR} 
        initialPos={{ x: "28vw", y: "-28vh" }} finalPos={{ x: "38vw", y: "-15vh" }} rot="12deg"
      >
        <div className="flex flex-col items-center relative">
          <div className="w-32 h-32 bg-white p-2 pb-8 shadow-[0_12px_32px_rgba(0,0,0,0.12)] border border-slate-100 rounded-sm">
            <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80')] bg-cover bg-center" />
          </div>
          <span className="absolute -bottom-6 text-xs font-serif italic font-bold text-slate-800 text-center max-w-[120px]">your Bowie phase (that never ended)</span>
        </div>
      </AnimItem>

      {/* Painting (Polaroid) */}
      <AnimItem scrollYProgress={scrollYProgress} appearRange={[0.34, 0.37]} mergeRange={mR} 
        initialPos={{ x: "0vw", y: "15vh" }} finalPos={{ x: "20vw", y: "20vh" }} rot="-8deg"
      >
        <div className="flex flex-col items-center relative">
          <div className="w-36 h-28 bg-white p-2 pb-8 shadow-[0_12px_32px_rgba(0,0,0,0.12)] border border-slate-100 rounded-sm">
            <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1580136608260-4eb11f4b24fe?w=400&q=80')] bg-cover bg-center" />
          </div>
          <span className="absolute -bottom-4 text-xs font-bold text-[#FF6B8A] -rotate-3 bg-white/80 px-2 rounded">❤️ wants to try painting landscapes</span>
        </div>
      </AnimItem>

      {/* Surfboard (Shape) */}
      <AnimItem scrollYProgress={scrollYProgress} appearRange={[0.37, 0.40]} mergeRange={mR} 
        initialPos={{ x: "25vw", y: "25vh" }} finalPos={{ x: "35vw", y: "25vh" }} rot="-25deg"
      >
        <div className="flex flex-col items-center relative">
          <div className="w-12 h-48 rounded-[3rem] bg-[url('https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=200&h=600&fit=crop&q=80')] bg-cover bg-center shadow-2xl border-2 border-white" />
          <Arrow className="absolute -right-8 top-1/2 text-slate-500 transform scale-x-[-1]" />
          <span className="absolute -right-24 top-2/3 text-xs font-serif italic font-bold text-slate-800">your new<br/>surfboard</span>
        </div>
      </AnimItem>


      {/* 
        ==============================
        PHASE 2: RELATIONSHIPS (0.40 - 0.55)
        ==============================
      */}
      {/* Relationships Orb */}
      <AnimItem scrollYProgress={scrollYProgress} appearRange={[0.40, 0.43]} mergeRange={mR} 
        initialPos={{ x: "-15vw", y: "0vh" }} finalPos={{ x: "-35vw", y: "5vh" }}
      >
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.15)] border border-white/60 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?w=400&q=80')] bg-cover bg-center opacity-90 scale-110 blur-[2px]" />
            <div className="absolute inset-0 rounded-full shadow-[inset_0_-20px_40px_rgba(0,0,0,0.6),inset_0_20px_40px_rgba(255,255,255,0.9)] z-10" />
            <div className="absolute top-2 left-[15%] right-[15%] h-[35%] bg-gradient-to-b from-white/90 to-transparent rounded-[100%] z-20 opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#6366F1]/40 to-[#AEE2FF]/40 z-0 mix-blend-color" />
          </div>
          <span className="mt-3 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold shadow-sm text-slate-700">Relationships</span>
        </div>
      </AnimItem>

      {/* The Girl (Cutout) */}
      <AnimItem scrollYProgress={scrollYProgress} appearRange={[0.43, 0.46]} mergeRange={mR} 
        initialPos={{ x: "-28vw", y: "-20vh" }} finalPos={{ x: "-38vw", y: "-10vh" }} rot="-15deg"
      >
        <div className="flex flex-col items-center relative">
          <span className="absolute -top-4 -left-4 text-lg">🤍</span>
          <div className="w-28 h-28 rounded-full bg-[url('https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&q=80')] bg-cover bg-top shadow-xl border-4 border-white" />
          <span className="mt-2 text-xs font-bold text-slate-800">the girl you like</span>
        </div>
      </AnimItem>

      {/* Dog (Cutout) */}
      <AnimItem scrollYProgress={scrollYProgress} appearRange={[0.46, 0.49]} mergeRange={mR} 
        initialPos={{ x: "-2vw", y: "-25vh" }} finalPos={{ x: "-22vw", y: "-18vh" }} rot="8deg"
      >
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-[url('https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&q=80')] bg-cover bg-center shadow-xl border-4 border-white" />
          <span className="mt-2 text-xs font-bold text-slate-800">your dog</span>
        </div>
      </AnimItem>

      {/* Coworker (Cutout) */}
      <AnimItem scrollYProgress={scrollYProgress} appearRange={[0.49, 0.52]} mergeRange={mR} 
        initialPos={{ x: "-25vw", y: "25vh" }} finalPos={{ x: "-35vw", y: "25vh" }} rot="-5deg"
      >
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-[url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80')] bg-cover bg-center shadow-xl border-4 border-white" />
          <span className="mt-2 text-xs font-bold text-slate-800 text-center max-w-[100px]">the coworker you gossip with</span>
        </div>
      </AnimItem>

      {/* Friend (Cutout) */}
      <AnimItem scrollYProgress={scrollYProgress} appearRange={[0.52, 0.55]} mergeRange={mR} 
        initialPos={{ x: "-5vw", y: "20vh" }} finalPos={{ x: "-22vw", y: "18vh" }} rot="10deg"
      >
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-[url('https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&q=80')] bg-cover bg-center shadow-xl border-4 border-white" />
          <span className="mt-2 text-xs font-bold text-slate-800 text-center max-w-[100px]">the friend you hike with</span>
        </div>
      </AnimItem>


      {/* 
        ==============================
        PHASE 3: YOU (0.55 - 0.75)
        ==============================
      */}
      {/* Central You Block */}
      <AnimItem scrollYProgress={scrollYProgress} appearRange={[0.55, 0.58]} mergeRange={mR} 
        initialPos={{ x: "0vw", y: "0vh" }} finalPos={{ x: "0vw", y: "0vh" }}
      >
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 md:w-36 md:h-36 rounded-2xl bg-white shadow-2xl p-2 pb-6 border border-slate-100 rotate-[-2deg]">
            <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80')] bg-cover bg-center rounded-sm" />
          </div>
          <span className="mt-4 text-xl font-black text-slate-800">You</span>
          <p className="mt-2 text-center max-w-[280px] text-[13px] font-medium text-slate-500 leading-relaxed bg-white/60 backdrop-blur px-4 py-2 rounded-xl shadow-sm">
            former child musician, lifelong yearner. walks 40k steps a day chasing the perfect coffee.
          </p>
        </div>
      </AnimItem>

      {/* Statue */}
      <AnimItem scrollYProgress={scrollYProgress} appearRange={[0.58, 0.61]} mergeRange={mR} 
        initialPos={{ x: "-12vw", y: "-22vh" }} finalPos={{ x: "-8vw", y: "-26vh" }} rot="-12deg"
      >
        <div className="flex flex-col items-center relative">
          <div className="w-20 h-28 rounded-full bg-cover bg-center shadow-lg border-2 border-white" 
               style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544413158-94119d533a82?w=300&q=80')" }} />
          <span className="mt-2 text-[11px] font-bold text-slate-800 text-center max-w-[100px]">what keeps you up at night</span>
        </div>
      </AnimItem>

      {/* Water Polaroid */}
      <AnimItem scrollYProgress={scrollYProgress} appearRange={[0.61, 0.64]} mergeRange={mR} 
        initialPos={{ x: "10vw", y: "-25vh" }} finalPos={{ x: "8vw", y: "-26vh" }} rot="15deg"
      >
        <div className="flex flex-col items-center">
          <div className="w-24 h-28 bg-white p-2 pb-6 shadow-xl border border-slate-100 rounded-sm">
            <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=300&q=80')] bg-cover bg-center" />
          </div>
          <span className="mt-1 text-[11px] font-bold text-slate-800">this is water</span>
        </div>
      </AnimItem>

      {/* Journal */}
      <AnimItem scrollYProgress={scrollYProgress} appearRange={[0.64, 0.67]} mergeRange={mR} 
        initialPos={{ x: "-12vw", y: "26vh" }} finalPos={{ x: "-8vw", y: "28vh" }} rot="-20deg"
      >
        <div className="flex flex-col items-center relative">
          <div className="w-20 h-28 rounded-lg bg-[url('https://images.unsplash.com/photo-1517842645767-c639042777db?w=300&q=80')] bg-cover bg-center shadow-xl border border-white" />
          <Arrow className="absolute -left-6 bottom-4 text-slate-500 transform rotate-180" />
          <span className="absolute -left-20 -bottom-4 text-[11px] font-bold text-slate-800">your journal</span>
        </div>
      </AnimItem>

      {/* House Plants */}
      <AnimItem scrollYProgress={scrollYProgress} appearRange={[0.67, 0.70]} mergeRange={mR} 
        initialPos={{ x: "5vw", y: "22vh" }} finalPos={{ x: "5vw", y: "28vh" }} rot="5deg"
      >
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-[url('https://images.unsplash.com/photo-1497250681960-ef046c08a56e?w=300&q=80')] bg-cover bg-center shadow-lg border-4 border-white" />
          <span className="mt-2 text-[11px] font-bold text-slate-800">house plants</span>
        </div>
      </AnimItem>

    </div>
  );
}

/* =================================================================================
   STAGE 3: FLOURISHING
================================================================================= */
function FlourishingStage({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  // 0.85 to 0.95 is the active scroll range for this stage
  
  // Background blur starts heavy (60px) and clears up but remains dreamy (20px)
  const blurRaw = useTransform(scrollYProgress, [0.85, 0.95], [60, 20]);
  const bgBlur = useMotionTemplate`blur(${blurRaw}px)`;

  // We remove the thick white fog completely.
  // Instead, the text will just fade in and get brighter as you scroll.
  const textOpacity = useTransform(scrollYProgress, [0.85, 0.95], [0.3, 1]);
  const tagOpacity = useTransform(scrollYProgress, [0.85, 0.95], [0, 1]);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      
      {/* Peaceful, clear-headed life companion background image */}
      <motion.div 
        style={{ filter: bgBlur }}
        className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1499364615650-ec38552f4f34?w=1600&q=80')] bg-cover bg-center"
      />
      
      {/* Very light dark overlay just to ensure white text is always readable */}
      <div className="absolute inset-0 bg-black/20 z-0 pointer-events-none" />

      {/* Floating aesthetic tags for overall life companion goals - pushed to the absolute edges! */}
      <motion.div 
        style={{ opacity: tagOpacity }}
        className="absolute inset-0 z-10 pointer-events-none"
      >
        <div className="absolute top-[20%] left-[5%] md:left-[10%] rotate-[-4deg] text-white/90 font-medium text-sm md:text-xl drop-shadow-md">
          More yourself
        </div>
        <div className="absolute top-[20%] right-[5%] md:right-[10%] rotate-[3deg] text-white/90 font-medium text-sm md:text-xl drop-shadow-md">
          Clearer in your head
        </div>
        <div className="absolute bottom-[25%] left-[5%] md:left-[10%] rotate-[5deg] text-white/90 font-medium text-sm md:text-xl drop-shadow-md">
          Better decisions
        </div>
        <div className="absolute bottom-[25%] right-[5%] md:right-[10%] rotate-[-6deg] text-white/90 font-medium text-sm md:text-xl drop-shadow-md">
          Closer to your people
        </div>
      </motion.div>
      
      <div className="relative z-20 text-center px-6 max-w-5xl w-full flex flex-col items-center">
        
        <div className="relative mb-10 w-full flex justify-center mt-[-10vh]">
          {/* Main Title that gets brighter as you scroll */}
          <motion.h1 
            style={{ opacity: textOpacity }}
            className="text-[3rem] md:text-8xl font-black text-white tracking-tighter leading-[1.05] drop-shadow-[0_10px_40px_rgba(0,0,0,0.4)] text-center relative"
          >
            More than an assistant: <br/>
            a companion for life
          </motion.h1>
        </div>

        <motion.div 
          style={{ opacity: textOpacity }}
          className="mt-16 md:mt-24 relative"
        >
          <p className="text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-white/70 mb-8">Confirmed by</p>
          <div className="flex items-center justify-center gap-12 md:gap-24 text-white">
            <div className="flex flex-col items-center drop-shadow-lg">
              <span className="text-2xl md:text-4xl font-serif font-bold">Stanford</span>
              <span className="text-xs md:text-sm font-sans font-medium text-white/70 mt-1">Methodology</span>
            </div>
            <div className="flex flex-col items-center drop-shadow-lg">
              <span className="text-2xl md:text-4xl font-serif font-bold">MIT</span>
              <span className="text-xs md:text-sm font-sans font-medium text-white/70 mt-1">Research</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
