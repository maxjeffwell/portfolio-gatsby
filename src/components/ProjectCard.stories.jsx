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

export const Mobile = {
  render: () => <ProjectCard {...toProps(mockProject)} />,
  parameters: {
    viewport: { defaultViewport: 'mobile' },
  },
};
