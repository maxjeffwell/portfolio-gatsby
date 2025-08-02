import React from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';
import SimpleTypingAnimation from '../components/SimpleTypingAnimation';
import { useTheme } from '../context/ThemeContext';

import Layout from '../components/layout';
import SEO from '../components/seo';
import CanvasCodeSnippet from '../components/CanvasCodeSnippet';
import PageTransition from '../components/PageTransition';
import StaggeredAnimation from '../components/StaggeredAnimation';
import ClientOnlyIcon from '../components/ClientOnlyIcon';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  box-sizing: border-box;

  @media (max-width: 600px) {
    padding: 0 16px;
  }

  @media (max-width: 480px) {
    padding: 0 12px;
  }
`;

const HeroSection = styled.section`
  background: ${(props) =>
    props.theme?.mode === 'dark'
      ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
      : props.theme?.mode === 'light'
        ? 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
        : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'};
  padding: 80px 0 60px;
  text-align: center;
  position: relative;
  overflow: hidden;
  transition: background 0.3s ease;

  .dark-mode & {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  }

  @media (max-width: 600px) {
    padding: 60px 0 40px;
  }
`;

const HeroTitle = styled.h1`
  font-size: clamp(2.5rem, 8vw, 4rem);
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
  color: ${(props) =>
    props.theme?.mode === 'dark'
      ? '#ffffff'
      : props.theme?.mode === 'light'
        ? '#333'
        : 'var(--text-color)'};
  transition: color 0.3s ease;

  .highlight {
    background: linear-gradient(135deg, #1976d2 0%, #2196f3 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: inline-block;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.5rem;
  color: ${(props) => (props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : '#666')};
  margin: 20px 0 40px;
  font-weight: 600;
  transition: color 0.3s ease;

  @media (max-width: 600px) {
    font-size: 1.3rem;
  }
`;


const ContentSection = styled.section`
  padding: 80px 0;

  @media (max-width: 600px) {
    padding: 60px 0;
  }
`;

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 0.5fr 1.5fr;
  gap: 48px;
  align-items: start;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  @media (max-width: 480px) {
    gap: 20px;
  }
`;

const Card = styled.div`
  background: ${(props) => props.theme?.colors?.paper || 'var(--paper-color)'};
  color: ${(props) => props.theme?.colors?.text || 'var(--text-color)'};
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  height: 100%;
  transition:
    background 0.3s ease,
    color 0.3s ease;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 28px;
  }

  @media (max-width: 600px) {
    padding: 24px 20px;
  }

  @media (max-width: 480px) {
    padding: 20px 16px;
    border-radius: 12px;
  }

  @media (max-width: 360px) {
    padding: 16px 12px;
    border-radius: 8px;
  }
`;

const CardTitle = styled.h2`
  font-size: clamp(1.375rem, 4vw, 1.875rem);
  font-weight: 700;
  margin: 0 0 clamp(16px, 4vw, 24px) 0;
  color: ${(props) => props.theme?.colors?.text || '#333'};
  display: flex;
  align-items: center;
  gap: 12px;
  transition: color 0.3s ease;
  line-height: 1.3;

  @media (max-width: 480px) {
    gap: 8px;
  }
`;

const CardText = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: ${(props) => (props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : '#666')};
  margin: 0 0 24px 0;
  transition: color 0.3s ease;
`;


const QuoteBox = styled.div`
  margin: 20px 0;
  padding: 16px 20px;
  background: ${(props) =>
    props.theme?.mode === 'dark' ? 'rgba(144, 202, 249, 0.1)' : 'rgba(25, 118, 210, 0.05)'};
  border-left: 4px solid ${(props) => props.theme?.colors?.primary || '#1976d2'};
  border-radius: 4px;
  font-size: 1.25rem;
  line-height: 1.6;
  color: ${(props) => (props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : '#555')};
  transition:
    background 0.3s ease,
    color 0.3s ease,
    border-color 0.3s ease;
`;

const GradientTypingWrapper = styled.span`
  font-weight: inherit;
  background: ${(props) =>
    props.theme?.mode === 'dark'
      ? 'linear-gradient(135deg, #90caf9 0%, #ce93d8 50%, #f48fb1 100%)'
      : 'linear-gradient(135deg, #1565c0 0%, #9c27b0 50%, #e91e63 100%)'};
  background-clip: text;
  -webkit-background-clip: text;
  color: ${(props) => (props.theme?.mode === 'dark' ? '#90caf9' : '#1565c0')};
  transition: background 0.3s ease;
  display: inline-block;

  /* Only make text transparent when browser supports background-clip */
  @supports (background-clip: text) or (-webkit-background-clip: text) {
    -webkit-text-fill-color: transparent;
    color: transparent;
  }
`;

const InfoCard = styled.div`
  background: ${(props) =>
    props.theme?.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(233, 30, 99, 0.15) 0%, rgba(233, 30, 99, 0.1) 100%)'
      : 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)'};
  border-radius: 12px;
  padding: 32px;
  margin-top: 24px;
  transition: background 0.3s ease;
  box-sizing: border-box;
  width: 100%;
  overflow: hidden;

  h3 {
    font-size: clamp(1.25rem, 3vw, 1.5rem);
    font-weight: 600;
    color: ${(props) => (props.theme?.mode === 'dark' ? '#f48fb1' : '#e91e63')};
    margin: 0 0 16px 0;
    transition: color 0.3s ease;
    line-height: 1.3;
    word-wrap: break-word;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      margin-bottom: 12px;
      color: ${(props) => (props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : '#333')};
      transition: color 0.3s ease;
      font-size: clamp(0.9rem, 2.5vw, 1rem);
      line-height: 1.5;
      word-wrap: break-word;
      overflow-wrap: break-word;

      svg {
        color: ${(props) => (props.theme?.mode === 'dark' ? '#f48fb1' : '#e91e63')};
        flex-shrink: 0;
        transition: color 0.3s ease;
        margin-top: 2px;
      }
    }
  }

  @media (max-width: 600px) {
    padding: 20px;
    margin-top: 20px;
  }

  @media (max-width: 480px) {
    padding: 16px;
    border-radius: 8px;
    margin-top: 16px;
  }

  @media (max-width: 360px) {
    padding: 14px;
    border-radius: 6px;
  }
`;

const IndexPage = () => {
  const { theme } = useTheme();

  return (
    <Layout>
      <style jsx>{`
        .hero-intro {
          font-size: clamp(1.5rem, 4vw, 2rem);
          margin: 0 0 clamp(12px, 3vw, 16px) 0;
          color: ${theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : '#666'};
          transition: color 0.3s ease;
          font-weight: 700;
        }
        .card-link {
          color: #e91e63;
          text-transform: none;
          font-size: 1rem;
          font-weight: 500;
          padding: 8px 16px;
          display: inline-block;
          text-decoration: none;
          transition: color 0.3s ease;
        }
        .card-link:hover {
          color: #ad1457;
        }
        .hero-quote {
          font-size: clamp(1rem, 3vw, 1.25rem);
          line-height: 1.6;
          color: ${theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : '#777'};
          margin-bottom: clamp(24px, 6vw, 40px);
          transition: color 0.3s ease;
          padding: 0 8px;
        }
        .info-text {
          margin-top: 16px;
          font-size: 0.95rem;
          line-height: 1.5;
        }
        .cta-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 50px;
          padding: 16px 40px;
          font-size: 1.125rem;
          font-weight: 600;
          text-transform: none;
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
        }
        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
        }
      `}</style>
      <PageTransition>
        <SEO
          title="Jeff Maxwell | Full Stack React & Node.js Developer"
          description="Hi, I'm Jeff Maxwell, Full Stack React & Node.js Developer. Modern web applications, innovative projects, and scalable solutions."
          pathname="/"
          keywords={[
            'full stack developer',
            'react developer',
            'node.js developer',
            'javascript developer',
            'web developer portfolio',
            'orlando web developer',
            'central florida developer',
            'tampa bay developer',
            'florida react developer',
          ]}
        />

        {/* Hero Section */}
        <HeroSection theme={theme} as="section" aria-labelledby="hero-title">
          <Container>
            <StaggeredAnimation>
                <p className="hero-intro">My name's Jeff</p>
                <HeroTitle theme={theme} as="h1" id="hero-title">
                  I'm a{' '}
                  <GradientTypingWrapper theme={theme}>
                    <SimpleTypingAnimation
                      texts={[
                        'Node.js Expert',
                        'React Specialist',
                        'Full Stack Developer',
                        'JavaScript Enthusiast',
                        'Problem Solver',
                      ]}
                      typeSpeed={60}
                      deleteSpeed={30}
                      delayBetweenTexts={2000}
                      startDelay={1000}
                      loop
                    />
                  </GradientTypingWrapper>
                </HeroTitle>
                <HeroSubtitle theme={theme}>crafting exceptional web experiences</HeroSubtitle>

                <QuoteBox theme={theme}>
                  As a <strong>Node.js Expert</strong> and <strong>React Specialist</strong>, I believe in <strong>clean, maintainable code</strong> and{' '}
                  <strong>user-centered design</strong>. Every <strong>Full Stack Developer</strong> should be a <strong>Problem Solver</strong> first, and as a{' '}
                  <strong>JavaScript Enthusiast</strong>, I craft every line with
                  performance, accessibility, and scalability in mind. Check out my{' '}
                  <Link to="/projects/" title="View my featured development projects and portfolio" style={{ color: 'inherit', fontWeight: 'bold', textDecoration: 'underline' }}>
                    featured projects
                  </Link>{' '}
                  to see these principles in action.
                </QuoteBox>

                <p className="hero-quote">
                  "Code is like humor. When you have to explain it, it's bad." — That's why I focus
                  on intuitive, self-documenting solutions. Ready to discuss your next project?{' '}
                  <Link to="/contact/" title="Get in touch to discuss your next project" style={{ color: theme?.mode === 'dark' ? '#90caf9' : '#1565c0', fontWeight: 'bold', textDecoration: 'underline' }}>
                    Let's connect
                  </Link>.
                </p>

                <Link to="/projects/" className="cta-button" title="View my featured development projects">
                  View My Projects →
                </Link>
              </StaggeredAnimation>

          </Container>
        </HeroSection>

        {/* Content Section */}
        <ContentSection>
          <Container>
            <TwoColumnGrid>
              {/* Beyond the Code */}
              <Card theme={theme} as="article">
                <CardTitle theme={theme} as="h2">
                  <ClientOnlyIcon iconName="Paws" fontSize="large" style={{ marginRight: '8px', color: '#007bff' }} /> Beyond the Code
                </CardTitle>
                <CardText theme={theme}>
                  When I'm not crafting pixel-perfect interfaces or debugging complex algorithms,
                  you'll find me negotiating dinner arrangements with my two demanding canine
                  project managers — they're surprisingly good at code reviews! My approach to
                  development extends beyond just writing code; it's about understanding user needs,
                  anticipating edge cases, and building solutions that scale gracefully. I'm passionate
                  about continuous learning, whether it's exploring new frameworks, optimizing performance
                  bottlenecks, or contributing to open-source projects. Want to know more about my{' '}
                  <Link to="/about/" title="Learn more about Jeff's development philosophy and approach" style={{ color: theme?.mode === 'dark' ? '#f48fb1' : '#e91e63', fontWeight: 'bold', textDecoration: 'underline' }}>
                    development philosophy
                  </Link>?
                </CardText>
                <Link to="/about/" className="card-link" title="Learn more about Jeff Maxwell's development approach">
                  Meet my development team and learn more about me →
                </Link>
              </Card>

              {/* Code Philosophy */}
              <Card theme={theme} as="article">
                <CardTitle theme={theme} as="h2">
                  <ClientOnlyIcon iconName="Computer" fontSize="large" style={{ marginRight: '8px', color: '#007bff' }} /> Code Philosophy
                </CardTitle>
                <CardText theme={theme}>
                  Clean, readable, and maintainable — here's how I approach modern React
                  development as a <strong>React Specialist</strong>. As a <strong>JavaScript Enthusiast</strong>, I believe in writing code that tells a story, where each function
                  has a single responsibility and complex logic is broken down into digestible,
                  testable pieces. This <strong>Problem Solver</strong> philosophy extends to my component architecture, where
                  I prioritize composition over inheritance and leverage React's built-in patterns
                  for optimal performance:
                </CardText>

                <CanvasCodeSnippet
                  title="Custom Hook Example"
                  animated
                  animationSpeed={25}
                  code={`const useTheme = () => {
  const [isDark, setIsDark] = useState(false);
  
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    setIsDark(stored === 'dark');
  }, []);
  
  const toggleTheme = useCallback(() => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  }, [isDark]);
  
  return { isDark, toggleTheme };
};`}
                />

                <InfoCard theme={theme}>
                  <h3>Why I Like This Pattern</h3>
                  <ul>
                    <li>✓ Separation of concerns — logic stays in the hook</li>
                    <li>✓ Reusable across multiple components</li>
                    <li>✓ Easy to test in isolation</li>
                    <li>✓ Performance optimized with useCallback</li>
                  </ul>
                  <p className="info-text">
                    This approach is used throughout my{' '}
                    <Link to="/projects/" title="View my complete portfolio of development projects" style={{ color: theme?.mode === 'dark' ? '#f48fb1' : '#e91e63', fontWeight: 'bold', textDecoration: 'underline' }}>
                      portfolio projects
                    </Link>{' '}
                    to ensure maintainable and scalable React applications. As a <strong>Node.js Expert</strong>, I apply similar patterns on the backend, ensuring clean separation of concerns between frontend and server logic. By extracting logic into
                    custom hooks, I create reusable pieces that can be easily unit tested, reduce
                    component complexity, and follow the single responsibility principle. This <strong>Full Stack Developer</strong> pattern
                    has proven invaluable in large-scale applications where state management and
                    side effects need to be carefully orchestrated across multiple components.
                  </p>
                </InfoCard>
              </Card>
            </TwoColumnGrid>
          </Container>
        </ContentSection>
      </PageTransition>
    </Layout>
  );
};

export default IndexPage;
