// Performance monitoring utilities for image loading

export class ImagePerformanceMonitor {
  constructor() {
    this.metrics = {
      webpSupport: false,
      avifSupport: false,
      loadTimes: [],
      formatUsage: {
        webp: 0,
        avif: 0,
        fallback: 0,
      },
      totalImages: 0,
      failedImages: 0,
    };

    this.init();
  }

  init() {
    if (typeof window === 'undefined') return;

    // Detect format support
    this.detectFormatSupport();

    // Track Core Web Vitals
    this.trackCoreWebVitals();
  }

  detectFormatSupport() {
    // WebP detection
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    this.metrics.webpSupport = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;

    // AVIF detection (async)
    this.detectAVIFSupport();
  }

  async detectAVIFSupport() {
    try {
      const avif = new Image();
      const promise = new Promise((resolve) => {
        avif.onload = () => resolve(true);
        avif.onerror = () => resolve(false);
      });
      avif.src =
        'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';

      this.metrics.avifSupport = await promise;
    } catch (error) {
      this.metrics.avifSupport = false;
    }
  }

  trackImageLoad(format, loadTime, success = true) {
    this.metrics.totalImages++;

    if (success) {
      this.metrics.loadTimes.push({
        format,
        time: loadTime,
        timestamp: Date.now(),
      });

      if (this.metrics.formatUsage[format] !== undefined) {
        this.metrics.formatUsage[format]++;
      } else {
        this.metrics.formatUsage.fallback++;
      }
    } else {
      this.metrics.failedImages++;
    }
  }

  trackCoreWebVitals() {
    if (typeof window === 'undefined' || !window.PerformanceObserver) return;

    // Largest Contentful Paint
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];

        this.metrics.lcp = {
          value: lastEntry.startTime,
          element: lastEntry.element?.tagName || 'unknown',
        };
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (error) {
      console.warn('LCP monitoring not supported');
    }

    // Cumulative Layout Shift
    try {
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        this.metrics.cls = clsValue;
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    } catch (error) {
      console.warn('CLS monitoring not supported');
    }
  }

  getMetrics() {
    const avgLoadTime =
      this.metrics.loadTimes.length > 0
        ? this.metrics.loadTimes.reduce((sum, item) => sum + item.time, 0) /
          this.metrics.loadTimes.length
        : 0;

    return {
      ...this.metrics,
      averageLoadTime: avgLoadTime,
      successRate:
        this.metrics.totalImages > 0
          ? ((this.metrics.totalImages - this.metrics.failedImages) / this.metrics.totalImages) *
            100
          : 0,
      webpUsageRate:
        this.metrics.totalImages > 0
          ? (this.metrics.formatUsage.webp / this.metrics.totalImages) * 100
          : 0,
      avifUsageRate:
        this.metrics.totalImages > 0
          ? (this.metrics.formatUsage.avif / this.metrics.totalImages) * 100
          : 0,
    };
  }

  logReport() {
    if (process.env.NODE_ENV === 'development') {
      console.group('📊 Image Performance Report');
      console.table(this.getMetrics());
      console.groupEnd();
    }
  }

  // Hook for Google Analytics or other analytics services
  sendToAnalytics() {
    const metrics = this.getMetrics();

    // Example: Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', 'image_performance', {
        webp_support: metrics.webpSupport,
        avif_support: metrics.avifSupport,
        average_load_time: metrics.averageLoadTime,
        success_rate: metrics.successRate,
        webp_usage_rate: metrics.webpUsageRate,
        avif_usage_rate: metrics.avifUsageRate,
      });
    }

    return metrics;
  }
}

// Singleton instance
export const imageMonitor = new ImagePerformanceMonitor();

// React hook for easy component integration
export const useImagePerformance = () => {
  const trackImageLoad = (format, loadTime, success = true) => {
    imageMonitor.trackImageLoad(format, loadTime, success);
  };

  const getMetrics = () => imageMonitor.getMetrics();

  const logReport = () => imageMonitor.logReport();

  return {
    trackImageLoad,
    getMetrics,
    logReport,
  };
};
