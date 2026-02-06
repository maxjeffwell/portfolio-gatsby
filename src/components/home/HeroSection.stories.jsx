import React from 'react';
import HeroSection from './HeroSection';
import { useTheme } from '../../context/ThemeContext';

const meta = {
  title: 'Home/HeroSection',
  component: HeroSection,
  parameters: { layout: 'fullscreen' },
};

export default meta;

export const Light = {
  render: () => {
    const { theme } = useTheme();
    return <HeroSection theme={theme} />;
  },
};

export const Dark = {
  render: () => (
    <HeroSection
      theme={{
        mode: 'dark',
        colors: {
          primary: '#90caf9',
          secondary: '#f48fb1',
          background: '#0a0a0a',
          paper: '#1a1a1a',
          text: '#ffffff',
          textSecondary: '#e0e0e0',
        },
      }}
    />
  ),
};

export const Mobile = {
  render: () => {
    const { theme } = useTheme();
    return <HeroSection theme={theme} />;
  },
  parameters: {
    viewport: { defaultViewport: 'mobile' },
  },
};
