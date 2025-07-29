import React, { useMemo } from 'react';
import { Link } from 'gatsby';
import {
  Typography,
  Button,
  useTheme as useMuiTheme,
  NoSsr,
} from '@mui/material';
import { ArrowForward, CheckCircle, Computer, LightbulbOutlined } from '@mui/icons-material';
import styled from '@emotion/styled';

import Layout from '../components/layout';
import SEO from '../components/seo';
import TypingAnimation from '../components/TypingAnimation';
import CodeSnippet from '../components/CodeSnippet';
import useScrollAnimation from '../hooks/useScrollAnimation';
import CTASection from '../components/CTASection';

const StyledContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;

  @media (max-width: 600px) {
    padding: 0 16px;
  }
`;

const StyledBox = styled.div`
  margin-bottom: ${(props) => (props.mb ? `${props.mb * 8}px` : '0')};
  margin-top: ${(props) => (props.mt ? `${props.mt * 8}px` : '0')};
  text-align: ${(props) => props.textAlign || 'inherit'};
  display: ${(props) => props.display || 'block'};
  flex-direction: ${(props) => props.flexDirection || 'row'};
  align-items: ${(props) => props.alignItems || 'stretch'};
  gap: ${(props) => (props.gap ? `${props.gap * 8}px` : '0')};
  padding: ${(props) => (props.p ? `${props.p * 8}px` : '0')};
  padding-top: ${(props) => (props.pt ? `${props.pt * 8}px` : 'inherit')};
  padding-bottom: ${(props) => (props.pb ? `${props.pb * 8}px` : 'inherit')};
  border-radius: ${(props) => (props.borderRadius ? `${props.borderRadius * 8}px` : '0')};
  overflow: ${(props) => props.overflow || 'visible'};
  position: ${(props) => props.position || 'static'};
  min-height: ${(props) => props.minHeight || 'auto'};
  background-color: ${(props) =>
    props.bgColor === 'hover' ? 'rgba(0, 0, 0, 0.04)' : 'transparent'};
  height: ${(props) => props.height || 'auto'};
  width: ${(props) => props.width || 'auto'};
  left: ${(props) => props.left || 'auto'};
  font-size: ${(props) => props.fontSize || 'inherit'};
  max-width: ${(props) => (props.maxWidth ? `${props.maxWidth}px` : 'none')};
  margin-left: ${(props) => (props.mx === 'auto' ? 'auto' : 'inherit')};
  margin-right: ${(props) => (props.mx === 'auto' ? 'auto' : 'inherit')};
  justify-content: ${(props) => props.justifyContent || 'flex-start'};
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${(props) => (props.spacing ? `${props.spacing * 8}px` : '16px')};

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const GridItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const HeroSection = styled.div`
  padding: 48px 32px;
  text-align: center;
  background: linear-gradient(135deg, #f3e5f5 0%, #e8eaf6 100%);
  border-radius: 24px;
  margin-bottom: 32px;
  position: relative;
  overflow: hidden;
  contain: layout style;
  will-change: auto;
  box-shadow:
    0px 3px 3px -2px rgba(0, 0, 0, 0.2),
    0px 3px 4px 0px rgba(0, 0, 0, 0.14),
    0px 1px 8px 0px rgba(0, 0, 0, 0.12);

  @media (max-width: 600px) {
    padding: 32px 16px;
  }

  @media (max-width: 360px) {
    padding: 24px 12px;
    margin-bottom: 24px;
    border-radius: 16px;
  }
`;

const GradientText = styled(Typography)`
  && {
    background: linear-gradient(45deg, #fc4a1a, #f7b733) !important;
    background-clip: text !important;
    -webkit-background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
    -moz-text-fill-color: transparent !important;
    display: inline-block;
    font-weight: bold;
    /* Fallback for SSR and no support */
    color: #fc4a1a;
    
    @supports (background-clip: text) or (-webkit-background-clip: text) {
      color: transparent !important;
    }
  }
`;

const TypingTextWrapper = styled.span`
  && {
    background: linear-gradient(45deg, #1565c0, #42a5f5) !important;
    background-clip: text !important;
    -webkit-background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
    -moz-text-fill-color: transparent !important;
    font-weight: bold;
    position: relative;
    display: inline-block;
    width: 320px;
    min-height: 1.2em;
    text-align: left;
    font-size: 0.6em;
    /* Fallback for SSR */
    color: #1565c0;
    
    @supports (background-clip: text) or (-webkit-background-clip: text) {
      color: transparent !important;
    }
  }
`;

