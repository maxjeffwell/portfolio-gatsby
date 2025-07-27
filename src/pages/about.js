import React from 'react';
import { Container, Typography, Paper, Box, Card, Fade, Slide, NoSsr, Grid } from '@mui/material';
import { Code as CodeIcon, Coffee, Pets } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { DiIntellij, DiMozilla, DiDebian } from 'react-icons/di';
import { FaPiedPiperAlt } from 'react-icons/fa';

import Layout from '../components/layout';
import SEO from '../components/seo';
import Image from '../components/image';
import Logo from '../components/logo';
import useScrollAnimation from '../hooks/useScrollAnimation';

const GradientText = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  display: 'inline-block',
  willChange: 'transform',
  backfaceVisibility: 'hidden',
  transform: 'translateZ(0)',
  WebkitFontSmoothing: 'antialiased',
}));

const TechSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  background:
    theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(30,30,30,0.95) 0%, rgba(45,45,45,0.9) 100%)'
      : 'linear-gradient(135deg, rgba(240,240,240,0.95) 0%, rgba(250,250,250,0.9) 100%)',
  backdropFilter: 'blur(10px)',
}));

const PersonalCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 3,
  background: `linear-gradient(135deg, ${theme.palette.primary.main}10 0%, ${theme.palette.secondary.main}10 100%)`,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `radial-gradient(circle at 30% 20%, ${theme.palette.primary.main}10 0%, transparent 70%)`,
    zIndex: 0,
  },
  '& > *': {
    position: 'relative',
    zIndex: 1,
  },
}));

const TechCard = styled(Card)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(3, 2),
  height: '100%',
  minHeight: '160px',
  transition:
    'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  willChange: 'transform, box-shadow',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
  },
}));

const InterestItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 1.5,
  backgroundColor: theme.palette.action.hover,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
    transform: 'translateY(-2px)',
  },
}));

const StyledIcon = styled(Box)(({ theme }) => ({
  fontSize: '3.5rem',
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(2),
  transition: 'transform 0.3s ease',
  willChange: 'transform',
  '.MuiCard-root:hover &': {
    transform: 'scale(1.1) rotate(5deg)',
  },
}));

