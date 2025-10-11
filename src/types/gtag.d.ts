declare global {
  interface Window {
    gtag: (
      command: 'consent' | 'config' | 'event' | 'set' | 'get',
      target: string | { [key: string]: any },
      config?: {
        analytics_storage?: 'granted' | 'denied';
        ad_storage?: 'granted' | 'denied';
        wait_for_update?: number;
        page_title?: string;
        page_location?: string;
        [key: string]: any;
      } | string
    ) => void;
  }
}

export {};