import React from 'react';
import { useTheme } from '../context/ThemeContext';

import Layout from '../components/layout';
import SEO from '../components/seo';
import PageTransition from '../components/PageTransition';

// Home page section components
import {
  HeroSection,
  DeveloperCard,
  CodePhilosophyCard,
  TechnologiesSection,
  SocialShareSection,
  Container,
  ContentSection,
  TwoColumnGrid,
} from '../components/home';

const IndexPage = () => {
  const { theme } = useTheme();

  return (
    <Layout>
      <PageTransition>
        <SEO
          title="Jeff Maxwell - Full Stack React & Node.js Developer Orlando"
          description="Experienced Full Stack React & Node.js Developer in Orlando, Florida. Building modern web applications and scalable solutions for businesses."
          pathname="/"
          keywords={[
            'full stack developer',
            'react developer',
            'node.js developer',
            'javascript developer',
            'web developer portfolio',
            'orlando web developer',
            'florida react developer',
            'central florida developer',
            'jeff maxwell florida',
          ]}
        />

        {/* Hero Section */}
        <HeroSection theme={theme} />

        {/* Content Section - Developer & Code Philosophy */}
        <ContentSection id="about-developer">
          <Container>
            <TwoColumnGrid>
              <DeveloperCard theme={theme} />
              <CodePhilosophyCard theme={theme} />
            </TwoColumnGrid>
          </Container>
        </ContentSection>

        {/* Technologies & Expertise Section */}
        <TechnologiesSection theme={theme} />

        {/* Social Sharing Section */}
        <SocialShareSection theme={theme} />
      </PageTransition>
    </Layout>
  );
};

export default IndexPage;
