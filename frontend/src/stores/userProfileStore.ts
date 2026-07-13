import { create } from 'zustand';
import { get, set } from 'idb-keyval';

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
  loadProfile: (userId: string) => Promise<void>;
  updateProfile: (userId: string, newProfile: Partial<UserProfile>) => Promise<void>;
}

const defaultProfile: UserProfile = {
  session_progress: {
    current_phase: 'discovery',
    current_sub_phase: 'trust_building',
    phase_completed: [],
    phase_progress: {
      discovery: 0,
      exploration: 0,
      synthesis: 0,
      guidance: 0,
    },
  },
  life_stage_data: { childhood: {}, teenage: {}, adult: {} },
  inferences: { traits: [], identity_drivers: [], shadow_traits: [], pattern_disruptions: [], contradictions: [] },
  patterns: { behavioral: [], emotional: [], cognitive: [], social: [], values: [], disruptions: [], holding_pen: [] },
  persona: { core_identity: {}, core_drivers: {}, strengths: [], growth_and_complexity: {}, core_values_and_non_negotiables: {}, flow_and_burnout: {}, learning_style: {}, career_affinities: [], work_environment: {} },
  guidance: { primary_career_path: {}, alternative_paths: [], skill_gap_analysis: {}, learning_path: {}, action_plan: {}, work_environment_fit: {}, success_metrics: {} },
  conversation_memory: {
    last_5_exchanges: [],
    phase_summaries: {},
    blocked_topics: [],
    unresolved_topics: [],
  },
};

export const useUserProfileStore = create<UserProfileState>((setStore) => ({
  profile: null,
  isLoading: true,

  loadProfile: async (userId: string) => {
    setStore({ isLoading: true });
    try {
      const storedProfile = await get(`user_profile_${userId}`);
      if (storedProfile) {
        setStore({ profile: storedProfile, isLoading: false });
      } else {
        const newProfile = { ...defaultProfile, user_id: userId };
        await set(`user_profile_${userId}`, newProfile);
        setStore({ profile: newProfile, isLoading: false });
      }
    } catch (error) {
      console.error('Failed to load profile from IndexedDB:', error);
      setStore({ isLoading: false });
    }
  },

  updateProfile: async (userId: string, newProfileData: Partial<UserProfile>) => {
    setStore((state) => {
      const updatedProfile = { ...state.profile, ...newProfileData } as UserProfile;
      // Fire and forget save to IDB
      set(`user_profile_${userId}`, updatedProfile).catch(err => 
        console.error('Failed to save profile to IndexedDB:', err)
      );
      return { profile: updatedProfile };
    });
  },
}));
