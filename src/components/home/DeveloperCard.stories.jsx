import React from 'react';
import DeveloperCard from './DeveloperCard';
import { useTheme } from '../../context/ThemeContext';

const meta = {
  title: 'Home/DeveloperCard',
  component: DeveloperCard,
  parameters: { layout: 'padded' },
};

export default meta;

export const Default = {
  render: () => {
    const { theme } = useTheme();
    return <DeveloperCard theme={theme} />;
  },
};

export const Dark = {
  render: () => (
    <div style={{ padding: '2rem', backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <DeveloperCard
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
    </div>
  ),
  parameters: { layout: 'fullscreen' },
};

export const Mobile = {
  render: () => {
    const { theme } = useTheme();
    return <DeveloperCard theme={theme} />;
  },
  parameters: {
    viewport: { defaultViewport: 'mobile' },
  },
};
