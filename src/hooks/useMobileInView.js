import { inView } from 'motion';
import { useState, useEffect, useRef } from 'react';

/**
 * Mobile-friendly useInView hook with fallback for devices where
 * Motion's useInView might not work properly
 */
function useMobileInView(targetRef, options = {}) {
  const [isMobile, setIsMobile] = useState(false);
  const [isInViewFallback, setIsInViewFallback] = useState(false);
  
  // Use Motion's inView for non-mobile
  const [isInViewMotion, setIsInViewMotion] = useState(false);
  
  // Debug logging for development
  const isDebug = process.env.NODE_ENV === 'development';
  
  const debugLog = (message, data = {}) => {
    if (isDebug && typeof console !== 'undefined') {
      console.log(`[useMobileInView] ${message}`, data);
    }
  };
  
  useEffect(() => {
    if (isMobile || !targetRef.current) return;
    
    const element = targetRef.current;
    const stop = inView(element, () => {
      setIsInViewMotion(true);
    }, {
      margin: "100px",
      amount: 0.1,
      ...options
    });
    
    return stop;
  }, [targetRef, isMobile, options]);

  // Detect mobile device
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkMobile = () => {
        // More comprehensive mobile detection
        const userAgent = navigator.userAgent || navigator.vendor || window.opera || '';
        const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|phone|tablet/i.test(userAgent.toLowerCase());
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
        const isSmallScreen = window.innerWidth <= 1024; // Increased threshold to include tablets
        
        // Check for iOS devices more specifically
        const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
        
        // Check for Android devices
        const isAndroid = /Android/.test(userAgent);
        
        // Use a more inclusive approach - if any mobile indicator is present, use mobile fallback
        return isMobileUA || isIOS || isAndroid || (isTouchDevice && isSmallScreen);
      };
      
      const isMobileDevice = checkMobile();
      setIsMobile(isMobileDevice);
      debugLog('Mobile detection result', { 
        isMobile: isMobileDevice, 
        userAgent: userAgent.substring(0, 100),
        windowWidth: window.innerWidth,
        touchSupport: 'ontouchstart' in window
      });
      
      // Add resize listener to handle orientation changes
      const handleResize = () => {
        const newMobileState = checkMobile();
        setIsMobile(newMobileState);
        debugLog('Mobile state changed on resize', { isMobile: newMobileState });
      };
      
      window.addEventListener('resize', handleResize);
      window.addEventListener('orientationchange', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('orientationchange', handleResize);
      };
    }
  }, []);

  // Fallback Intersection Observer for mobile
  useEffect(() => {
    if (!isMobile || !targetRef.current) return;

    const target = targetRef.current;
    
    // Ensure IntersectionObserver is supported
    if (!window.IntersectionObserver) {
      // Fallback to always visible if IntersectionObserver not supported
      setIsInViewFallback(true);
      return;
    }
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // More aggressive detection for mobile - consider partially visible as "in view"
          // Use both isIntersecting and intersectionRatio for better compatibility
          const isVisible = entry.isIntersecting || entry.intersectionRatio > 0 || entry.boundingClientRect.top < window.innerHeight;
          debugLog('IntersectionObserver callback', {
            isIntersecting: entry.isIntersecting,
            intersectionRatio: entry.intersectionRatio,
            boundingClientRect: entry.boundingClientRect,
            isVisible
          });
          setIsInViewFallback(isVisible);
        });
      },
      {
        root: null,
        rootMargin: '200px 0px', // Larger margin for mobile to trigger earlier
        threshold: [0, 0.001, 0.01, 0.1] // Simplified thresholds for better mobile performance
      }
    );

    // Small delay to ensure element is properly mounted
    const timeoutId = setTimeout(() => {
      if (target && observer) {
        observer.observe(target);
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (observer) {
        observer.disconnect();
      }
    };
  }, [isMobile, targetRef]);

  // Additional scroll listener for very problematic mobile devices
  useEffect(() => {
    if (!isMobile || !targetRef.current) return;

    const checkVisibility = () => {
      if (!targetRef.current) return;
      
      const rect = targetRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const windowWidth = window.innerWidth || document.documentElement.clientWidth;
      
      // Element is considered visible if any part is in viewport plus generous margin
      const isVisible = (
        rect.bottom >= -200 && // 200px before entering viewport
        rect.right >= 0 &&
        rect.top <= windowHeight + 200 && // 200px after leaving viewport
        rect.left <= windowWidth
      );
      
      debugLog('Scroll visibility check', {
        rect,
        windowHeight,
        isVisible,
        elementTop: rect.top,
        elementBottom: rect.bottom
      });
      
      // Only update if it becomes visible (prevents flickering)
      if (isVisible && !isInViewFallback) {
        setIsInViewFallback(isVisible);
      }
    };

    // Check on scroll with throttling
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          checkVisibility();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Check immediately and on scroll/resize
    checkVisibility();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', checkVisibility, { passive: true });
    window.addEventListener('orientationchange', checkVisibility, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkVisibility);
      window.removeEventListener('orientationchange', checkVisibility);
    };
  }, [isMobile]);

  // Return Motion's result for desktop, fallback for mobile
  const result = isMobile ? isInViewFallback : isInViewMotion;
  
  // Log final result for debugging
  debugLog('Final inView result', { 
    isMobile, 
    isInViewFallback, 
    isInViewMotion, 
    result 
  });
  
  return result;
}

export default useMobileInView;