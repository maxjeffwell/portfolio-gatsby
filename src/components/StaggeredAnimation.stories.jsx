import React from 'react';
import StaggeredAnimation from './StaggeredAnimation';
import { Card, CardTitle, CardText } from './home/styles';
import { useTheme } from '../context/ThemeContext';

const meta = {
  title: 'Animations/StaggeredAnimation',
  component: StaggeredAnimation,
  parameters: { layout: 'padded' },
};

export default meta;

const ColorBox = ({ color, label }) => (
  <div
    style={{
      padding: '1.5rem',
      backgroundColor: color,
      borderRadius: '8px',
      color: '#fff',
      fontWeight: 600,
      textAlign: 'center',
      marginBottom: '0.5rem',
    }}
  >
    {label}
  </div>
);

export const Default = {
  render: () => (
    <StaggeredAnimation>
      <ColorBox color="#1976d2" label="First Item" />
      <ColorBox color="#dc004e" label="Second Item" />
      <ColorBox color="#7c4dff" label="Third Item" />
      <ColorBox color="#00897b" label="Fourth Item" />
    </StaggeredAnimation>
  ),
};

export const CustomDelay = {
  render: () => (
    <StaggeredAnimation delay={1}>
      <ColorBox color="#e91e63" label="Delayed 1s" />
      <ColorBox color="#9c27b0" label="Stagger" />
      <ColorBox color="#673ab7" label="Effect" />
    </StaggeredAnimation>
  ),
};

export const ManyItems = {
  render: () => (
    <StaggeredAnimation>
      {Array.from({ length: 8 }, (_, i) => (
        <ColorBox key={i} color={`hsl(${i * 45}, 70%, 50%)`} label={`Item ${i + 1}`} />
      ))}
    </StaggeredAnimation>
  ),
};

export const WithCards = {
  render: () => {
    const Wrapper = () => {
      const { theme } = useTheme();
      return (
        <StaggeredAnimation>
          <Card theme={theme} style={{ marginBottom: '1rem' }}>
            <CardTitle theme={theme}>Frontend</CardTitle>
            <CardText theme={theme}>React, TypeScript, CSS-in-JS</CardText>
          </Card>
          <Card theme={theme} style={{ marginBottom: '1rem' }}>
            <CardTitle theme={theme}>Backend</CardTitle>
            <CardText theme={theme}>Node.js, Express, PostgreSQL</CardText>
          </Card>
          <Card theme={theme}>
            <CardTitle theme={theme}>DevOps</CardTitle>
            <CardText theme={theme}>Docker, Kubernetes, ArgoCD</CardText>
          </Card>
        </StaggeredAnimation>
      );
    };
    return <Wrapper />;
  },
};
