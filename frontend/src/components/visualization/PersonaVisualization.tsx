'use client';

import { motion } from 'framer-motion';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts';
import { useChatStore } from '@/lib/store/chatStore';
import { containerVariants, slideUpVariants, radarChartReveal } from '@/lib/utils/animations';
import { Download, Share2, X, Star } from 'lucide-react';

export default function PersonaVisualization() {
  const { personaResult, setShowVisualization, setAgentState } = useChatStore();

  if (!personaResult) return null;

  const radarData = personaResult.traits.map((t) => ({
    subject: t.name,
    value: t.value,
    fullMark: 100,
  }));

  const handleClose = () => {
    setShowVisualization(false);
    setAgentState('idle');
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-white/60 backdrop-blur-md"
        onClick={handleClose}
      />

      <motion.div
        className="relative w-full max-w-4xl bg-[var(--color-background)] border border-black/5 rounded-3xl overflow-hidden shadow-2xl shadow-indigo-500/10 my-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5 text-black/60" />
        </button>

        {/* Hero banner */}
        <div className="relative bg-gradient-to-br from-indigo-500 via-purple-400 to-pink-400 px-8 pt-10 pb-8 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-white"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.5, 1] }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
          <motion.div variants={slideUpVariants} className="relative z-10 text-center">
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 mx-0.5" />
                </motion.div>
              ))}
            </div>
            <p className="text-white/60 text-sm uppercase tracking-widest font-medium mb-2">
              Your Persona
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {personaResult.personaName}
            </h1>
            <p className="text-white/70 text-lg max-w-xl mx-auto leading-relaxed">
              {personaResult.description}
            </p>
          </motion.div>
        </div>

        <div className="p-8 space-y-8">
          {/* Radar chart + Strengths grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Radar chart */}
            <motion.div variants={radarChartReveal} className="bg-white border border-black/5 shadow-sm rounded-2xl p-6">
              <h2 className="text-[var(--color-text)] font-semibold mb-4 text-center">Trait Profile</h2>
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(0,0,0,0.1)" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
                  />
                  <Radar
                    name="Traits"
                    dataKey="value"
                    stroke="#7C3AED"
                    fill="#7C3AED"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Strengths */}
            <motion.div variants={slideUpVariants} className="space-y-3">
              <h2 className="text-[var(--color-text)] font-semibold mb-1">Your Superpowers</h2>
              {personaResult.strengths.map((s, i) => (
                <motion.div
                  key={s.label}
                  className="flex items-center gap-3 bg-white border border-black/5 shadow-sm rounded-xl px-4 py-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <span className="text-2xl">{s.icon}</span>
                  <span className="text-[var(--color-text)] font-medium">{s.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Career affinities */}
          <motion.div variants={slideUpVariants}>
            <h2 className="text-[var(--color-text)] font-semibold mb-4">Career Affinities</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {personaResult.careerAffinities.map((ca, i) => (
                <motion.div
                  key={ca.title}
                  className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <span className="text-3xl block mb-3">{ca.icon}</span>
                  <h3 className="text-indigo-900 font-semibold mb-1">{ca.title}</h3>
                  <p className="text-indigo-700/70 text-sm leading-relaxed">{ca.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Growth areas */}
          <motion.div variants={slideUpVariants}>
            <h2 className="text-[var(--color-text)] font-semibold mb-4">Growth Opportunities</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {personaResult.growthAreas.map((g, i) => (
                <motion.div
                  key={g.label}
                  className="bg-orange-50 border border-orange-100 rounded-2xl p-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                >
                  <h3 className="text-orange-600 font-semibold mb-1">{g.label}</h3>
                  <p className="text-orange-800/70 text-sm">{g.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            variants={slideUpVariants}
            className="flex items-center justify-center gap-4 pt-2"
          >
            <button className="flex items-center gap-2 bg-white border border-black/10 hover:bg-black/5 text-[var(--color-text-muted)] rounded-2xl px-6 py-3 text-sm font-medium transition-all">
              <Download className="w-4 h-4" />
              Download PDF
            </button>
            <button className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 text-white rounded-2xl px-8 py-3 text-sm font-semibold transition-all shadow-lg shadow-indigo-500/30">
              <Share2 className="w-4 h-4" />
              Share My Persona
            </button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
