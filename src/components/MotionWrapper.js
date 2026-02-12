import React, { useEffect, useRef } from 'react';

// Module-level state: persists across component instances within the same client session.
let animateFn = null;
// Track initial hydration at the page level. Set to false only AFTER the motion library
// finishes loading (async), so ALL synchronous MotionWrapper mounts during hydration
// see true and skip animation.
let initialHydrationComplete = false;

const MotionWrapper = ({
  children,
  initial, // eslint-disable-line no-unused-vars -- destructure to prevent HTML attr leak
  animate: animateTarget,
  transition,
  ...props
}) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!initialHydrationComplete) {
      // Initial page load: preload motion, mark hydration complete only after import resolves.
      // All MotionWrapper effects run synchronously during hydration, so they all see
      // initialHydrationComplete=false and skip animation. The flag flips only after
      // the async import completes (after all effects have run).
      if (!animateFn) {
        import('motion').then(({ animate }) => {
          animateFn = animate;
          initialHydrationComplete = true;
        });
      }
      return;
    }

    // Client-side route transition: animate content in
    if (animateFn && ref.current && animateTarget) {
      animateFn(ref.current, animateTarget, {
        duration: transition?.duration || 0.5,
        delay: transition?.delay || 0,
        ease: transition?.ease || [0.25, 0.46, 0.45, 0.94],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  );
};

export default MotionWrapper;
