import { create } from 'zustand';
import { fetchProfile } from '@/lib/api';
import type { HealthMetrics } from '@/types';

interface UserProfile {
  user_id?: string;
  session_progress: {
    current_phase: string;
    current_sub_phase: string | null;
    phase_completed: string[];
    phase_progress: Record<string, number>;
    health_metrics?: HealthMetrics;
  };
  life_stage_data: Record<string, any>;
  inferences: Record<string, any>;
  patterns: Record<string, any>;
  persona: Record<string, any>;
  guidance: Record<string, any>;
  conversation_memory: {
    last_5_exchanges: any[];
    phase_summaries: Record<string, string>;
    blocked_topics: string[];
    unresolved_topics: any[];
    sessions?: Record<string, {
      title: string;
      messages: Array<{
        role: 'user' | 'ai' | 'system';
        content: string;
        timestamp: string;
      }>;
    }>;
  };
}

interface UserProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  completedTasks: Record<string, boolean>;
  toggleTask: (taskId: string) => void;
  loadProfile: (token: string) => Promise<void>;
}

export const useUserProfileStore = create<UserProfileState>((setStore) => ({
  profile: null,
  isLoading: true,
  completedTasks: {},
  
  toggleTask: (taskId: string) => {
    setStore((state) => ({
      completedTasks: {
        ...state.completedTasks,
        [taskId]: !state.completedTasks[taskId]
      }
    }));
  },

  loadProfile: async (token: string) => {
    setStore({ isLoading: true });
    try {
      const storedProfile = await fetchProfile(token);
      setStore({ profile: storedProfile, isLoading: false });
    } catch (error) {
      console.error('Failed to load profile from Database:', error);
      setStore({ isLoading: false });
    }
  },
}));
