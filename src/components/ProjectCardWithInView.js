import React from 'react';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
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
  const isInView = useInView(ref, { 
    once: true, 
    margin: "-50px",
    amount: 0.1
  });

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      style={{ width: '100%' }}
    >
      <ProjectCard {...props} />
    </motion.div>
  );
}

export default ProjectCardWithInView;