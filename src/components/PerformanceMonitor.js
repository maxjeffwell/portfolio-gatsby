import { useEffect } from 'react';

const PerformanceMonitor = () => {
  useEffect(() => {
    // Only run in production and if performance API is available
    if (process.env.NODE_ENV !== 'production' || typeof window === 'undefined' || !window.performance) {
      return;
    }

    const reportPerformanceMetrics = () => {
      // Core Web Vitals monitoring
      const reportMetric = (metric) => {
        // In a real app, you'd send this to your analytics service
        console.log(`Performance metric: ${metric.name}`, metric.value);
        
        // Optional: Send to Google Analytics or other analytics service
        if (typeof gtag !== 'undefined') {
          gtag('event', metric.name, {
            event_category: 'Web Vitals',
            value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
            event_label: metric.id,
            non_interaction: true,
          });
        }
      };

      // Monitor Core Web Vitals
      if ('PerformanceObserver' in window) {
        // Largest Contentful Paint (LCP)
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          
          reportMetric({
            name: 'LCP',
            value: lastEntry.startTime,
            id: `${lastEntry.startTime}-${Math.random()}`,
          });
        });

        // First Input Delay (FID)
        const fidObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            reportMetric({
              name: 'FID',
              value: entry.processingStart - entry.startTime,
              id: `${entry.startTime}-${Math.random()}`,
            });
          }
        });

        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
          
          reportMetric({
            name: 'CLS',
            value: clsValue,
            id: `${Date.now()}-${Math.random()}`,
          });
        });

        // Time to First Byte (TTFB)
        const ttfbObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (entry.entryType === 'navigation') {
              reportMetric({
                name: 'TTFB',
                value: entry.responseStart - entry.requestStart,
                id: `${entry.startTime}-${Math.random()}`,
              });
            }
          }
        });

        try {
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
          fidObserver.observe({ entryTypes: ['first-input'] });
          clsObserver.observe({ entryTypes: ['layout-shift'] });
          ttfbObserver.observe({ entryTypes: ['navigation'] });
        } catch (error) {
          // Some browsers might not support all entry types
          console.warn('Performance monitoring setup error:', error);
        }

        // Clean up observers on unmount
        return () => {
          lcpObserver.disconnect();
          fidObserver.disconnect();
          clsObserver.disconnect();
          ttfbObserver.disconnect();
        };
      }

      // Fallback for older browsers - basic timing metrics
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType('navigation')[0];
          if (navigation) {
            reportMetric({
              name: 'Page Load Time',
              value: navigation.loadEventEnd - navigation.fetchStart,
              id: `page-load-${Date.now()}`,
            });

            reportMetric({
              name: 'DOM Content Loaded',
              value: navigation.domContentLoadedEventEnd - navigation.fetchStart,
              id: `dcl-${Date.now()}`,
            });
          }
        }, 0);
      });
    };

    // Monitor resource loading performance
    const monitorResourcePerformance = () => {
      const resourceObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          // Monitor slow loading resources
          if (entry.duration > 1000) {
            console.warn(`Slow resource detected: ${entry.name} took ${entry.duration}ms`);
          }
          
          // Monitor large resources
          if (entry.transferSize > 100000) { // 100KB
            console.warn(`Large resource detected: ${entry.name} is ${entry.transferSize} bytes`);
          }
        }
      });

      try {
        resourceObserver.observe({ entryTypes: ['resource'] });
        return () => resourceObserver.disconnect();
      } catch (error) {
        console.warn('Resource performance monitoring setup error:', error);
      }
    };

    // Monitor memory usage (Chrome only)
    const monitorMemoryUsage = () => {
      if ('memory' in performance) {
        const logMemoryUsage = () => {
          const memory = performance.memory;
          console.log('Memory usage:', {
            used: `${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`,
            total: `${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB`,
            limit: `${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`,
          });
        };

        // Log memory usage every 30 seconds
        const memoryInterval = setInterval(logMemoryUsage, 30000);
        
        return () => clearInterval(memoryInterval);
      }
    };

    // Monitor long tasks
    const monitorLongTasks = () => {
      if ('PerformanceObserver' in window) {
        const longTaskObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            console.warn(`Long task detected: ${entry.duration}ms`);
            
            reportMetric({
              name: 'Long Task',
              value: entry.duration,
              id: `long-task-${entry.startTime}`,
            });
          }
        });

        try {
          longTaskObserver.observe({ entryTypes: ['longtask'] });
          return () => longTaskObserver.disconnect();
        } catch (error) {
          console.warn('Long task monitoring setup error:', error);
        }
      }
    };

    // Initialize all monitoring
    const cleanupFunctions = [
      reportPerformanceMetrics(),
      monitorResourcePerformance(),
      monitorMemoryUsage(),
      monitorLongTasks(),
    ].filter(Boolean);

    // Cleanup function
    return () => {
      cleanupFunctions.forEach(cleanup => cleanup?.());
    };
  }, []);

  return null; // This component doesn't render anything
};

export default PerformanceMonitor;