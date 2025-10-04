// stores/userStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type UserRole = 'admin' | 'moderator' | 'premium_user' | 'user';
export type UserTier = 'Free' | 'Pro' | 'Premium' | 'Enterprise';

export interface UserPermissions {
  canCreateBlogs: boolean;
  canModerateContent: boolean;
  canAccessAnalytics: boolean;
  canManageUsers: boolean;
  canAccessFeedbackDashboard: boolean;
  maxBlogsPerMonth: number;
  canUseAI: boolean;
  canExportData: boolean;
}

export interface UserProfile {
  bio?: string;
  website?: string;
  twitter?: string;
  github?: string;
  linkedin?: string;
  location?: string;
  company?: string;
  isPublic: boolean;
  joinedAt: Date;
  lastActive: Date;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  image?: string;
  tier: UserTier;
  role: UserRole;
  walletAddress?: string;
  permissions: UserPermissions;
  profile: UserProfile;
  stats: {
    blogsCreated: number;
    feedbackGiven: number;
    lastLogin: Date;
  };
  settings: {
    emailNotifications: boolean;
    theme: 'light' | 'dark' | 'system';
    language: string;
  };
  isVerified: boolean;
  isActive: boolean;
}

export interface UserStore {
  user: UserData | null;
  isLoading: boolean;
  isInitialized: boolean;
  setUser: (user: UserData) => void;
  updateUser: (updates: Partial<UserData>) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  syncWithSession: (sessionUser: any) => void;
  // Permission helpers
  canPerform: (action: keyof UserPermissions) => boolean;
  isAdmin: () => boolean;
  isModerator: () => boolean;
  isPremium: () => boolean;
}

// Default permissions based on role
const getDefaultPermissions = (role: UserRole, tier: UserTier): UserPermissions => {
  const basePermissions: UserPermissions = {
    canCreateBlogs: false,
    canModerateContent: false,
    canAccessAnalytics: false,
    canManageUsers: false,
    canAccessFeedbackDashboard: false,
    maxBlogsPerMonth: 0,
    canUseAI: false,
    canExportData: false,
  };

  switch (role) {
    case 'admin':
      return {
        canCreateBlogs: true,
        canModerateContent: true,
        canAccessAnalytics: true,
        canManageUsers: true,
        canAccessFeedbackDashboard: true,
        maxBlogsPerMonth: -1, // Unlimited
        canUseAI: true,
        canExportData: true,
      };
    case 'moderator':
      return {
        ...basePermissions,
        canCreateBlogs: true,
        canModerateContent: true,
        canAccessAnalytics: true,
        canAccessFeedbackDashboard: true,
        maxBlogsPerMonth: 50,
        canUseAI: true,
        canExportData: true,
      };
    case 'premium_user':
      return {
        ...basePermissions,
        canCreateBlogs: true,
        maxBlogsPerMonth: tier === 'Enterprise' ? 100 : tier === 'Premium' ? 20 : 10,
        canUseAI: true,
        canExportData: true,
      };
    case 'user':
    default:
      return {
        ...basePermissions,
        canCreateBlogs: tier !== 'Free',
        maxBlogsPerMonth: tier === 'Pro' ? 5 : tier === 'Premium' ? 15 : tier === 'Enterprise' ? 50 : 0,
        canUseAI: tier !== 'Free',
        canExportData: tier !== 'Free',
      };
  }
};

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isInitialized: false,

      setUser: (user: UserData) => {
        set({ 
          user: {
            ...user,
            permissions: getDefaultPermissions(user.role, user.tier),
          },
          isLoading: false,
          isInitialized: true 
        });
      },

      updateUser: (updates: Partial<UserData>) => {
        const currentUser = get().user;
        if (!currentUser) return;

        const updatedUser = { ...currentUser, ...updates };
        
        // Recalculate permissions if role or tier changed
        if (updates.role || updates.tier) {
          updatedUser.permissions = getDefaultPermissions(
            updatedUser.role, 
            updatedUser.tier
          );
        }

        set({ user: updatedUser });
      },

      clearUser: () => {
        set({ 
          user: null, 
          isLoading: false, 
          isInitialized: true 
        });
      },

      syncWithSession: (sessionUser: any) => {
        if (!sessionUser) {
          get().clearUser();
          return;
        }

        const userData: UserData = {
          id: sessionUser.id,
          name: sessionUser.name || '',
          email: sessionUser.email || '',
          image: sessionUser.image,
          role: sessionUser.role || 'user',
          tier: sessionUser.tier || 'Free',
          walletAddress: sessionUser.walletAddress,
          permissions: getDefaultPermissions(sessionUser.role || 'user', sessionUser.tier || 'Free'),
          profile: sessionUser.profile || {
            bio: '',
            website: '',
            twitter: '',
            github: '',
            linkedin: '',
            location: '',
            company: '',
            isPublic: false,
            joinedAt: new Date(),
            lastActive: new Date()
          },
          stats: sessionUser.stats || {
            blogsCreated: 0,
            feedbackGiven: 0,
            lastLogin: new Date()
          },
          settings: sessionUser.settings || {
            emailNotifications: true,
            theme: 'system' as const,
            language: 'en'
          },
          isVerified: sessionUser.isVerified || false,
          isActive: sessionUser.isActive !== false
        };

        set({ 
          user: userData,
          isLoading: false,
          isInitialized: true 
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setInitialized: (initialized: boolean) => {
        set({ isInitialized: initialized });
      },

      // Permission helpers
      canPerform: (action: keyof UserPermissions) => {
        const user = get().user;
        if (!user || !user.isActive) return false;
        return user.permissions[action] as boolean;
      },

      isAdmin: () => {
        const user = get().user;
        return user?.role === 'admin' && user?.isActive;
      },

      isModerator: () => {
        const user = get().user;
        return (user?.role === 'admin' || user?.role === 'moderator') && user?.isActive;
      },

      isPremium: () => {
        const user = get().user;
        return (user?.tier !== 'Free' && user?.isActive) || false;
      },
    }),
    {
      name: 'eips-insight-user-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user,
        isInitialized: state.isInitialized 
      }),
    }
  )
);

