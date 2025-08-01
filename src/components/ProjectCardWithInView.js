import React from 'react';
import { motion } from 'motion/react';
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
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      style={{ width: '100%' }}
    >
      <ProjectCard {...props} />
    </motion.div>
  );
}

export default ProjectCardWithInView;