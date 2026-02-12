import React from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import ClientOnlyIcon from '../components/ClientOnlyIcon';
import ClientOnlyButton from '../components/ClientOnlyButton';

import Layout from '../components/layout';
import SEO from '../components/seo';
import PageTransition from '../components/PageTransition';

const ErrorSection = styled.section`
  background: ${(props) =>
    props.theme?.mode === 'dark'
      ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
      : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'};
  min-height: calc(100vh - 160px);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  transition: background 0.3s ease;
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 24px;
  box-sizing: border-box;

  @media (max-width: 600px) {
    padding: 0 16px;
  }
`;

const ErrorContainer = styled.div`
  text-align: center;
  position: relative;
  z-index: 1;
`;

const ErrorCode = styled.div`
  font-size: clamp(8rem, 20vw, 12rem);
  font-weight: 800;
  line-height: 0.8;
  margin-bottom: 2rem;
  background: ${(props) =>
    props.theme?.mode === 'dark'
      ? 'linear-gradient(135deg, #90caf9 0%, #ce93d8 50%, #f48fb1 100%)'
      : 'linear-gradient(135deg, #1565c0 0%, #9c27b0 50%, #e91e63 100%)'};
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: background 0.3s ease;
`;

const Title = styled.h1`
  font-size: clamp(2rem, 6vw, 3rem);
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: ${(props) => (props.theme?.mode === 'dark' ? '#ffffff' : '#333')};
`;

const Description = styled.p`
  font-size: 1.25rem;
  color: ${(props) => (props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : '#666')};
  margin-bottom: 3rem;
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 2rem;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
  }
`;

const HomeButton = styled(ClientOnlyButton)`
  && {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
    color: white !important;
    border: none !important;
    border-radius: 50px !important;
    padding: 16px 32px !important;
    font-size: 1.125rem !important;
    font-weight: 600 !important;
    text-transform: none !important;
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3) !important;
    transition: all 0.3s ease !important;

    &:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4) !important;
    }
  }
`;

const NavButton = styled(ClientOnlyButton)`
  && {
    background: transparent !important;
    color: ${(props) => props.theme?.colors?.primary || '#1565c0'} !important;
    border: 2px solid ${(props) => props.theme?.colors?.primary || '#1565c0'} !important;
    border-radius: 50px !important;
    padding: 14px 28px !important;
    font-size: 1rem !important;
    font-weight: 600 !important;
    text-transform: none !important;
    transition: all 0.3s ease !important;

    &:hover {
      background: ${(props) => props.theme?.colors?.primary || '#1565c0'} !important;
      color: white !important;
      transform: translateY(-2px) !important;
    }
  }
`;

const FloatingShape = styled.div`
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  animation: float 6s ease-in-out infinite;

  @keyframes float {
    0%,
    100% {
      transform: translateY(0) rotate(0deg);
    }
    50% {
      transform: translateY(-20px) rotate(180deg);
    }
  }
`;

const QuoteBox = styled.div`
  margin: 2rem auto;
  padding: 1.5rem 2rem;
  max-width: 500px;
  background: ${(props) =>
    props.theme?.mode === 'dark' ? 'rgba(144, 202, 249, 0.1)' : 'rgba(25, 118, 210, 0.05)'};
  border-left: 4px solid ${(props) => props.theme?.colors?.primary || '#1976d2'};
  border-radius: 8px;
  font-size: 1.125rem;
  line-height: 1.6;
  color: ${(props) => (props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : '#555')};
  transition:
    background 0.3s ease,
    color 0.3s ease,
    border-color 0.3s ease;
  font-style: italic;
`;

function NotFoundPage() {
  const { theme } = useTheme();

  return (
    <Layout>
      <PageTransition>
        <SEO
          title="404: Page Not Found"
          description="Page not found. Navigate back to explore Jeff Maxwell's full stack development portfolio and featured React & Node.js projects in Orlando, Florida."
        />
        <ErrorSection theme={theme}>
          <Container>
            <ErrorContainer>
              <ErrorCode theme={theme}>404</ErrorCode>
              <Title theme={theme}>Oops! Page Not Found</Title>
              <Description theme={theme}>
                The page you&apos;re looking for seems to have wandered off into the digital void.
                Don&apos;t worry though — let&apos;s get you back on track!
              </Description>

              <QuoteBox theme={theme}>
                &#34;The best error messages are the ones that help you fix the problem.&#34; — Here are
                some helpful options to continue exploring.
              </QuoteBox>

              <ButtonGroup>
                <HomeButton
                  component={Link}
                  to="/"
                  startIcon={<ClientOnlyIcon iconName="ArrowBack" />}
                >
                  Back to Home
                </HomeButton>

                <NavButton
                  component={Link}
                  to="/projects/"
                  title="Browse my development projects and portfolio"
                  theme={theme}
                >
                  View Projects
                </NavButton>

                <NavButton
                  component={Link}
                  to="/about/"
                  title="Learn more about Jeff and his development approach"
                  theme={theme}
                >
                  About Me
                </NavButton>
              </ButtonGroup>
            </ErrorContainer>
          </Container>

          {/* Floating shapes */}
          <FloatingShape
            style={{
              width: '200px',
              height: '200px',
              background: 'rgba(25, 118, 210, 0.1)',
              top: '10%',
              left: '-50px',
            }}
          />
          <FloatingShape
            style={{
              width: '150px',
              height: '150px',
              background: 'rgba(233, 30, 99, 0.1)',
              bottom: '20%',
              right: '-50px',
              animationDelay: '2s',
            }}
          />
          <FloatingShape
            style={{
              width: '100px',
              height: '100px',
              background: 'rgba(102, 126, 234, 0.1)',
              top: '30%',
              right: '10%',
              animationDelay: '4s',
            }}
          />
        </ErrorSection>
      </PageTransition>
    </Layout>
  );
}

export default NotFoundPage;