function AboutPage() {
  const [headerRef, headerVisible] = useScrollAnimation({ delay: 100 });
  const [techRef, techVisible] = useScrollAnimation({ delay: 300 });
  const [personalRef, personalVisible] = useScrollAnimation({ delay: 500 });

  return (
    <Layout>
      <SEO
        title="About"
        description="Meet Jeff Maxwell, Full Stack Developer. Technology stack, development process, and the team behind innovative web solutions and modern applications."
        pathname="/about/"
        keywords={[
          `about jeff maxwell`,
          `development team`,
          `web developer bio`,
          `technology stack`,
          `development tools`,
          `full stack developer profile`,
        ]}
      />
      <Container maxWidth="lg">
        <Box component="section" aria-labelledby="about-header" ref={headerRef} sx={{ mb: 6 }}>
          <Fade
            in={headerVisible}
            timeout={600}
            style={{ transitionDelay: headerVisible ? '0ms' : '0ms' }}
          >
            <div style={{ willChange: 'opacity' }}>
              <GradientText
                variant="h2"
                component="h1"
                id="about-header"
                align="center"
                gutterBottom
                sx={{ fontSize: { xs: '2.125rem', sm: '3rem', md: '3.75rem' } }}
              >
                About Jeff Maxwell
              </GradientText>
              <Typography
                variant="h5"
                component="h2"
                align="center"
                color="text.secondary"
                sx={{ maxWidth: 600, mx: 'auto' }}
              >
                Full stack developer passionate about creating elegant solutions to complex
                problems. When I&#39;m not coding, I&#39;m exploring new technologies and perfecting
                my craft.
              </Typography>
            </div>
          </Fade>
        </Box>
        <Box
          component="section"
          aria-labelledby="personal-section"
          ref={personalRef}
          sx={{ mb: 6 }}
        >
          <NoSsr fallback={<Box sx={{ minHeight: '300px', backgroundColor: 'action.hover' }} />}>
            <Slide direction="up" in={personalVisible} timeout={800}>
              <PersonalCard elevation={3}>
                <NoSsr fallback={<Box sx={{ minHeight: '200px' }} />}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <InterestItem>
                        <CodeIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            Clean Code
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Readable, maintainable solutions
                          </Typography>
                        </Box>
                      </InterestItem>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <InterestItem>
                        <Coffee sx={{ fontSize: 32, color: 'primary.main' }} />
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            Coffee & Code
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Fuel for late-night debugging
                          </Typography>
                        </Box>
                      </InterestItem>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <InterestItem>
                        <Pets sx={{ fontSize: 32, color: 'primary.main' }} />
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            Dog Parent
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Expert at dinner negotiations
                          </Typography>
                        </Box>
                      </InterestItem>
                    </Grid>
                  </Grid>
                </NoSsr>
              </PersonalCard>
            </Slide>
          </NoSsr>
        </Box>

        <Box component="section" aria-labelledby="illustrations-section">
          <Typography
            variant="h2"
            component="h2"
            id="illustrations-section"
            sx={{
              position: 'absolute',
              left: '-10000px',
              width: '1px',
              height: '1px',
              overflow: 'hidden',
              fontSize: '1.5rem',
            }}
          >
            Development Team Illustrations
          </Typography>
          <NoSsr fallback={<Box sx={{ minHeight: '400px', backgroundColor: 'action.hover' }} />}>
            <Grid container spacing={4} sx={{ mb: 6 }}>
              <Grid item xs={12} md={6}>
                <Card
                  elevation={3}
                  sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    backgroundColor: 'rgb(0, 89, 149)',
                    aspectRatio: '1 / 1',
                    minHeight: { xs: '300px', sm: '400px' },
                    position: 'relative',
                    willChange: 'transform',
                  }}
                >
                  <Box
                    sx={{
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Image imageType="mascot" />
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card
                  elevation={3}
                  sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    backgroundColor: 'rgb(0, 89, 149)',
                    aspectRatio: '1 / 1',
                    minHeight: { xs: '300px', sm: '400px' },
                    position: 'relative',
                    willChange: 'transform',
                  }}
                >
                  <Box
                    sx={{
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Image imageType="dogs" />
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={12} md={6} sx={{ mx: 'auto' }}>
                <Card
                  elevation={3}
                  sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    backgroundColor: 'rgb(0, 89, 149)',
                    aspectRatio: '1 / 1',
                    minHeight: { xs: '300px', sm: '400px' },
                    position: 'relative',
                    willChange: 'transform',
                  }}
                >
                  <Box
                    sx={{
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Image imageType="developer" />
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </NoSsr>
        </Box>

        <Box component="section" aria-labelledby="tech-stack" ref={techRef} sx={{ mb: 6 }}>
          <NoSsr fallback={<Box sx={{ minHeight: '400px', backgroundColor: 'action.hover' }} />}>
            <Fade
              in={techVisible}
              timeout={600}
              style={{ transitionDelay: techVisible ? '0ms' : '0ms' }}
            >
              <TechSection elevation={2} sx={{ willChange: 'transform' }}>
                <GradientText
                  variant="h2"
                  component="h2"
                  id="tech-stack"
                  align="center"
                  gutterBottom
                >
                  Technology Stack & Tools
                </GradientText>
                <Typography
                  variant="body1"
                  align="center"
                  color="text.secondary"
                  paragraph
                  sx={{ fontSize: '1.125rem' }}
                >
                  The tools and technologies that power my development workflow
                </Typography>

                <NoSsr fallback={<Box sx={{ minHeight: '300px', backgroundColor: 'action.hover', mt: 2 }} />}>
                  <Grid container spacing={3} sx={{ mt: 2 }}>
                    <Grid item xs={6} md={3}>
                      <TechCard elevation={1}>
                        {typeof window !== 'undefined' && (
                          <StyledIcon>
                            <DiIntellij />
                          </StyledIcon>
                        )}
                        <Typography variant="h6" component="h3" gutterBottom>
                          IntelliJ IDEA
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Primary development environment
                        </Typography>
                      </TechCard>
                    </Grid>

                    <Grid item xs={6} md={3}>
                      <TechCard elevation={1}>
                        {typeof window !== 'undefined' && (
                          <StyledIcon>
                            <DiMozilla />
                          </StyledIcon>
                        )}
                        <Typography variant="h6" component="h3" gutterBottom>
                          Firefox
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Development & testing browser
                        </Typography>
                      </TechCard>
                    </Grid>

                    <Grid item xs={6} md={3}>
                      <TechCard elevation={1}>
                        {typeof window !== 'undefined' && (
                          <StyledIcon>
                            <DiDebian />
                          </StyledIcon>
                        )}
                        <Typography variant="h6" component="h3" gutterBottom>
                          Debian Linux
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Preferred operating system
                        </Typography>
                      </TechCard>
                    </Grid>

                    <Grid item xs={6} md={3}>
                      <TechCard elevation={1}>
                        {typeof window !== 'undefined' && (
                          <StyledIcon>
                            <FaPiedPiperAlt />
                          </StyledIcon>
                        )}
                        <Typography variant="h6" component="h3" gutterBottom>
                          Pied Piper
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Optimal compression algorithm
                        </Typography>
                      </TechCard>
                    </Grid>
                  </Grid>
                </NoSsr>
              </TechSection>
            </Fade>
          </NoSsr>
        </Box>

        <Box
          component="section"
          aria-labelledby="organizations"
          sx={{ textAlign: 'center', mt: 6 }}
        >
          <GradientText variant="h2" component="h2" id="organizations" gutterBottom>
            Supported Organizations
          </GradientText>
          <Box sx={{ maxWidth: 300, mx: 'auto' }}>
            <Logo />
          </Box>
        </Box>
      </Container>
    </Layout>
  );
}

export default AboutPage;
