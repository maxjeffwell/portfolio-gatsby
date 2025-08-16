import { useEffect } from 'react';
import scriptWorker from '../utils/scriptWorker';

// Enhanced analytics component with script worker support
const Analytics = () => {
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    // Initialize analytics with script worker
    const initAnalytics = async () => {
      try {
        // Initialize dataLayer first
        window.dataLayer = window.dataLayer || [];
        
        // Configure gtag function for worker communication
        window.gtag = function(...args) {
          // Ensure dataLayer exists before pushing
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push(arguments);
          
          // Use script worker for better performance (fallback)
          try {
            scriptWorker.executeFunction('gtag', args);
          } catch (error) {
            // Silently handle worker errors
          }
        };

        // Load Google Analytics script through worker when possible
        const gtagUrl = 'https://www.googletagmanager.com/gtag/js?id=G-NL37L9SVQ0';
        
        try {
          await scriptWorker.loadScript(gtagUrl, { defer: true });
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('Script worker failed, falling back to main thread:', error);
          }
          // Fallback to regular script loading
          loadAnalyticsMainThread();
        }

        // Configure gtag
        window.gtag('js', new Date());
        window.gtag('config', 'G-NL37L9SVQ0', {
          page_title: document.title,
          page_location: window.location.href,
          send_page_view: true,
          anonymize_ip: true,
          cookie_expires: 0,
        });

        // Track web vitals for performance monitoring
        try {
          import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
            getCLS(sendToAnalytics);
            getFID(sendToAnalytics);
            getFCP(sendToAnalytics);
            getLCP(sendToAnalytics);
            getTTFB(sendToAnalytics);
          }).catch(() => {
            // Silently fail if web-vitals is not available
          });
        } catch (error) {
          // Silently fail if dynamic import is not supported
        }

      } catch (error) {
        console.warn('Analytics initialization failed:', error);
      }
    };

    // Delay initialization to avoid blocking critical resources
    const timeoutId = setTimeout(initAnalytics, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return null; // This component doesn't render anything
};

// Fallback function for main thread loading
const loadAnalyticsMainThread = () => {
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-NL37L9SVQ0';
  
  // Use requestIdleCallback for better performance
  const appendScript = () => {
    document.head.appendChild(script);
  };

  if (typeof requestIdleCallback !== 'undefined') {
    requestIdleCallback(appendScript, { timeout: 2000 });
  } else {
    setTimeout(appendScript, 100);
  }
};

// Helper function to send web vitals to analytics
const sendToAnalytics = (metric) => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true,
    });
  }
};

// Custom hook for manual page tracking
export const usePageTracking = () => {
  const trackPageView = (path, title) => {
    if (typeof window.gtag === 'function') {
      window.gtag('config', 'G-NL37L9SVQ0', {
        page_path: path,
        page_title: title,
        page_location: window.location.origin + path,
      });
    }
  };

  const trackEvent = (action, category, label, value) => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
        non_interaction: false,
      });
    }
  };

  return { trackPageView, trackEvent };
};

export default Analytics;