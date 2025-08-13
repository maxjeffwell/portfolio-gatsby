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
import SocialShare from '../components/SocialShare';

// Helper functions for theme-based styling
const getHeroSectionBackground = (theme) => {
  if (theme?.mode === 'dark') {
    return 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)';
  }
  return 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';
};

const getHeroTitleColor = (theme) => {
  if (theme?.mode === 'dark') {
    return '#ffffff';
  }
  if (theme?.mode === 'light') {
    return '#333';
  }
  return 'var(--text-color)';
};

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
  background: ${(props) => getHeroSectionBackground(props.theme)};
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
  color: ${(props) => getHeroTitleColor(props.theme)};
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
  font-size: 1.125rem;
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
  font-size: 1.375rem;
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

// Styled components for custom classes
const HeroIntro = styled.p`
  font-size: clamp(1.5rem, 4vw, 2rem);
  margin: 0 0 clamp(12px, 3vw, 16px) 0;
  color: ${(props) => (props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : '#666')};
  transition: color 0.3s ease;
  font-weight: 700;
`;

const CardLink = styled(Link)`
  color: #e91e63;
  text-transform: none;
  font-size: clamp(1.25rem, 4vw, 1.375rem);
  font-weight: 500;
  padding: 8px 16px;
  display: inline-block;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #ad1457;
  }
`;

const HeroQuote = styled.p`
  font-size: clamp(1.125rem, 3vw, 1.375rem);
  line-height: 1.6;
  color: ${(props) => (props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : '#777')};
  margin-bottom: clamp(24px, 6vw, 40px);
  transition: color 0.3s ease;
  padding: 0 8px;
`;

const InfoText = styled.p`
  margin-top: 16px;
  font-size: 1.0625rem;
  line-height: 1.5;
`;

