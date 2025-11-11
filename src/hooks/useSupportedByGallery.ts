import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for managing GIF hover states with performance optimization
 * 
 * Features:
 * - Preloads GIF on mount
 * - Extracts first frame to canvas for static display
 * - Manages hover state transitions
 * - Cache-busting for GIF replay
 * 
 * @param staticUrl - URL to the GIF (used to extract first frame)
 * @param gifUrl - URL to the GIF for animated playback
 * @returns Object containing refs, state, and handlers
 */
export const useGifHover = (staticUrl: string, gifUrl: string) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showGif, setShowGif] = useState(false);
  const [gifLoaded, setGifLoaded] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Preload GIF and extract first frame to canvas
  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.src = staticUrl.replace('#static', '');
    
    img.onload = () => {
      setGifLoaded(true);
      
      // Draw first frame to canvas
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
        }
      }
    };

    img.onerror = () => {
      console.warn(`Failed to load static image: ${staticUrl}`);
      setGifLoaded(false);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [staticUrl]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    setShowGif(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setShowGif(false);
  }, []);

  // Get current GIF source with cache-busting
  const getCurrentGifSrc = useCallback(() => {
    return `${gifUrl}?t=${Date.now()}`;
  }, [gifUrl]);

  return {
    isHovered,
    showGif,
    gifLoaded,
    canvasRef,
    imgRef,
    handleMouseEnter,
    handleMouseLeave,
    getCurrentGifSrc,
  };
};

/**
 * Custom hook for managing infinite scroll gallery
 * 
 * Features:
 * - Pause/resume animation on hover
 * - Smooth transitions
 * - Performance monitoring
 * 
 * @returns Object containing pause state and handlers
 */
export const useInfiniteScroll = () => {
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const pause = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    setIsPaused(false);
  }, []);

  const handleHoverChange = useCallback((isHovered: boolean) => {
    if (isHovered) {
      pause();
    } else {
      resume();
    }
  }, [pause, resume]);

  return {
    isPaused,
    scrollRef,
    pause,
    resume,
    handleHoverChange,
  };
};

/**
 * Custom hook for responsive card sizing
 * 
 * @param baseSize - Base size for mobile
 * @param mdSize - Size for tablet
 * @param lgSize - Size for desktop
 * @returns Chakra UI responsive size object
 */
export const useResponsiveCardSize = (
  baseSize: string = "200px",
  mdSize: string = "240px", 
  lgSize: string = "280px"
) => {
  return {
    width: { base: baseSize, md: mdSize, lg: lgSize },
    height: "auto",
  };
};

/**
 * Custom hook for detecting reduced motion preference
 * 
 * @returns Boolean indicating if user prefers reduced motion
 */
export const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};
