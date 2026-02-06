import React from 'react';
import ProjectCard from './projectCard';
import { mockProject, mockProjectWithVideo, mockProjectMinimal } from './__mocks__/projectData';

const meta = {
  title: 'Components/ProjectCard',
  component: ProjectCard,
  parameters: { layout: 'padded' },
};

export default meta;

export const Default = {
  render: () => <ProjectCard project={mockProject} />,
};

export const WithVideo = {
  render: () => <ProjectCard project={mockProjectWithVideo} />,
};

export const Minimal = {
  render: () => <ProjectCard project={mockProjectMinimal} />,
};

export const Mobile = {
  render: () => <ProjectCard project={mockProject} />,
  parameters: {
    viewport: { defaultViewport: 'mobile' },
  },
};
