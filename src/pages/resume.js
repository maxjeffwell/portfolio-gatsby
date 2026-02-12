import React, { useEffect } from 'react';
import styled from 'styled-components';
import Layout from '../components/layout';
import SEO from '../components/seo';
import PageTransition from '../components/PageTransition';

const StyledContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 24px;
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;

  @media (max-width: 600px) {
    padding: 0 16px;
  }
`;

const Title = styled.h1`
  font-size: clamp(2.5rem, 6vw, 3.5rem);
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 24px;
  background: linear-gradient(135deg, #1565c0 0%, #9c27b0 50%, #e91e63 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.02em;
`;

const Description = styled.p`
  font-size: 1.375rem;
  line-height: 1.6;
  color: var(--text-color);
  margin: 0 auto 32px auto;
  max-width: 600px;
`;

const CountdownText = styled.p`
  font-size: 1.125rem;
  color: var(--text-secondary-color);
  margin-bottom: 32px;
`;

const ResumeLink = styled.a`
  display: inline-block;
  padding: 16px 32px;
  margin: 8px 16px;
  background: linear-gradient(135deg, #1565c0 0%, #9c27b0 100%);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.125rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0px 4px 12px rgba(21, 101, 192, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0px 8px 20px rgba(21, 101, 192, 0.3);
  }

  @media (max-width: 600px) {
    display: block;
    margin: 8px 0;
    width: 100%;
    max-width: 300px;
  }
`;

const BackLink = styled.a`
  display: inline-block;
  margin-top: 40px;
  color: var(--primary-color);
  text-decoration: underline;
  font-size: 1.125rem;

  &:hover {
    color: var(--primary-hover);
  }
`;

function ResumePage() {
  useEffect(() => {
    // Auto-redirect after 5 seconds
    const timer = setTimeout(() => {
      window.open('https://maxjeffwell.github.io/Resume', '_blank', 'noopener,noreferrer');
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout>
      <PageTransition>
        <SEO
          title="Resume | Jeff Maxwell - Full Stack React & Node.js Developer"
          description="View Jeff Maxwell's professional resume showcasing full stack development experience with React, Node.js, JavaScript, and modern web technologies."
          pathname="/resume/"
          keywords={[
            'jeff maxwell resume',
            'react developer resume',
            'node.js developer resume',
            'full stack developer resume',
            'javascript developer resume',
            'orlando developer resume',
            'web developer cv',
            'portfolio resume',
          ]}
        />
        <StyledContainer>
          <Title>Professional Resume</Title>
          <Description>
            Redirecting you to my comprehensive resume showcasing full stack development experience,
            technical skills, and professional background.
          </Description>
          <CountdownText>Opening resume in 5 seconds...</CountdownText>

          <div>
            <ResumeLink
              href="https://maxjeffwell.github.io/Resume"
              target="_blank"
              rel="noopener noreferrer"
              title="View Jeff Maxwell's professional resume"
            >
              View Resume Now
            </ResumeLink>
          </div>

          <BackLink href="/about/" title="Return to About page">
            ← Back to About
          </BackLink>
        </StyledContainer>
      </PageTransition>
    </Layout>
  );
}

export default ResumePage;
