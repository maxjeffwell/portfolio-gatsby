import React from 'react';
import SimpleTypingAnimation from './SimpleTypingAnimation';
import { GradientTypingWrapper } from './home/styles';
import { useTheme } from '../context/ThemeContext';

const meta = {
  title: 'Animations/SimpleTypingAnimation',
  component: SimpleTypingAnimation,
  parameters: { layout: 'padded' },
  argTypes: {
    typeSpeed: { control: { type: 'range', min: 10, max: 200, step: 10 } },
    deleteSpeed: { control: { type: 'range', min: 10, max: 100, step: 5 } },
    delayBetweenTexts: { control: { type: 'range', min: 500, max: 5000, step: 500 } },
  },
};

export default meta;

export const Default = {
  args: {
    texts: ['Node.js Expert', 'React Specialist', 'Full Stack Developer', 'JavaScript Enthusiast'],
    typeSpeed: 100,
    deleteSpeed: 50,
    delayBetweenTexts: 2000,
    loop: true,
    style: { fontSize: '2rem', fontWeight: 700 },
  },
};

export const FastSpeed = {
  args: {
    texts: ['Fast Typing', 'Quick Delete', 'Smooth Animation'],
    typeSpeed: 30,
    deleteSpeed: 15,
    delayBetweenTexts: 1000,
    loop: true,
    style: { fontSize: '2rem', fontWeight: 700 },
  },
};

export const SingleText = {
  args: {
    texts: ['Hello World'],
    loop: false,
    typeSpeed: 80,
    style: { fontSize: '2rem', fontWeight: 700 },
  },
};

export const GradientStyle = {
  render: () => {
    const Wrapper = () => {
      const { theme } = useTheme();
      return (
        <GradientTypingWrapper theme={theme}>
          <SimpleTypingAnimation
            texts={['React Developer', 'UI Engineer', 'Problem Solver']}
            typeSpeed={60}
            deleteSpeed={30}
            delayBetweenTexts={2000}
            loop
            style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: 700 }}
          />
        </GradientTypingWrapper>
      );
    };
    return <Wrapper />;
  },
};

export const WithDelay = {
  args: {
    texts: ['Delayed Start Animation'],
    startDelay: 2000,
    typeSpeed: 80,
    loop: false,
    style: { fontSize: '2rem', fontWeight: 700 },
  },
};