const StyledButton = styled(Button)`
  && {
    border-radius: 30px !important;
    padding: 12px 32px !important;
    font-size: 1.1rem !important;
    text-transform: none !important;
    background: #7c4dff !important;
    background-image: linear-gradient(135deg, #7c4dff 0%, #b388ff 100%) !important;
    color: white !important;
    box-shadow:
      0px 2px 4px -1px rgba(0, 0, 0, 0.2),
      0px 4px 5px 0px rgba(0, 0, 0, 0.14),
      0px 1px 10px 0px rgba(0, 0, 0, 0.12) !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      transform: translateY(-2px) !important;
      background: #651fff !important;
      background-image: linear-gradient(135deg, #651fff 0%, #9c64ff 100%) !important;
      box-shadow:
        0px 5px 5px -3px rgba(0, 0, 0, 0.2),
        0px 8px 10px 1px rgba(0, 0, 0, 0.14),
        0px 3px 14px 2px rgba(0, 0, 0, 0.12) !important;
    }
  }
`;

const StyledCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12);
  overflow: hidden;
  transition: opacity 0.3s ease-out, transform 0.3s ease-out;
  
  @media (prefers-color-scheme: dark) {
    background: #1a1a1a;
  }
`;

const StyledCardContent = styled.div`
  padding: 32px;
`;

const StyledPaper = styled.div`
  background-color: #ffffff;
  color: rgba(0, 0, 0, 0.87);
  transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  border-radius: 4px;
  box-shadow: 0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12);
  
  @media (prefers-color-scheme: dark) {
    background-color: #424242;
    color: rgba(255, 255, 255, 0.87);
  }
`;

const FloatingShape = styled.div`
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  animation: float 6s ease-in-out infinite;
  will-change: transform;

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

