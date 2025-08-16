import React, { useState, useEffect } from 'react';

const MotionWrapper = ({ children, initial, animate, transition, ...props }) => {
  const [isClient, setIsClient] = useState(false);
  const [MotionDiv, setMotionDiv] = useState(null);

  useEffect(() => {
    setIsClient(true);
    // Dynamically import motion to avoid SSR issues
    import('motion/react').then(({ motion }) => {
      setMotionDiv(() => motion.div);
    });
  }, []);

  // Return static div during SSR or while loading motion
  if (!isClient || !MotionDiv) {
    return <div {...props}>{children}</div>;
  }

  return (
    <MotionDiv
      initial={initial}
      animate={animate}
      transition={transition}
      {...props}
    >
      {children}
    </MotionDiv>
  );
};

export default MotionWrapper;