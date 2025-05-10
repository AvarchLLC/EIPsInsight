'use client';
import React, { createContext, useContext, useState } from 'react';

export interface SidebarItem {
  label: string;
  icon: React.ElementType;
  id: string;
}

const SidebarContext = createContext<{
  isCollapsed: boolean;
  toggleSidebar: () => void;
  sections: SidebarItem[];
  setSections: (items: SidebarItem[]) => void;
}>({
  isCollapsed: false,
  toggleSidebar: () => {},
  sections: [],
  setSections: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sections, setSections] = useState<SidebarItem[]>([]);

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleSidebar, sections, setSections }}>
      {children}
    </SidebarContext.Provider>
  );
};
