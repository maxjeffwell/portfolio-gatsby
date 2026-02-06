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
    const Wrapper = () => {
      const { theme } = useTheme();
      return <DeveloperCard theme={theme} />;
    };
    return <Wrapper />;
  },
};
