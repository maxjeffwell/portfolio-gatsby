import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';

import Layout from '../components/layout';
import SEO from '../components/seo';
import PageTransition from '../components/PageTransition';

const StyledContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;

  @media (max-width: 600px) {
    padding: 0 16px;
  }
`;

const ResumeFrame = styled.iframe`
  width: 100%;
  height: 80vh;
  min-height: 600px;
  border: none;
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  background: #ffffff;
  
  @media (max-width: 768px) {
    height: 70vh;
    min-height: 500px;
  }
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 32px;
  padding-top: 40px;
`;

const Title = styled.h1`
  font-size: clamp(2.5rem, 6vw, 3.5rem);
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #1565c0 0%, #9c27b0 50%, #e91e63 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.02em;
`;

const Description = styled.p`
  font-size: 1.25rem;
  line-height: 1.5;
  color: ${props => props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'};
  max-width: 600px;
  margin: 0 auto 24px auto;
  transition: color 0.3s ease;
`;

const ResumeLink = styled.a`
  display: inline-block;
  padding: 12px 24px;
  margin: 16px 8px;
  background: linear-gradient(135deg, #1565c0 0%, #9c27b0 100%);
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0px 6px 16px rgba(21, 101, 192, 0.3);
  }
`;

const LoadingMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60vh;
  font-size: 1.125rem;
  color: ${props => props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'};
`;

function ResumePage() {
  const { theme } = useTheme();

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
            'portfolio resume'
          ]}
        />
        <StyledContainer>
          <HeaderSection>
            <Title>Professional Resume</Title>
            <Description theme={theme}>
              Comprehensive overview of my full stack development experience, technical skills, and professional background.
            </Description>
            <div>
              <ResumeLink
                href="https://maxjeffwell.github.io/Resume"
                target="_blank"
                rel="noopener noreferrer"
                title="Open resume in new tab"
              >
                Open in New Tab
              </ResumeLink>
              <ResumeLink
                href="https://maxjeffwell.github.io/Resume"
                download
                title="Download resume as PDF"
              >
                Download PDF
              </ResumeLink>
            </div>
          </HeaderSection>
          
          <ResumeFrame
            src="https://maxjeffwell.github.io/Resume"
            title="Jeff Maxwell Professional Resume"
            loading="lazy"
            allowFullScreen
          >
            <LoadingMessage theme={theme}>
              Loading resume... If the resume doesn't load, please{' '}
              <a 
                href="https://maxjeffwell.github.io/Resume"
                target="_blank"
                rel="noopener noreferrer"
                style={{ 
                  color: theme?.mode === 'dark' ? '#90caf9' : '#1565c0',
                  textDecoration: 'underline'
                }}
              >
                click here to view it directly
              </a>.
            </LoadingMessage>
          </ResumeFrame>
        </StyledContainer>
      </PageTransition>
    </Layout>
  );
}

export default ResumePage;