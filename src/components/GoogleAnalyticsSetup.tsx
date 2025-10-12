'use client';

import { useEffect } from 'react';

const GoogleAnalyticsSetup = () => {
  useEffect(() => {
    // Initialize with denied consent by default (EU compliance)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'default', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        wait_for_update: 500,
      });

      // Check for existing consent
      const consent = localStorage.getItem('eips-insight-cookie-consent');
      if (consent) {
        try {
          const preferences = JSON.parse(consent);
          (window as any).gtag('consent', 'update', {
            analytics_storage: preferences.analytics ? 'granted' : 'denied'
          });
        } catch (error) {
          console.error('Error parsing cookie preferences:', error);
        }
      }
    }
  }, []);

  return null;
};

export default GoogleAnalyticsSetup;