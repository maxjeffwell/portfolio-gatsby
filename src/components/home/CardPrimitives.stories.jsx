import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  Container,
  Card,
  CardTitle,
  CardText,
  CardLink,
  QuoteBox,
  InfoCard,
  InfoText,
  TwoColumnGrid,
  ContentSection,
  GradientTypingWrapper,
} from './styles';

const meta = {
  title: 'Design System/Card Primitives',
  parameters: { layout: 'padded' },
};

export default meta;

const ThemedStory = ({ children }) => {
  const { theme } = useTheme();
  return <div style={{ padding: '1rem' }}>{children(theme)}</div>;
};

export const DefaultCard = {
  render: () => (
    <ThemedStory>
      {(theme) => (
        <Card theme={theme}>
          <CardTitle theme={theme}>Full-Stack Developer</CardTitle>
          <CardText theme={theme}>
            Passionate about building accessible, performant web applications with modern
            JavaScript, React, and Node.js.
          </CardText>
          <CardLink to="#" theme={theme}>Learn more &rarr;</CardLink>
        </Card>
      )}
    </ThemedStory>
  ),
};

export const QuoteBoxStory = {
  name: 'QuoteBox',
  render: () => (
    <ThemedStory>
      {(theme) => (
        <QuoteBox theme={theme}>
          &ldquo;The best way to predict the future is to invent it.&rdquo;
          &mdash; Alan Kay
        </QuoteBox>
      )}
    </ThemedStory>
  ),
};

export const InfoCardStory = {
  name: 'InfoCard',
  render: () => (
    <ThemedStory>
      {(theme) => (
        <InfoCard theme={theme}>
          <h3>Core Technologies</h3>
          <ul>
            <li>React &amp; Gatsby</li>
            <li>Node.js &amp; Express</li>
            <li>PostgreSQL &amp; MongoDB</li>
            <li>Docker &amp; Kubernetes</li>
          </ul>
          <InfoText>Always exploring new tools and frameworks.</InfoText>
        </InfoCard>
      )}
    </ThemedStory>
  ),
};

export const TwoColumnLayout = {
  render: () => (
    <ThemedStory>
      {(theme) => (
        <TwoColumnGrid>
          <Card theme={theme}>
            <CardTitle theme={theme}>Frontend</CardTitle>
            <CardText theme={theme}>
              React, TypeScript, CSS-in-JS, and modern build tools.
            </CardText>
          </Card>
          <Card theme={theme}>
            <CardTitle theme={theme}>Backend</CardTitle>
            <CardText theme={theme}>
              Node.js, Express, PostgreSQL, and REST/GraphQL APIs.
            </CardText>
          </Card>
        </TwoColumnGrid>
      )}
    </ThemedStory>
  ),
};

export const ContainerStory = {
  name: 'Container',
  render: () => (
    <ThemedStory>
      {(theme) => (
        <Container>
          <ContentSection>
            <Card theme={theme}>
              <CardTitle theme={theme}>Inside a Container</CardTitle>
              <CardText theme={theme}>
                The Container constrains content to max-width 1200px with responsive padding.
              </CardText>
            </Card>
          </ContentSection>
        </Container>
      )}
    </ThemedStory>
  ),
};

export const GradientTextStory = {
  name: 'GradientTypingWrapper',
  render: () => (
    <ThemedStory>
      {(theme) => (
        <GradientTypingWrapper theme={theme}>
          <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: 700, margin: 0, lineHeight: 1.2 }}>
            Hello, I am a Developer.
          </h1>
        </GradientTypingWrapper>
      )}
    </ThemedStory>
  ),
};
