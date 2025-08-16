import React, { useState, useEffect } from 'react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'tween',
      ease: [0.25, 0.46, 0.45, 0.94],
      duration: 0.5,
    },
  },
};

function StaggeredAnimation({ children, className, delay = 0 }) {
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
    return (
      <div className={className}>
        {React.Children.map(children, (child, index) => (
          <div key={index}>{child}</div>
        ))}
      </div>
    );
  }

  return (
    <MotionDiv
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
    >
      {React.Children.map(children, (child, index) => (
        <MotionDiv key={index} variants={itemVariants}>
          {child}
        </MotionDiv>
      ))}
    </MotionDiv>
  );
}

export default StaggeredAnimation;
