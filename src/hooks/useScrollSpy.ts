import { useSidebarStore } from "@/stores/useSidebarStore";
import { useEffect } from "react";

export const useScrollSpy = (sectionIds: string[]) => {
  const setActiveSection = useSidebarStore((s) => s.setActiveSection);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 120; // Offset for sticky headers, etc.

      let currentSection: string | null = null;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPos) {
          currentSection = id;
        }
      }

      setActiveSection(currentSection ?? "");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Run once on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionIds, setActiveSection]);
};
