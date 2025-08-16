import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

const MotionWrapper = ({ children, initial, animate, transition, ...props }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Return static div during SSR
  if (!isClient) {
    return <div {...props}>{children}</div>;
  }

  return (
    <motion.div
      initial={initial}
      animate={animate}
      transition={transition}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default MotionWrapper;