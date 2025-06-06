import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SidebarState {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  setCollapse: (val: boolean) => void;

  activeSection: string | null;
  setActiveSection: (id: string) => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isCollapsed: false,
      toggleCollapse: () =>
        set((state) => ({ isCollapsed: !state.isCollapsed })),
      setCollapse: (val) => set({ isCollapsed: val }),

      // ScrollSpy state (not persisted)
      activeSection: null,
      setActiveSection: (id: string) => set({ activeSection: id }),
    }),
    {
      name: "sidebar-storage",
      partialize: (state) => ({
        isCollapsed: state.isCollapsed,
      }),
      storage: {
        getItem: (name) => {
          const item = localStorage.getItem(name);
          return item ? JSON.parse(item) : null;
        },
        setItem: (name, value) =>
          localStorage.setItem(name, JSON.stringify(value)),
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
