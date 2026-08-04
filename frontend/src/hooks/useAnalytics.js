import { useCallback } from 'react';

export const useAnalytics = () => {
  const trackEvent = useCallback((eventName, eventData = {}) => {
    const payload = {
      event: eventName,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      data: eventData,
    };

    // Log event to console in development
    console.log('[NexusMart Analytics Logger]:', payload);

    // Store recent analytics session events in localStorage
    try {
      const saved = JSON.parse(localStorage.getItem('nexus_analytics_events') || '[]');
      const updated = [payload, ...saved].slice(0, 30);
      localStorage.setItem('nexus_analytics_events', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to log event', e);
    }
  }, []);

  return { trackEvent };
};
