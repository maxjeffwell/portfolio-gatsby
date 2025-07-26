import React, { useMemo } from 'react';
import { Link } from 'gatsby';
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  Card,
  CardContent,
  useTheme as useMuiTheme,
  NoSsr,
  Grid,
} from '@mui/material';
import { ArrowForward, CheckCircle, Computer, LightbulbOutlined } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

import Layout from '../components/layout';
import SEO from '../components/seo';
import TypingAnimation from '../components/TypingAnimation';
import CodeSnippet from '../components/CodeSnippet';
import useScrollAnimation from '../hooks/useScrollAnimation';
import CTASection from '../components/CTASection';

const HeroSection = styled('div')(({ theme }) => ({
  padding: theme.spacing(6, 4),
  textAlign: 'center',
  background: '#e8eaf6',
  borderRadius: theme.shape.borderRadius * 3,
  marginBottom: theme.spacing(4),
  position: 'relative',
  overflow: 'hidden',
  contain: 'layout style',
  willChange: 'auto',
  boxShadow:
    '0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(4, 2),
  },
}));

const GradientText = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: '#1565c0',
  display: 'inline-block',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 30,
  padding: theme.spacing(1.5, 4),
  fontSize: '1.1rem',
  textTransform: 'none',
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  color: theme.palette.common.white,
  boxShadow: theme.shadows[4],
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[8],
  },
}));

const FloatingShape = styled(Box)(({ theme }) => ({
  position: 'absolute',
  borderRadius: '50%',
  opacity: 0.1,
  animation: 'float 6s ease-in-out infinite',
  willChange: 'transform',
  '@keyframes float': {
    '0%, 100%': {
      transform: 'translateY(0) rotate(0deg)',
    },
    '50%': {
      transform: 'translateY(-20px) rotate(180deg)',
    },
  },
}));

