import React, { useEffect, useState } from 'react';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -20,
  },
};

const pageTransition = {
  type: 'tween',
  ease: [0.25, 0.46, 0.45, 0.94], // Custom cubic-bezier
  duration: 0.4,
};

function PageTransition({ children, className }) {
  const [isClient, setIsClient] = useState(false);
  const [MotionDiv, setMotionDiv] = useState(null);

  useEffect(() => {
    setIsClient(true);
    // Dynamically import motion to avoid SSR issues
    import('motion/react').then(({ motion }) => {
      setMotionDiv(() => motion.div);
    });
    
    // Scroll to top when component mounts (page transition starts)
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Return static div during SSR or while loading motion
  if (!isClient || !MotionDiv) {
    return <div className={className}>{children}</div>;
  }

  return (
    <MotionDiv
      className={className}
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </MotionDiv>
  );
}

export default PageTransition;
