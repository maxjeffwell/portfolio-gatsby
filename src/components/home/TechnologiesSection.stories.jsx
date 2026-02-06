import React from 'react';
import TechnologiesSection from './TechnologiesSection';
import { useTheme } from '../../context/ThemeContext';

const meta = {
  title: 'Home/TechnologiesSection',
  component: TechnologiesSection,
  parameters: { layout: 'fullscreen' },
};

export default meta;

export const Default = {
  render: () => {
    const Wrapper = () => {
      const { theme } = useTheme();
      return <TechnologiesSection theme={theme} />;
    };
    return <Wrapper />;
  },
};

export const Dark = {
  render: () => (
    <TechnologiesSection
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
