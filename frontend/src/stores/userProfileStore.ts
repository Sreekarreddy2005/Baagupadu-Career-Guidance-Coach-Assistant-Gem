import { create } from 'zustand';
import { fetchProfile } from '@/lib/api';

interface UserProfile {
  user_id?: string;
  session_progress: {
    current_phase: string;
    current_sub_phase: string | null;
    phase_completed: string[];
    phase_progress: Record<string, number>;
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
  };
}

interface UserProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  loadProfile: (token: string) => Promise<void>;
}

export const useUserProfileStore = create<UserProfileState>((setStore) => ({
  profile: null,
  isLoading: true,

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
