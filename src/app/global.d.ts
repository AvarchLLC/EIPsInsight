// global.d.ts
export {};

declare global {
  interface Window {
    /**
     * Google Tag Manager gtag function.
     * Accepts a variable number of arguments.
     */
    gtag: (...args: any[]) => void;
  }

  /**
   * Google Tag Manager Data Layer.
   */
  const dataLayer: Record<string, any>[];
}
