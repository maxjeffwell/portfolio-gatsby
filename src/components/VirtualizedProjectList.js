import React, { memo, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { VariableSizeList as List } from 'react-window';
import { Box } from '@mui/material';

const ProjectCard = React.lazy(() => import('./projectCard'));

const VirtualizedProjectItem = memo(function VirtualizedProjectItem({ index, style, data }) {
  const project = data[index];
  
  return (
    <div style={style}>
      <Box sx={{ p: 2 }}>
        <React.Suspense 
          fallback={
            <Box sx={{ 
              height: '400px', 
              backgroundColor: 'action.hover', 
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }} />
          }
        >
          <ProjectCard
            title={project.title}
            date={project.date}
            description={project.description}
            sourceURL={project.sourceURL}
            hostedURL={project.hostedURL}
            technologies={project.technologies}
            imageSrcPath={project.imageSrcPath}
            imageSrcPath2={project.imageSrcPath2}
            imageSrcPath3={project.imageSrcPath3}
            imageSrcPath4={project.imageSrcPath4}
            imageSrcPath5={project.imageSrcPath5}
            imageSrcPath6={project.imageSrcPath6}
          />
        </React.Suspense>
      </Box>
    </div>
  );
});

VirtualizedProjectItem.propTypes = {
  index: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
};

const VirtualizedProjectList = memo(function VirtualizedProjectList({ projects }) {
  // Memoize item size calculation to avoid recalculation
  const getItemSize = useCallback((index) => {
    // Estimate size based on project content
    const project = projects[index];
    const baseSize = 450; // Base card size
    const descriptionLines = Math.ceil(project.description.length / 80);
    const techSize = project.technologies.length * 10;
    return baseSize + (descriptionLines * 20) + techSize;
  }, [projects]);

  // Memoize the list height to prevent unnecessary re-renders
  const listHeight = useMemo(() => {
    return Math.min(projects.length * 500, window.innerHeight * 0.8);
  }, [projects.length]);

  if (projects.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.125rem' }}>
          No projects match your current filters. Try adjusting your search criteria.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: listHeight, width: '100%' }}>
      <List
        height={listHeight}
        itemCount={projects.length}
        itemSize={getItemSize}
        itemData={projects}
        overscanCount={2} // Render 2 extra items for smooth scrolling
      >
        {VirtualizedProjectItem}
      </List>
    </Box>
  );
});

VirtualizedProjectList.propTypes = {
  projects: PropTypes.array.isRequired,
};

export default VirtualizedProjectList;