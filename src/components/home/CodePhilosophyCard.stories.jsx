import React from 'react';
import CodePhilosophyCard from './CodePhilosophyCard';
import { useTheme } from '../../context/ThemeContext';

const meta = {
  title: 'Home/CodePhilosophyCard',
  component: CodePhilosophyCard,
  parameters: { layout: 'padded' },
};

export default meta;

export const Default = {
  render: () => {
    const { theme } = useTheme();
    return <CodePhilosophyCard theme={theme} />;
  },
};
