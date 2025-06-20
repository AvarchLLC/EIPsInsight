'use client';

import { useEffect } from 'react';

export function ScrollToHashOnLoad() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hash = window.location.hash;

    if (hash) {
      // Wait for DOM to render
      requestAnimationFrame(() => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }
  }, []);

  return null;
}
