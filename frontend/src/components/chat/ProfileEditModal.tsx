'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@clerk/nextjs';
import { updateDemographics } from '@/lib/api';
import { useUserProfileStore } from '@/stores/userProfileStore';
import { X, UserCircle, Loader2 } from 'lucide-react';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileEditModal({ isOpen, onClose }: ProfileEditModalProps) {
  const { profile, loadProfile } = useUserProfileStore();
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Initialize with current profile data
  const [formData, setFormData] = useState({
    full_name: profile?.life_stage_data?.demographics?.full_name || '',
    location: profile?.life_stage_data?.demographics?.location || '',
    age_range: profile?.life_stage_data?.demographics?.age_range || '',
    current_status: profile?.life_stage_data?.demographics?.current_status || '',
    desired_role: profile?.life_stage_data?.demographics?.desired_role || '',
    primary_goal: profile?.life_stage_data?.demographics?.primary_goal || '',
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
      await loadProfile(token); // Instantly updates local store so AI gets new context next message
      onClose();
    } catch (error) {
      console.error("Failed to save profile", error);
      alert("Something went wrong saving your profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden relative"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[var(--color-secondary)] to-[#818CF8] p-6 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <UserCircle className="w-6 h-6" />
              <h2 className="text-xl font-bold">Edit Your Profile</h2>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  name="full_name"
                  required
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full bg-black/5 border border-transparent rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]/20 transition-all text-sm font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Location</label>
                <input 
                  type="text" 
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full bg-black/5 border border-transparent rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]/20 transition-all text-sm font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Age Range</label>
                <select 
                  name="age_range"
                  required
                  value={formData.age_range}
                  onChange={handleChange}
                  className="w-full bg-black/5 border border-transparent rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]/20 transition-all text-sm font-medium appearance-none"
                >
                  <option value="" disabled>Select Age Range</option>
                  <option value="Under 18">Under 18</option>
                  <option value="18-24">18-24</option>
                  <option value="25-34">25-34</option>
                  <option value="35-44">35-44</option>
                  <option value="45+">45+</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Current Status</label>
                <select 
                  name="current_status"
                  required
                  value={formData.current_status}
                  onChange={handleChange}
                  className="w-full bg-black/5 border border-transparent rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]/20 transition-all text-sm font-medium appearance-none"
                >
                  <option value="" disabled>Select Status</option>
                  <option value="Student">Student</option>
                  <option value="Employed">Employed</option>
                  <option value="Unemployed">Unemployed</option>
                  <option value="Career Break">Career Break</option>
                  <option value="Freelancer">Freelancer/Entrepreneur</option>
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Desired Role / Industry</label>
                <input 
                  type="text" 
                  name="desired_role"
                  required
                  value={formData.desired_role}
                  onChange={handleChange}
                  className="w-full bg-black/5 border border-transparent rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]/20 transition-all text-sm font-medium"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Primary Goal</label>
                <select 
                  name="primary_goal"
                  required
                  value={formData.primary_goal}
                  onChange={handleChange}
                  className="w-full bg-black/5 border border-transparent rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]/20 transition-all text-sm font-medium appearance-none"
                >
                  <option value="" disabled>Select Goal</option>
                  <option value="Find my passion">Discover my true passion</option>
                  <option value="Career transition">Switch to a new career</option>
                  <option value="Skill development">Develop new skills</option>
                  <option value="Promotion/Growth">Grow in my current field</option>
                  <option value="Work-life balance">Achieve better work-life balance</option>
                </select>
              </div>
            </div>

            <div className="pt-6 flex justify-end gap-3">
              <button 
                type="button" 
                onClick={onClose}
                className="px-6 py-3 rounded-xl font-bold text-[var(--color-text-muted)] hover:bg-black/5 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="px-6 py-3 rounded-xl font-bold text-white bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/90 shadow-md flex items-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
