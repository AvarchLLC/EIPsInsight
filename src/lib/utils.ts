import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


import { Variants } from "framer-motion";

export function slideInFromLeft(delay: number): Variants {
  return {
    hidden: { x: -100, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { delay, duration: 0.5 } },
  };
}
export function slideInFromRight(delay: number): Variants {
  return {
    hidden: { x: 100, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { delay, duration: 0.5 } },
  };
}
