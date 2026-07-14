'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { updateDemographics } from '@/lib/api';
import { useUserProfileStore } from '@/stores/userProfileStore';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const { getToken } = useAuth();
  const { loadProfile } = useUserProfileStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    location: '',
    age_range: '',
    current_status: '',
    desired_role: '',
    primary_goal: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      
      await updateDemographics(formData, token);
      await loadProfile(token); // Refresh local store with new data
      router.push('/chat');
    } catch (error) {
      console.error("Failed to save demographics", error);
      alert("Something went wrong saving your profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatedBackground />
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl bg-white/70 backdrop-blur-xl border border-[var(--glass-border)] rounded-[2rem] p-8 md:p-12 shadow-xl"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-[var(--color-secondary)] to-[#818CF8] shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--color-text)] tracking-tight">Welcome to Baagupadu</h1>
              <p className="text-[var(--color-text-muted)] text-sm font-medium">Let's set up your profile before you meet Sahayam.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-[var(--color-text)] uppercase tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  name="full_name"
                  required
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full bg-white/50 border border-[var(--glass-border)] rounded-xl px-4 py-3 outline-none focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]/20 transition-all font-medium text-[var(--color-text)]"
                  placeholder="e.g. Sreekar Reddy"
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-[var(--color-text)] uppercase tracking-wider">Location</label>
                <input 
                  type="text" 
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full bg-white/50 border border-[var(--glass-border)] rounded-xl px-4 py-3 outline-none focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]/20 transition-all font-medium text-[var(--color-text)]"
                  placeholder="e.g. Hyderabad, India"
                />
              </div>

              {/* Age Range */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-[var(--color-text)] uppercase tracking-wider">Age Range</label>
                <select 
                  name="age_range"
                  required
                  value={formData.age_range}
                  onChange={handleChange}
                  className="w-full bg-white/50 border border-[var(--glass-border)] rounded-xl px-4 py-3 outline-none focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]/20 transition-all font-medium text-[var(--color-text)]"
                >
                  <option value="" disabled>Select your age</option>
                  <option value="Under 18">Under 18</option>
                  <option value="18-24">18-24</option>
                  <option value="25-34">25-34</option>
                  <option value="35-44">35-44</option>
                  <option value="45+">45+</option>
                </select>
              </div>

              {/* Current Status */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-[var(--color-text)] uppercase tracking-wider">Current Status</label>
                <select 
                  name="current_status"
                  required
                  value={formData.current_status}
                  onChange={handleChange}
                  className="w-full bg-white/50 border border-[var(--glass-border)] rounded-xl px-4 py-3 outline-none focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]/20 transition-all font-medium text-[var(--color-text)]"
                >
                  <option value="" disabled>What are you doing now?</option>
                  <option value="High School Student">High School Student</option>
                  <option value="College/University Student">College/University Student</option>
                  <option value="Employed Full-Time">Employed Full-Time</option>
                  <option value="Employed Part-Time">Employed Part-Time</option>
                  <option value="Freelancer/Entrepreneur">Freelancer/Entrepreneur</option>
                  <option value="Currently Unemployed">Currently Unemployed</option>
                </select>
              </div>
            </div>

            {/* Desired Role */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-[var(--color-text)] uppercase tracking-wider">Desired Role / Direction</label>
              <input 
                type="text" 
                name="desired_role"
                required
                value={formData.desired_role}
                onChange={handleChange}
                className="w-full bg-white/50 border border-[var(--glass-border)] rounded-xl px-4 py-3 outline-none focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]/20 transition-all font-medium text-[var(--color-text)]"
                placeholder="e.g. Product Manager, Software Engineer, or 'I don't know yet!'"
              />
            </div>

            {/* Primary Goal */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-[var(--color-text)] uppercase tracking-wider">Primary Goal</label>
              <select 
                name="primary_goal"
                required
                value={formData.primary_goal}
                onChange={handleChange}
                className="w-full bg-white/50 border border-[var(--glass-border)] rounded-xl px-4 py-3 outline-none focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]/20 transition-all font-medium text-[var(--color-text)]"
              >
                <option value="" disabled>What do you hope to achieve?</option>
                <option value="Finding my passion">Finding my true passion</option>
                <option value="Career Transition">Making a career transition</option>
                <option value="Leveling up">Leveling up in my current path</option>
                <option value="Starting a business">Starting my own business</option>
                <option value="Just exploring">Just exploring possibilities</option>
              </select>
            </div>

            <div className="pt-6 border-t border-[var(--glass-border)]">
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-[var(--color-secondary)] hover:bg-[#5658d6] text-white font-bold text-lg shadow-lg hover:shadow-[0_8px_25px_rgba(99,102,241,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Saving Profile...</>
                ) : (
                  <>Start Self-Discovery <ArrowRight className="w-5 h-5" /></>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
}
