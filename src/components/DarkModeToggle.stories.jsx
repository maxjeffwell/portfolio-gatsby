import React from 'react';
import DarkModeToggle from './DarkModeToggle';
import { useTheme } from '../context/ThemeContext';

const meta = {
  title: 'Theme/DarkModeToggle',
  component: DarkModeToggle,
  parameters: { layout: 'centered' },
};

export default meta;

export const Default = {};

export const InContext = {
  render: () => {
    const { theme, isDarkMode } = useTheme();
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          padding: '32px 48px',
          borderRadius: '16px',
          backgroundColor: theme?.colors?.paper || '#fff',
          color: theme?.colors?.text || '#333',
          boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease',
        }}
      >
        <DarkModeToggle />
        <div>
          <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>
            {isDarkMode ? 'Dark' : 'Light'} Mode
          </div>
          <div style={{ fontSize: '0.85rem', opacity: 0.6, marginTop: '4px' }}>
            Click to toggle &middot; Right-click for options
          </div>
        </div>
      </div>
    );
  },
};

export const OnDarkBackground = {
  render: () => (
    <div
      style={{
        padding: '48px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #0a0a0a, #1a1a2e)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <DarkModeToggle />
    </div>
  ),
};

export const OnLightBackground = {
  render: () => (
    <div
      style={{
        padding: '48px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #f5f5f5, #e8eaf6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <DarkModeToggle />
    </div>
  ),
};
