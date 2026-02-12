import React, { useState, useEffect, useRef } from 'react';

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
  const [MotionDiv, setMotionDiv] = useState(null);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    import('motion/react').then(({ motion }) => {
      setMotionDiv(() => motion.div);
      requestAnimationFrame(() => {
        isInitialLoad.current = false;
      });
    });
  }, []);

  // Return static div during SSR or while loading motion
  if (!MotionDiv) {
    return (
      <div className={className}>
        {React.Children.map(children, (child, index) => (
          <div key={index}>{child}</div>
        ))}
      </div>
    );
  }

  // Skip entry animation on initial page load to prevent CLS
  return (
    <MotionDiv
      className={className}
      variants={containerVariants}
      initial={isInitialLoad.current ? false : 'hidden'}
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
