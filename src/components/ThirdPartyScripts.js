import { useEffect, useState } from 'react';

const ThirdPartyScripts = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set client flag
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Only run client-side
    if (!isClient || typeof window === 'undefined') return;

    // Google Analytics
    if (process.env.GATSBY_GA_TRACKING_ID) {
      // Load GA script
      const gaScript = document.createElement('script');
      gaScript.async = true;
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.GATSBY_GA_TRACKING_ID}`;
      document.head.appendChild(gaScript);

      // Configure GA
      window.dataLayer = window.dataLayer || [];
      const gtag = (...args) => {
        window.dataLayer.push(args);
      };
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', process.env.GATSBY_GA_TRACKING_ID, {
        page_title: document.title,
        page_location: window.location?.href || '',
      });

      // Track scroll depth for SEO insights
      let maxScroll = 0;
      const trackScrollDepth = () => {
        const scrollPercent = Math.round(
          (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
        );

        if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
          maxScroll = scrollPercent;
          gtag('event', 'scroll_depth', {
            event_category: 'SEO',
            event_label: `${scrollPercent}%`,
            value: scrollPercent,
            non_interaction: true,
          });
        }
      };

      window.addEventListener('scroll', trackScrollDepth);
    }

    // Hotjar — vendor snippet, disable lint rules for it
    if (process.env.GATSBY_HOTJAR_ID) {
      /* eslint-disable no-inner-declarations, prefer-rest-params, radix, prefer-destructuring, no-param-reassign */
      (function (h, o, t, j, a, r) {
        h.hj =
          h.hj ||
          function () {
            (h.hj.q = h.hj.q || []).push(arguments);
          };
        h._hjSettings = { hjid: parseInt(process.env.GATSBY_HOTJAR_ID), hjsv: 6 };
        a = o.getElementsByTagName('head')[0];
        r = o.createElement('script');
        r.async = 1;
        r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
        a.appendChild(r);
      })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
      /* eslint-enable no-inner-declarations, prefer-rest-params, radix, prefer-destructuring, no-param-reassign */
    }

    // Plausible Analytics
    if (process.env.GATSBY_PLAUSIBLE_DOMAIN) {
      const plausibleScript = document.createElement('script');
      plausibleScript.defer = true;
      plausibleScript.src = 'https://plausible.io/js/script.js';
      plausibleScript.setAttribute('data-domain', process.env.GATSBY_PLAUSIBLE_DOMAIN);
      document.head.appendChild(plausibleScript);
    }

    // Basic performance monitoring
    const performanceMonitor = () => {
      if ('performance' in window) {
        window.addEventListener('load', () => {
          const perfData = window.performance.timing;
          const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;

          if (pageLoadTime > 0) {
            console.log('Page Load Time:', `${pageLoadTime}ms`);

            // Send to Google Analytics if available
            if (typeof window.gtag !== 'undefined') {
              window.gtag('event', 'page_load_time', {
                event_category: 'Performance',
                value: pageLoadTime,
                non_interaction: true,
              });
            }
          }
        });
      }
    };

    performanceMonitor();

    // Development-only scripts
    if (process.env.NODE_ENV === 'development') {
      console.log('Portfolio development mode active');

      window.addEventListener('load', () => {
        const { timing } = window.performance;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        console.log('Page load time:', `${loadTime}ms`);
      });
    }
  }, [isClient]);

  // Return null since all scripts are loaded via useEffect
  return null;
};

export default ThirdPartyScripts;
