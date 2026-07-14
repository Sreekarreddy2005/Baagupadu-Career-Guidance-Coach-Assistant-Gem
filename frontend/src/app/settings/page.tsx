'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { updateDemographics } from '@/lib/api';
import { useUserProfileStore } from '@/stores/userProfileStore';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import { Settings, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const router = useRouter();
  const { getToken } = useAuth();
  const { profile, loadProfile, isLoading: isProfileLoading } = useUserProfileStore();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    location: '',
    age_range: '',
    current_status: '',
    desired_role: '',
    primary_goal: '',
  });

  useEffect(() => {
    async function initProfile() {
      const token = await getToken();
      if (token && !profile) {
        await loadProfile(token);
      }
    }
    initProfile();
  }, [getToken, loadProfile, profile]);

  useEffect(() => {
    if (profile?.life_stage_data?.demographics) {
      setFormData({
        full_name: profile.life_stage_data.demographics.full_name || '',
        location: profile.life_stage_data.demographics.location || '',
        age_range: profile.life_stage_data.demographics.age_range || '',
        current_status: profile.life_stage_data.demographics.current_status || '',
        desired_role: profile.life_stage_data.demographics.desired_role || '',
        primary_goal: profile.life_stage_data.demographics.primary_goal || '',
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      
      await updateDemographics(formData, token);
      await loadProfile(token);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to save demographics", error);
      alert("Something went wrong saving your profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isProfileLoading && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-secondary)]"></div>
      </div>
    );
  }

  return (
    <>
      <AnimatedBackground />
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative z-10 py-12">
        
        <div className="w-full max-w-2xl mb-6">
          <Link href="/chat" className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 hover:bg-white backdrop-blur-md border border-[var(--glass-border)] rounded-full text-sm font-bold text-[var(--color-text)] transition-all shadow-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Chat
          </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl bg-white/70 backdrop-blur-xl border border-[var(--glass-border)] rounded-[2rem] p-8 md:p-12 shadow-xl"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--color-surface)] border border-[var(--glass-border)] shadow-sm">
                <Settings className="w-5 h-5 text-[var(--color-text)]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[var(--color-text)] tracking-tight">Profile Settings</h1>
                <p className="text-[var(--color-text-muted)] text-sm font-medium">Update your core demographic information.</p>
              </div>
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

            <div className="pt-6 border-t border-[var(--glass-border)] flex items-center justify-between">
              {success ? (
                <div className="flex items-center gap-2 text-green-600 font-bold text-sm bg-green-50 px-4 py-2 rounded-lg">
                  <CheckCircle2 className="w-5 h-5" /> Saved Successfully!
                </div>
              ) : <div/>}

              <button 
                type="submit"
                disabled={loading}
                className="py-3 px-8 rounded-xl bg-[var(--color-text)] hover:bg-[var(--color-text-muted)] text-white font-bold shadow-md transition-all flex items-center gap-2 disabled:opacity-70 ml-auto"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                ) : (
                  <>Save Changes</>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
}
