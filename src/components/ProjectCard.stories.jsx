import React from 'react';
import ProjectCard from './projectCard';
import { mockProject, mockProjectWithVideo, mockProjectMinimal } from './__mocks__/projectData';

const meta = {
  title: 'Components/ProjectCard',
  component: ProjectCard,
  parameters: { layout: 'padded' },
};

export default meta;

// Map mock data fields to the component's prop names
const toProps = ({ title, date, description, source, hosted, techIcons, image, video }) => ({
  title,
  date,
  description,
  sourceURLs: source,
  deployments: hosted,
  technologies: techIcons,
  imageSrcPath: image,
  videoSrcPath: video?.publicURL || null,
});

export const Default = {
  render: () => <ProjectCard {...toProps(mockProject)} />,
};

export const WithVideo = {
  render: () => <ProjectCard {...toProps(mockProjectWithVideo)} />,
};

export const Minimal = {
  render: () => <ProjectCard {...toProps(mockProjectMinimal)} />,
};

export const ManyTechnologies = {
  render: () => (
    <ProjectCard
      {...toProps({
        ...mockProject,
        title: 'Full-Stack Platform',
        techIcons: [
          'React', 'Node', 'PostgreSQL', 'Docker', 'Kubernetes',
          'GraphQL', 'Redis', 'MongoDB', 'TypeScript', 'Nginx',
        ],
      })}
    />
  ),
};

export const Mobile = {
  render: () => <ProjectCard {...toProps(mockProject)} />,
  parameters: {
    viewport: { defaultViewport: 'mobile' },
  },
};

export const CardGrid = {
  name: 'Multiple Cards (Grid)',
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px', maxWidth: '1200px' }}>
      <ProjectCard {...toProps(mockProject)} />
      <ProjectCard {...toProps(mockProjectWithVideo)} />
      <ProjectCard {...toProps(mockProjectMinimal)} />
    </div>
  ),
  parameters: { layout: 'fullscreen' },
};
