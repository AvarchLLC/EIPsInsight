// stores/userStore.ts
import { create } from 'zustand';

type UserData = {
  id: string;
  name: string;
  email: string;
  image?: string;
  tier: string;
  walletAddress?: string;
};

type UserStore = {
  user: UserData | null;
  setUser: (user: UserData) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));

