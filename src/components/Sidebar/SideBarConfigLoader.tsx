"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useSidebar } from "./SideBarContext";
import { sidebarConfig } from "./slidebarConfig";

export default function SidebarConfigLoader() {
  const pathname = usePathname();
  const { setActivePath } = useSidebar();

  useEffect(() => {
    const firstSegment = "/" + pathname?.split("/")[1];
    if (firstSegment in sidebarConfig) {
      setActivePath(firstSegment);
    }
  }, [pathname, setActivePath]);

  return null;
}
