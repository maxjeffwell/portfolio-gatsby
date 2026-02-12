import React, { useEffect, useRef } from 'react';

// Module-level state persists across component mounts within the same client session.
// This lets us distinguish the initial hydration mount from subsequent client-side
// route transitions without triggering React re-renders.
let animateFn = null;
let isHydrationMount = true;

function PageTransition({ children, className }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isHydrationMount) {
      // Initial page load: content is already visible from SSR, skip animation.
      // Preload the motion library so it's ready for client-side navigations.
      isHydrationMount = false;
      import('motion').then(({ animate }) => {
        animateFn = animate;
      });
      return;
    }

    // Client-side route transition: animate content in
    if (animateFn && ref.current) {
      animateFn(
        ref.current,
        { opacity: [0, 1], y: [20, 0] },
        { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
      );
    }
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export default PageTransition;