const CtaButton = styled(Link)`
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

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
  }
`;

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
        <HeroSection theme={theme} as="section" aria-labelledby="hero-title" id="home">
          <Container>
            <StaggeredAnimation>
              <HeroIntro theme={theme}>My name&#39;s Jeff</HeroIntro>
              <HeroTitle theme={theme} as="h1" id="hero-title">
                I&#39;m a{' '}
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
              <HeroSubtitle theme={theme}>
                Full Stack Web Developer crafting exceptional React & Node.js applications with
                modern technologies
              </HeroSubtitle>

              <QuoteBox theme={theme}>
                I believe in <strong>clean, maintainable code</strong> and{' '}
                <strong>user-centered design</strong>. As a developer, I focus on crafting every
                line with performance, accessibility, and scalability in mind. Check out my{' '}
                <Link
                  to="/projects/"
                  title="View my featured development projects and portfolio"
                  style={{ color: 'inherit', fontWeight: 'bold', textDecoration: 'underline' }}
                >
                  featured projects
                </Link>{' '}
                to see these principles in action, or{' '}
                <Link
                  to="/about/"
                  title="Learn more about my development background and experience"
                  style={{ color: 'inherit', fontWeight: 'bold', textDecoration: 'underline' }}
                >
                  read more about my approach
                </Link>
                .
              </QuoteBox>

              <HeroQuote theme={theme}>
                "Code is like humor. When you have to explain it, it's bad." — That's why I focus on
                intuitive, self-documenting solutions. Ready to discuss your next project?{' '}
                <Link
                  to="/contact/"
                  title="Get in touch to discuss your next project"
                  style={{
                    color: theme?.mode === 'dark' ? '#90caf9' : '#1565c0',
                    fontWeight: 'bold',
                    textDecoration: 'underline',
                  }}
                >
                  Let&#39;s connect
                </Link>
                .
              </HeroQuote>

              <CtaButton to="/projects/" title="View my featured development projects">
                View My Projects →
              </CtaButton>
            </StaggeredAnimation>
          </Container>
        </HeroSection>

        {/* Content Section */}
        <ContentSection id="about-developer">
          <Container>
            <TwoColumnGrid>
              {/* Beyond the Code */}
              <Card theme={theme} as="article">
                <CardTitle theme={theme} as="h2">
                  <ClientOnlyIcon
                    iconName="Paws"
                    fontSize="140px"
                    style={{ marginRight: '8px', color: '#007bff' }}
                  />{' '}
                  Full Stack Developer Beyond the Code
                </CardTitle>
                <CardText theme={theme}>
                  When I&#39;m not crafting pixel-perfect interfaces or debugging complex
                  algorithms, algorithms, you&#39;ll find me negotiating dinner arrangements with my
                  two demanding project managers — they&#39;re surprisingly good at code reviews! My
                  approach to development extends beyond just writing code; it&#39;s about
                  understanding user needs, anticipating edge cases, and building solutions that
                  scale gracefully.
                  <br />
                  <br />
                  I&#39;m passionate about continuous learning, whether it&#39;s exploring emerging
                  frameworks like Next.js and Astro, optimizing performance bottlenecks with
                  advanced webpack configurations, or contributing to open-source projects that
                  benefit the developer community. My experience spans across various industries,
                  from e-learning platforms and social networking applications to enterprise-level
                  APIs and microservices architectures. View my{' '}
                  <Link
                    to="/projects/"
                    title="Explore my portfolio of full stack development projects"
                    style={{
                      color: theme?.mode === 'dark' ? '#90caf9' : '#1565c0',
                      fontWeight: 'bold',
                      textDecoration: 'underline',
                    }}
                  >
                    complete project portfolio
                  </Link>{' '}
                  to see these diverse applications in action.
                  <br />
                  <br />
                  When not coding, I enjoy participating in code reviews and staying current with
                  industry trends through tech conferences and developer meetups. This balance of
                  technical expertise and community involvement keeps me grounded and continuously
                  improving my craft. Want to{' '}
                  <Link
                    to="/contact/"
                    title="Contact Jeff Maxwell for your next development project"
                    style={{
                      color: theme?.mode === 'dark' ? '#f48fb1' : '#e91e63',
                      fontWeight: 'bold',
                      textDecoration: 'underline',
                    }}
                  >
                    work together
                  </Link>{' '}
                  or learn more about my{' '}
                  <Link
                    to="/about/"
                    title="Learn more about Jeff's development philosophy and approach"
                    style={{
                      color: theme?.mode === 'dark' ? '#f48fb1' : '#e91e63',
                      fontWeight: 'bold',
                      textDecoration: 'underline',
                    }}
                  >
                    development philosophy
                  </Link>
                  ?
                </CardText>
                <CardLink to="/about/" title="Learn more about Jeff Maxwell's development approach">
                  Meet my development team and learn more about me →
                </CardLink>
              </Card>

              {/* Code Philosophy */}
              <Card theme={theme} as="article" id="development-philosophy">
                <CardTitle theme={theme} as="h2">
                  <ClientOnlyIcon
                    iconName="Computer"
                    fontSize="110px"
                    style={{ marginRight: '8px', color: '#007bff' }}
                  />{' '}
                  React Developer Code Philosophy
                </CardTitle>
                <CardText theme={theme}>
                  Clean, readable, and maintainable — here&#39;s how I approach modern React
                  development. I believe in writing code that tells a story, where each function has
                  a single responsibility and complex logic is broken down into digestible, testable
                  pieces. This philosophy extends to my component architecture, where I prioritize
                  composition over inheritance and leverage React&#39;s built-in patterns for
                  performance:
                  <br />
                  <br />
                  My development workflow incorporates modern tooling including TypeScript for type
                  safety, ESLint and Prettier for code consistency, and comprehensive testing with
                  Jest and React Testing Library. I implement responsive design with CSS-in-JS
                  solutions like Styled Components and Emotion, ensuring cross-browser compatibility
                  and mobile-first approaches that deliver exceptional user experiences across all
                  devices and screen sizes. Learn more about my{' '}
                  <Link
                    to="/about/"
                    title="Discover my development workflow and methodologies"
                    style={{
                      color: theme?.mode === 'dark' ? '#90caf9' : '#1565c0',
                      fontWeight: 'bold',
                      textDecoration: 'underline',
                    }}
                  >
                    development methodologies
                  </Link>{' '}
                  and process.
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
                  <InfoText>
                    This approach is used throughout my{' '}
                    <Link
                      to="/projects/"
                      title="View my complete portfolio of development projects"
                      style={{
                        color: theme?.mode === 'dark' ? '#f48fb1' : '#e91e63',
                        fontWeight: 'bold',
                        textDecoration: 'underline',
                      }}
                    >
                      portfolio projects
                    </Link>{' '}
                    to ensure maintainable and scalable React applications. On the backend, I apply
                    similar patterns, ensuring clean separation of concerns between frontend and
                    server logic. By extracting logic into custom hooks, I create reusable pieces
                    that can be easily unit tested, reduce component complexity, and follow the
                    single responsibility principle. This development approach has proven invaluable
                    in large-scale applications where state management and side effects need to be
                    carefully orchestrated across multiple components.{' '}
                    <Link
                      to="/contact/"
                      title="Hire Jeff Maxwell for your next development project"
                      style={{
                        color: theme?.mode === 'dark' ? '#f48fb1' : '#e91e63',
                        fontWeight: 'bold',
                        textDecoration: 'underline',
                      }}
                    >
                      Let&#39;s discuss your project
                    </Link>
                    .
                  </InfoText>
                </InfoCard>
              </Card>
            </TwoColumnGrid>
          </Container>
        </ContentSection>

        {/* Technologies & Expertise Section */}
        <ContentSection
          theme={theme}
          as="section"
          aria-labelledby="technologies-heading"
          id="technologies"
        >
          <Container>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h3
                style={{
                  fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                  fontWeight: 600,
                  color: theme?.mode === 'dark' ? '#ffffff' : '#333',
                  margin: '0 0 16px 0',
                }}
              >
                Web Developer Portfolio - Modern JavaScript Technologies
              </h3>
              <p
                style={{
                  fontSize: '1.25rem',
                  color: theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : '#666',
                  margin: '0 0 32px 0',
                  textAlign: 'center',
                }}
              >
                Explore my expertise across the full development stack. Want to{' '}
                <Link
                  to="/contact/"
                  title="Contact Jeff Maxwell to discuss your next project"
                  style={{
                    color: theme?.mode === 'dark' ? '#90caf9' : '#1565c0',
                    fontWeight: 'bold',
                    textDecoration: 'underline',
                  }}
                >
                  start a project
                </Link>{' '}
                or learn more{' '}
                <Link
                  to="/about/"
                  title="Learn more about Jeff's development experience"
                  style={{
                    color: theme?.mode === 'dark' ? '#90caf9' : '#1565c0',
                    fontWeight: 'bold',
                    textDecoration: 'underline',
                  }}
                >
                  about my experience
                </Link>
                ?
              </p>
            </div>
            <TwoColumnGrid>
              {/* Frontend Technologies */}
              <Card theme={theme} as="article">
                <CardTitle theme={theme} as="h2" id="technologies-heading">
                  <ClientOnlyIcon
                    iconName="React"
                    fontSize="110px"
                    style={{ marginRight: '8px', color: '#61dafb' }}
                  />{' '}
                  JavaScript Developer Frontend Technologies
                </CardTitle>
                <CardText theme={theme}>
                  My frontend expertise encompasses the latest React ecosystem, including React 18
                  with Concurrent Features, Server Components, and Suspense for optimal performance.
                  I leverage modern state management solutions like Zustand, Redux Toolkit, and
                  React Query for efficient data fetching and caching strategies. Curious about my{' '}
                  <Link
                    to="/about/"
                    title="Learn about my technical background and expertise"
                    style={{
                      color: theme?.mode === 'dark' ? '#90caf9' : '#1565c0',
                      fontWeight: 'bold',
                      textDecoration: 'underline',
                    }}
                  >
                    technical background
                  </Link>
                  ?
                  <br />
                  <br />
                  Advanced CSS techniques include CSS Grid, Flexbox, and custom properties (CSS
                  variables) for maintainable styling systems. I implement design systems using
                  Storybook, ensuring consistent UI components across large-scale applications.
                  Build tools like Vite, Webpack, and Parcel are integral to my development process,
                  enabling optimized bundle sizes and lightning-fast development experiences. See
                  these technologies in action in my{' '}
                  <Link
                    to="/projects/"
                    title="Browse my React and frontend development projects"
                    style={{
                      color: theme?.mode === 'dark' ? '#90caf9' : '#1565c0',
                      fontWeight: 'bold',
                      textDecoration: 'underline',
                    }}
                  >
                    React projects
                  </Link>
                  .
                </CardText>
              </Card>

              {/* Backend & Infrastructure */}
              <Card theme={theme} as="article">
                <CardTitle theme={theme} as="h2">
                  <ClientOnlyIcon
                    iconName="NodeJS"
                    fontSize="110px"
                    style={{ marginRight: '8px', color: '#68a063' }}
                  />{' '}
                  Node.js Developer Backend & Infrastructure
                </CardTitle>
                <CardText theme={theme}>
                  On the backend, I specialize in Node.js microservices architecture using
                  Express.js, Fastify, and NestJS frameworks. Database expertise includes PostgreSQL
                  for relational data, MongoDB for document storage, and Redis for caching and
                  session management. I implement robust API designs following OpenAPI
                  specifications and GraphQL schemas.
                  <br />
                  <br />
                  Cloud infrastructure experience spans AWS services (EC2, Lambda, S3, RDS), Docker
                  containerization, and Kubernetes orchestration. CI/CD pipelines using GitHub
                  Actions, Jenkins, and GitLab CI ensure reliable deployments with comprehensive
                  testing coverage including unit, integration, and end-to-end testing suites with
                  Cypress and Playwright. Interested in working together?{' '}
                  <Link
                    to="/contact/"
                    title="Get in touch for your next development project"
                    style={{
                      color: theme?.mode === 'dark' ? '#f48fb1' : '#e91e63',
                      fontWeight: 'bold',
                      textDecoration: 'underline',
                    }}
                  >
                    Let&#39;s discuss your project
                  </Link>{' '}
                  or{' '}
                  <Link
                    to="/projects/"
                    title="View my backend and infrastructure projects"
                    style={{
                      color: theme?.mode === 'dark' ? '#f48fb1' : '#e91e63',
                      fontWeight: 'bold',
                      textDecoration: 'underline',
                    }}
                  >
                    see my backend projects
                  </Link>
                  .
                </CardText>
              </Card>
            </TwoColumnGrid>
          </Container>
        </ContentSection>

        {/* Social Sharing Section */}
        <ContentSection theme={theme} as="section" aria-labelledby="social-share" id="share">
          <Container>
            <SocialShare
              url={
                typeof window !== 'undefined' && window.location
                  ? window.location.href
                  : 'https://el-jefe.me'
              }
              title="Jeff Maxwell - Full Stack React & Node.js Developer"
              description="Experienced full stack developer specializing in React, Node.js, and modern web technologies. View my portfolio and get in touch!"
            />
          </Container>
        </ContentSection>
      </PageTransition>
    </Layout>
  );
};

export default IndexPage;
