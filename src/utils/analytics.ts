'use client';

// Check if user has given analytics consent
const hasAnalyticsConsent = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    const consent = localStorage.getItem('eips-insight-cookie-consent');
    if (consent) {
      const preferences = JSON.parse(consent);
      return preferences.analytics === true;
    }
  } catch (error) {
    console.error('Error checking analytics consent:', error);
  }
  return false;
};

// Track page views
export const trackPageView = (url: string, title?: string) => {
  if (!hasAnalyticsConsent()) return;
  
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'page_view', {
      page_title: title || document.title,
      page_location: url,
      page_path: window.location.pathname,
    });
  }
};

// Track custom events
export const trackEvent = (
  eventName: string,
  eventCategory: string,
  eventLabel?: string,
  eventValue?: number
) => {
  if (!hasAnalyticsConsent()) return;
  
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, {
      event_category: eventCategory,
      event_label: eventLabel,
      value: eventValue,
    });
  }
};

// Track search queries
export const trackSearch = (searchTerm: string, resultsCount?: number) => {
  if (!hasAnalyticsConsent()) return;
  
  trackEvent('search', 'Search', searchTerm, resultsCount);
};

// Track feature usage
export const trackFeatureUsage = (featureName: string, action: string) => {
  if (!hasAnalyticsConsent()) return;
  
  trackEvent(action, 'Feature Usage', featureName);
};

// Track EIP/ERC/RIP views
export const trackProposalView = (proposalType: 'EIP' | 'ERC' | 'RIP', proposalNumber: string) => {
  if (!hasAnalyticsConsent()) return;
  
  trackEvent('view_proposal', `${proposalType} View`, `${proposalType}-${proposalNumber}`);
};

// Track dashboard interactions
export const trackDashboardInteraction = (dashboardName: string, interactionType: string) => {
  if (!hasAnalyticsConsent()) return;
  
  trackEvent('dashboard_interaction', 'Dashboard', `${dashboardName} - ${interactionType}`);
};

// Track chart interactions
export const trackChartInteraction = (chartName: string, action: string) => {
  if (!hasAnalyticsConsent()) return;
  
  trackEvent('chart_interaction', 'Charts', `${chartName} - ${action}`);
};

// Track downloads
export const trackDownload = (fileName: string, fileType: string) => {
  if (!hasAnalyticsConsent()) return;
  
  trackEvent('download', 'Downloads', `${fileType} - ${fileName}`);
};

// Track external link clicks
export const trackExternalLink = (url: string, linkText?: string) => {
  if (!hasAnalyticsConsent()) return;
  
  trackEvent('click', 'External Link', linkText || url);
};

// Track time spent on page
export const trackTimeOnPage = (pageName: string, timeInSeconds: number) => {
  if (!hasAnalyticsConsent()) return;
  
  trackEvent('time_on_page', 'Engagement', pageName, timeInSeconds);
};

// Track filter/sort actions
export const trackFilterAction = (filterType: string, filterValue: string) => {
  if (!hasAnalyticsConsent()) return;
  
  trackEvent('filter', 'Filters', `${filterType}: ${filterValue}`);
};

// Track navigation patterns
export const trackNavigation = (from: string, to: string) => {
  if (!hasAnalyticsConsent()) return;
  
  trackEvent('navigation', 'User Journey', `${from} → ${to}`);
};

// Track errors
export const trackError = (errorMessage: string, errorLocation: string) => {
  if (!hasAnalyticsConsent()) return;
  
  trackEvent('error', 'Errors', `${errorLocation}: ${errorMessage}`);
};

// Track user preferences
export const trackPreferenceChange = (preferenceName: string, preferenceValue: string) => {
  if (!hasAnalyticsConsent()) return;
  
  trackEvent('preference_change', 'User Preferences', `${preferenceName}: ${preferenceValue}`);
};

// Track bookmark actions
export const trackBookmark = (action: 'add' | 'remove', itemType: string, itemId: string) => {
  if (!hasAnalyticsConsent()) return;
  
  trackEvent(`bookmark_${action}`, 'Bookmarks', `${itemType}: ${itemId}`);
};

// Track subscription actions
export const trackSubscription = (action: 'subscribe' | 'unsubscribe', email?: string) => {
  if (!hasAnalyticsConsent()) return;
  
  trackEvent(`subscription_${action}`, 'Subscriptions', action);
};

// Track feedback submissions
export const trackFeedback = (feedbackType: 'positive' | 'negative', page?: string) => {
  if (!hasAnalyticsConsent()) return;
  
  trackEvent('feedback', 'User Feedback', `${feedbackType} - ${page || 'unknown'}`);
};

// Track resource views
export const trackResourceView = (resourceType: string, resourceName: string) => {
  if (!hasAnalyticsConsent()) return;
  
  trackEvent('view_resource', 'Resources', `${resourceType}: ${resourceName}`);
};

// Track comparison tool usage
export const trackComparison = (items: string[]) => {
  if (!hasAnalyticsConsent()) return;
  
  trackEvent('compare', 'Comparison Tool', items.join(' vs '));
};

// Track network upgrade views
export const trackNetworkUpgrade = (upgradeName: string, action: string) => {
  if (!hasAnalyticsConsent()) return;
  
  trackEvent('network_upgrade', 'Network Upgrades', `${upgradeName} - ${action}`);
};

// Analytics utility functions
export const analytics = {
  pageView: trackPageView,
  event: trackEvent,
  search: trackSearch,
  feature: trackFeatureUsage,
  proposal: trackProposalView,
  dashboard: trackDashboardInteraction,
  chart: trackChartInteraction,
  download: trackDownload,
  externalLink: trackExternalLink,
  timeOnPage: trackTimeOnPage,
  filter: trackFilterAction,
  navigation: trackNavigation,
  error: trackError,
  preference: trackPreferenceChange,
  bookmark: trackBookmark,
  subscription: trackSubscription,
  feedback: trackFeedback,
  resource: trackResourceView,
  comparison: trackComparison,
  networkUpgrade: trackNetworkUpgrade,
};

export default analytics;