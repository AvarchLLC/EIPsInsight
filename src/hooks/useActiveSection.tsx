import { useEffect, useState } from 'react';

export const useActiveSection = () => {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const sections = Array.from(document.querySelectorAll('section[id]'));
      const scrollPosition = window.scrollY + 100; // Add offset for better readability
      let currentId: string | null = null;

      sections.forEach((section) => {
        if (section instanceof HTMLElement) {
          const offsetTop = section.offsetTop;
          const offsetHeight = section.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            currentId = section.getAttribute('id');
          }
        }
      });

      setActiveId(currentId);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return activeId;
};
