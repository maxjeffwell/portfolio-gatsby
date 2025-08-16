import React, { useRef, useState, useEffect } from 'react';
import ProjectCard from './projectCard';

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'tween',
      ease: [0.25, 0.46, 0.45, 0.94],
      duration: 0.6,
    },
  },
};

function ProjectCardWithInView(props) {
  const ref = useRef(null);
  const [isClient, setIsClient] = useState(false);
  const [MotionDiv, setMotionDiv] = useState(null);
  const [useInView, setUseInView] = useState(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Dynamically import motion to avoid SSR issues
    import('motion/react').then(({ motion, useInView: useInViewHook }) => {
      setMotionDiv(() => motion.div);
      setUseInView(() => useInViewHook);
    });
  }, []);

  useEffect(() => {
    if (useInView && ref.current) {
      const inView = useInView(ref, {
        once: true,
        margin: '-50px',
        amount: 0.1,
      });
      setIsInView(inView);
    }
  }, [useInView]);

  // Return static div during SSR or while loading motion
  if (!isClient || !MotionDiv) {
    return (
      <div ref={ref} style={{ width: '100%' }}>
        <ProjectCard {...props} />
      </div>
    );
  }

  return (
    <MotionDiv
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      style={{ width: '100%' }}
    >
      <ProjectCard {...props} />
    </MotionDiv>
  );
}

export default ProjectCardWithInView;