const IndexPage = React.memo(function IndexPage() {
  const muiTheme = useMuiTheme();
  const [headerRef, headerVisible] = useScrollAnimation({ delay: 0, startVisible: true });
  const [introRef, introVisible] = useScrollAnimation({ delay: 50, startVisible: true });
  const [navRef, navVisible] = useScrollAnimation({ delay: 100, startVisible: true });
  const [codeRef, codeVisible] = useScrollAnimation({ delay: 150 });
  const [ctaRef, ctaVisible] = useScrollAnimation({ delay: 200 });
  
  // Memoize expensive computations
  const heroStyles = useMemo(() => ({
    background: '#e8eaf6',
    borderRadius: muiTheme.shape.borderRadius * 3,
  }), [muiTheme.shape.borderRadius]);
  
  const typingTexts = useMemo(() => [
    'React Specialist',
    'Full Stack Developer',
    'Node.js Expert',
    'GraphQL Enthusiast',
    'JAMstack Architect',
    'Problem Solver',
  ], []);

  return (
    <Layout>
      <SEO
        title="Home"
        description="Jeff Maxwell - Full Stack Web Developer specializing in React, Node.js, and modern web development. Explore my portfolio of innovative projects and development solutions."
        pathname="/"
        keywords={[
          `full stack developer`,
          `web developer`,
          `react developer`,
          `node.js developer`,
          `javascript developer`,
          `portfolio`,
          `Jeff Maxwell`,
          `frontend development`,
          `backend development`,
          `web development`,
        ]}
      />
      <Container maxWidth="lg">
        <Box component="section" role="banner" aria-labelledby="hero-title" ref={headerRef}>
          <HeroSection>
            <NoSsr fallback={null}>
              <FloatingShape
                sx={{
                  width: 60,
                  height: 60,
                  background: muiTheme.palette.primary.main,
                  top: '20%',
                  right: '10%',
                }}
              />
              <FloatingShape
                sx={{
                  width: 40,
                  height: 40,
                  background: muiTheme.palette.secondary.main,
                  bottom: '15%',
                  left: '8%',
                  borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
                }}
              />
            </NoSsr>
            <Typography variant="body1" color="text.primary" sx={{ mb: 2, fontSize: '1.25rem', fontWeight: 500 }}>
              My name's Jeff.
            </Typography>
            <GradientText variant="h1" gutterBottom sx={{ minHeight: '4.5rem' }} id="hero-title">
              I'm a{' '}
              <Box
                component="span"
                sx={{
                  color: muiTheme.palette.primary.main,
                  fontWeight: 'bold',
                  position: 'relative',
                  display: 'inline-block',
                  width: '320px',
                  minHeight: '1.2em',
                  textAlign: 'left',
                  fontSize: '0.6em',
                }}
              >
                <Box
                  component="span"
                  sx={{
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
                </Box>
                <NoSsr fallback={null}>
                  <Box
                    component="span"
                    sx={{ position: 'absolute', left: 0, top: 0, width: '100%' }}
                  >
                    <TypingAnimation
                      texts={typingTexts}
                      typeSpeed={60}
                      deleteSpeed={30}
                      delayBetweenTexts={1200}
                      loop
                      startDelay={100}
                    />
                  </Box>
                </NoSsr>
              </Box>
            </GradientText>
            <Typography
              variant="body1"
              color="text.primary"
              sx={{ mt: 2, minHeight: '1.75rem', fontSize: '1.125rem', fontWeight: 400 }}
            >
              crafting exceptional web experiences
            </Typography>
          </HeroSection>
        </Box>

        <Box component="section" aria-labelledby="intro-title" ref={introRef} sx={{ mb: 4, minHeight: '240px' }}>
          <Card
            elevation={2}
            sx={{
              borderRadius: 3,
              overflow: 'visible',
              opacity: introVisible ? 1 : 0.8,
              transform: introVisible ? 'translateY(0)' : 'translateY(10px)',
              transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h2" id="intro-title" sx={{ position: 'absolute', left: '-10000px', width: '1px', height: '1px', overflow: 'hidden' }}>
                About My Development Philosophy
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LightbulbOutlined
                  sx={{ fontSize: 40, color: muiTheme.palette.primary.main, mr: 2 }}
                />
                <Typography variant="body1" sx={{ fontSize: '1.25rem', lineHeight: 1.6 }}>
                  I believe in <strong>clean, maintainable code</strong> and{' '}
                  <strong>user-centered design</strong>. Every line I write is crafted with
                  performance, accessibility, and scalability in mind.
                </Typography>
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontStyle: 'italic', mt: 2 }}
              >
                "Code is like humor. When you have to explain it, it's bad." — That's why I focus on
                intuitive, self-documenting solutions.
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box component="section" aria-labelledby="cta-title" ref={navRef} sx={{ mb: 6, textAlign: 'center', minHeight: '64px' }}>
          <Typography variant="h2" id="cta-title" sx={{ position: 'absolute', left: '-10000px', width: '1px', height: '1px', overflow: 'hidden' }}>
            Portfolio Navigation
          </Typography>
          <div style={{ opacity: navVisible ? 1 : 0.9, transition: 'opacity 0.2s ease-out' }}>
            <StyledButton component={Link} to="/projects/" endIcon={<ArrowForward />} size="large">
              View My Projects
            </StyledButton>
          </div>
        </Box>

        <Box component="section" aria-labelledby="content-sections-title">
          <Typography variant="h2" id="content-sections-title" sx={{ position: 'absolute', left: '-10000px', width: '1px', height: '1px', overflow: 'hidden' }}>
            Featured Content
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box component="article" aria-labelledby="beyond-code-title" sx={{ opacity: introVisible ? 1 : 0, transition: 'opacity 0.6s ease-out' }}>
                <Card
                elevation={2}
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  background:
                    muiTheme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, rgba(30,30,30,0.95) 0%, rgba(45,45,45,0.9) 100%)'
                      : 'linear-gradient(135deg, rgba(240,240,240,0.95) 0%, rgba(250,250,250,0.9) 100%)',
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="h3"
                    color="secondary"
                    gutterBottom
                    id="beyond-code-title"
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <Box
                      component="span"
                      sx={{
                        mr: 2,
                        width: 24,
                        height: 24,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      aria-hidden="true"
                    >
                      🐾
                    </Box>
                    Beyond the Code
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3 }}>
                    When I'm not crafting pixel-perfect interfaces or debugging complex algorithms,
                    you'll find me negotiating dinner arrangements with my two demanding canine
                    project managers — they're surprisingly good at code reviews!
                  </Typography>
                  <Button
                    component={Link}
                    to="/about/"
                    color="secondary"
                    sx={{ textTransform: 'none' }}
                  >
                    Meet my development team and learn more about me
                  </Button>
                </CardContent>
              </Card>
            </Box>
          </Grid>

          <Grid item xs={12} md={6} ref={codeRef}>
            <Box component="article" aria-labelledby="code-philosophy-title" sx={{ opacity: codeVisible ? 1 : 0, transition: 'opacity 0.6s ease-out' }}>
              <Card
                elevation={2}
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    height: 4,
                    background: `linear-gradient(90deg, ${muiTheme.palette.primary.main}, ${muiTheme.palette.secondary.main})`,
                  }}
                />
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="h3"
                    gutterBottom
                    id="code-philosophy-title"
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <Computer sx={{ mr: 2 }} />
                    Code Philosophy
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Clean, readable, and maintainable — here's how I approach modern React
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
                  <Paper
                    sx={{
                      mt: 3,
                      p: 2,
                      borderLeft: `4px solid ${muiTheme.palette.secondary.main}`,
                      backgroundColor: muiTheme.palette.action.hover,
                    }}
                  >
                    <Typography variant="h4" color="secondary" gutterBottom>
                      Why I Like This Pattern
                    </Typography>
                    <Box component="ul" sx={{ pl: 0, m: 0, listStyle: 'none' }}>
                      {[
                        'Separation of concerns — logic stays in the hook',
                        'Reusable across multiple components',
                        'Easy to test in isolation',
                        'Performance optimized with useCallback',
                      ].map((text, index) => (
                        <Box
                          key={index}
                          component="li"
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mb: 0.5,
                          }}
                        >
                          <CheckCircle fontSize="small" color="secondary" sx={{ mr: 1 }} />
                          <Typography variant="body2">{text}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </Paper>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>
        </Box>

        <Box component="section" aria-labelledby="cta-section-title" ref={ctaRef} sx={{ mt: 6 }}>
          <Typography variant="h2" id="cta-section-title" sx={{ position: 'absolute', left: '-10000px', width: '1px', height: '1px', overflow: 'hidden' }}>
            Contact and Call to Action
          </Typography>
          <CTASection visible={ctaVisible} />
        </Box>
      </Container>
    </Layout>
  );
});

export default IndexPage;
