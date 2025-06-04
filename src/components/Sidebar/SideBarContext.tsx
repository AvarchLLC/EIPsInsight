"use client";
import React, { createContext, useContext, useState } from "react";
import { sidebarConfig } from "./slidebarConfig";

export interface SidebarItem {
  label: string;
  icon: React.ElementType;
  id: string;
}

type SidebarConfig = Record<string, SidebarItem[]>;

const SidebarContext = createContext<{
  isCollapsed: boolean;
  toggleSidebar: () => void;
  config: SidebarConfig;
  activePath: string;
  setActivePath: (path: string) => void;
}>({
  isCollapsed: false,
  toggleSidebar: () => {},
  config: {},
  activePath: "/eips",
  setActivePath: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

export const SidebarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // const [isCollapsed, setIsCollapsed] = useState(false);
  const [activePath, setActivePath] = useState("/eips"); // default
  const [config] = useState<SidebarConfig>(sidebarConfig); // constant

  // const toggleSidebar = () => setIsCollapsed((prev) => !prev);
  const { isCollapsed, toggleSidebar } = useSidebar();
  return (
    <SidebarContext.Provider
      value={{ isCollapsed, toggleSidebar, config, activePath, setActivePath }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