const IndexPage = React.memo(() => {
  const muiTheme = useMuiTheme();
  const [headerRef] = useScrollAnimation({ delay: 0, startVisible: true });
  const [introRef, introVisible] = useScrollAnimation({ delay: 50, startVisible: true });
  const [navRef, navVisible] = useScrollAnimation({ delay: 100, startVisible: true });
  const [codeRef, codeVisible] = useScrollAnimation({ delay: 150 });
  const [ctaRef, ctaVisible] = useScrollAnimation({ delay: 200 });

  const typingTexts = useMemo(
    () => [
      'React Specialist',
      'Full Stack Developer',
      'Node.js Expert',
      'GraphQL Enthusiast',
      'JAMstack Architect',
      'Problem Solver',
    ],
    []
  );

  return (
    <Layout>
      <SEO
        title="Home"
        description="Full Stack React & Node.js Developer. Modern web applications, innovative projects, and scalable solutions. View portfolio and hire for freelance work."
        pathname="/"
        keywords={[
          `full stack developer`,
          `react developer`,
          `node.js developer`,
          `javascript developer`,
          `web developer portfolio`,
          `mern stack developer`,
          `react specialist`,
          `modern web development`,
          `frontend developer`,
          `backend developer`,
          `Jeff Maxwell`,
          `JAMstack developer`,
          `graphql developer`,
          `experienced react developer`,
          `professional web developer`,
          `hire react developer`,
        ]}
      />
      <StyledContainer>
        <StyledBox component="section" role="banner" aria-labelledby="hero-title" ref={headerRef}>
          <HeroSection className="hero-section">
            <FloatingShape
              style={{
                width: 200,
                height: 200,
                background: 'rgba(252, 74, 26, 0.08)',
                top: '-50px',
                left: '-50px',
              }}
            />
            <FloatingShape
              style={{
                width: 150,
                height: 150,
                background: 'rgba(124, 77, 255, 0.08)',
                bottom: '-40px',
                right: '-40px',
              }}
            />
            <FloatingShape
              style={{
                width: 120,
                height: 120,
                background: 'rgba(252, 74, 26, 0.1)',
                top: '10%',
                right: '5%',
              }}
            />
            <FloatingShape
              style={{
                width: 80,
                height: 80,
                background: 'rgba(247, 183, 51, 0.1)',
                bottom: '20%',
                left: '5%',
              }}
            />
            <Typography
              variant="body1"
              style={{
                marginBottom: 16,
                fontSize: '1.25rem',
                fontWeight: 500,
                color: 'rgba(0, 0, 0, 0.87)',
              }}
            >
              My name&apos;s Jeff 😏
            </Typography>
            <GradientText variant="h1" gutterBottom style={{ minHeight: '4.5rem' }} id="hero-title" className="gradient-text">
              I&apos;m a{' '}
              <TypingTextWrapper className="typing-text-wrapper">
                <StyledBox
                  component="span"
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    pointerEvents: 'none',
                    visibility: 'hidden',
                    fontSize: 'inherit',
                  }}
                  aria-hidden="true"
                >
                  JAMstack Architect
                </StyledBox>
                  <StyledBox
                    component="span"
                    style={{ position: 'absolute', left: 0, top: 0, width: '100%' }}
                  >
                    <TypingAnimation
                      texts={typingTexts}
                      typeSpeed={60}
                      deleteSpeed={30}
                      delayBetweenTexts={1200}
                      loop
                      startDelay={100}
                    />
                  </StyledBox>
              </TypingTextWrapper>
            </GradientText>
            <Typography
              variant="body1"
              style={{
                marginTop: 16,
                minHeight: '1.75rem',
                fontSize: '1.125rem',
                fontWeight: 400,
                color: 'rgba(0, 0, 0, 0.87)',
              }}
            >
              crafting exceptional web experiences
            </Typography>
          </HeroSection>
        </StyledBox>

        <StyledBox
          component="section"
          aria-labelledby="intro-title"
          ref={introRef}
          mb={4}
          style={{ minHeight: '240px' }}
        >
          <StyledCard
            className="styled-card"
            style={{
              overflow: 'visible',
              opacity: introVisible ? 1 : 0.8,
              transform: introVisible ? 'translateY(0)' : 'translateY(10px)',
            }}
          >
            <StyledCardContent>
              <Typography
                variant="h2"
                id="intro-title"
                style={{
                  position: 'absolute',
                  left: '-10000px',
                  width: '1px',
                  height: '1px',
                  overflow: 'hidden',
                }}
              >
                About My Development Philosophy
              </Typography>
              <StyledBox display="flex" alignItems="center" mb={2}>
                <LightbulbOutlined
                  style={{ fontSize: 40, color: '#1976d2', marginRight: 16 }}
                />
                <Typography variant="body1" style={{ fontSize: '1.25rem', lineHeight: 1.6 }}>
                  I believe in <strong>clean, maintainable code</strong> and{' '}
                  <strong>user-centered design</strong>. Every line I write is crafted with
                  performance, accessibility, and scalability in mind.
                </Typography>
              </StyledBox>
              <Typography
                variant="body2"
                color="text.secondary"
                style={{ fontStyle: 'italic', mt: 2 }}
              >
                &quot;Code is like humor. When you have to explain it, it&apos;s bad.&quot; —
                That&apos;s why I focus on intuitive, self-documenting solutions.
              </Typography>
            </StyledCardContent>
          </StyledCard>
        </StyledBox>

        <StyledBox
          component="section"
          aria-labelledby="cta-title"
          ref={navRef}
          mb={6}
          textAlign="center"
          style={{ minHeight: '64px' }}
        >
          <Typography
            variant="h2"
            id="cta-title"
            style={{
              position: 'absolute',
              left: '-10000px',
              width: '1px',
              height: '1px',
              overflow: 'hidden',
            }}
          >
            Portfolio Navigation
          </Typography>
          <div style={{ opacity: navVisible ? 1 : 0.9, transition: 'opacity 0.2s ease-out' }}>
            <StyledButton component={Link} to="/projects/" endIcon={<ArrowForward />} size="large" className="styled-button">
              View My Projects
            </StyledButton>
          </div>
        </StyledBox>

        <StyledBox component="section" aria-labelledby="content-sections-title">
          <Typography
            variant="h2"
            id="content-sections-title"
            style={{
              position: 'absolute',
              left: '-10000px',
              width: '1px',
              height: '1px',
              overflow: 'hidden',
            }}
          >
            Featured Content
          </Typography>
          <GridContainer spacing={4}>
            <GridItem>
              <StyledBox
                component="article"
                aria-labelledby="beyond-code-title"
                style={{ opacity: introVisible ? 1 : 0, transition: 'opacity 0.6s ease-out' }}
              >
                <StyledCard className="styled-card" style={{ height: '100%' }}>
                  <StyledCardContent>
                    <Typography
                      variant="h3"
                      gutterBottom
                      id="beyond-code-title"
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        color: '#fc4a1a',
                        fontWeight: 600
                      }}
                    >
                      <StyledBox
                        component="span"
                        style={{
                          marginRight: 12,
                          fontSize: '1.5rem',
                        }}
                        aria-hidden="true"
                      >
                        🐾
                      </StyledBox>
                      Beyond the Code
                    </Typography>
                    <Typography variant="body1" style={{ marginBottom: 24 }}>
                      When I&apos;m not crafting pixel-perfect interfaces or debugging complex
                      algorithms, you&apos;ll find me negotiating dinner arrangements with my two
                      demanding canine project managers — they&apos;re surprisingly good at code
                      reviews!
                    </Typography>
                    <Button
                      component={Link}
                      to="/about/"
                      color="secondary"
                      style={{ textTransform: 'none' }}
                    >
                      Meet my development team and learn more about me
                    </Button>
                  </StyledCardContent>
                </StyledCard>
              </StyledBox>
            </GridItem>

            <GridItem ref={codeRef}>
              <StyledBox
                component="article"
                aria-labelledby="code-philosophy-title"
                style={{ opacity: codeVisible ? 1 : 0, transition: 'opacity 0.6s ease-out' }}
              >
                <StyledCard
                  className="styled-card"
                  style={{
                    height: '100%',
                    position: 'relative',
                  }}
                >
                  <StyledBox
                    style={{
                      height: 4,
                      background: 'linear-gradient(90deg, #1565c0, #42a5f5)',
                    }}
                  />
                  <StyledCardContent>
                    <Typography
                      variant="h3"
                      gutterBottom
                      id="code-philosophy-title"
                      style={{ display: 'flex', alignItems: 'center' }}
                    >
                      <Computer style={{ marginRight: 16, color: '#052f5f' }} />
                      Code Philosophy
                    </Typography>
                    <Typography variant="body2" color="text.secondary" style={{ marginBottom: 24 }}>
                      Clean, readable, and maintainable — here&apos;s how I approach modern React
                      development:
                    </Typography>
                    <CodeSnippet
                      title="Custom Hook Example"
                      animated={codeVisible}
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
                    <StyledPaper
                      style={{
                        marginTop: 24,
                        padding: 16,
                        borderLeft: '4px solid #fc4a1a',
                        backgroundColor: 'rgba(252, 74, 26, 0.04)',
                        borderRadius: '8px',
                      }}
                    >
                      <Typography 
                        variant="h4" 
                        gutterBottom
                        style={{ 
                          color: '#fc4a1a',
                          fontWeight: 600
                        }}
                      >
                        Why I Like This Pattern
                      </Typography>
                      <StyledBox
                        component="ul"
                        style={{ paddingLeft: 0, margin: 0, listStyle: 'none' }}
                      >
                        {[
                          'Separation of concerns — logic stays in the hook',
                          'Reusable across multiple components',
                          'Easy to test in isolation',
                          'Performance optimized with useCallback',
                        ].map((text) => (
                          <StyledBox
                            key={text}
                            component="li"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              marginBottom: '4px',
                            }}
                          >
                            <CheckCircle
                              fontSize="small"
                              style={{ 
                                marginRight: 8,
                                color: '#fc4a1a'
                              }}
                            />
                            <Typography variant="body2">{text}</Typography>
                          </StyledBox>
                        ))}
                      </StyledBox>
                    </StyledPaper>
                  </StyledCardContent>
                </StyledCard>
              </StyledBox>
            </GridItem>
          </GridContainer>
        </StyledBox>

        <StyledBox
          component="section"
          aria-labelledby="cta-section-title"
          ref={ctaRef}
          style={{ marginTop: '48px' }}
        >
          <Typography
            variant="h2"
            id="cta-section-title"
            style={{
              position: 'absolute',
              left: '-10000px',
              width: '1px',
              height: '1px',
              overflow: 'hidden',
            }}
          >
            Contact and Call to Action
          </Typography>
          <CTASection visible={ctaVisible} />
        </StyledBox>
      </StyledContainer>
    </Layout>
  );
});

IndexPage.displayName = 'IndexPage';

export default IndexPage;
