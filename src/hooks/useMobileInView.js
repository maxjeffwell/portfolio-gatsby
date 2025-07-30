import { useInView } from 'motion/react';
import { useState, useEffect, useRef } from 'react';

/**
 * Mobile-friendly useInView hook with fallback for devices where
 * Motion's useInView might not work properly
 */
function useMobileInView(targetRef, options = {}) {
  const [isMobile, setIsMobile] = useState(false);
  const [isInViewFallback, setIsInViewFallback] = useState(false);
  
  // Use Motion's useInView
  const isInViewMotion = useInView(targetRef, {
    margin: "100px",
    amount: 0.1,
    root: null,
    threshold: [0, 0.1, 0.5, 1],
    ...options
  });

  // Detect mobile device
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkMobile = () => {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const isMobileDevice = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const isSmallScreen = window.innerWidth <= 768;
        
        return isMobileDevice || (isTouchDevice && isSmallScreen);
      };
      
      setIsMobile(checkMobile());
    }
  }, []);

  // Fallback Intersection Observer for mobile
  useEffect(() => {
    if (!isMobile || !targetRef.current) return;

    const target = targetRef.current;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        // More aggressive detection for mobile - consider partially visible as "in view"
        const isVisible = entry.isIntersecting || entry.intersectionRatio > 0;
        setIsInViewFallback(isVisible);
      },
      {
        root: null,
        rootMargin: '150px', // Larger margin for mobile to trigger earlier
        threshold: [0, 0.01, 0.1, 0.25, 0.5, 0.75, 1.0] // Include very small threshold
      }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
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
        rect.bottom >= -150 && // 150px before entering viewport
        rect.right >= 0 &&
        rect.top <= windowHeight + 150 && // 150px after leaving viewport
        rect.left <= windowWidth
      );
      
      setIsInViewFallback(isVisible);
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
  return isMobile ? isInViewFallback : isInViewMotion;
}

export default useMobileInView;