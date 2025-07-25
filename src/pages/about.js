import React from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Card,
  useTheme,
  Fade,
  Slide,
  NoSsr,
} from '@mui/material';
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
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
  '.MuiCard-root:hover &': {
    transform: 'scale(1.1) rotate(5deg)',
  },
}));

function AboutPage() {
  const theme = useTheme();
  const [headerRef, headerVisible] = useScrollAnimation({ delay: 100 });
  const [techRef, techVisible] = useScrollAnimation({ delay: 300 });
  const [personalRef, personalVisible] = useScrollAnimation({ delay: 500 });

  return (
    <Layout>
      <SEO
        title="About"
        description="Meet Jeff Maxwell and his development team. Learn about the technologies, tools, and creative process behind his full stack web development work."
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
        <Box ref={headerRef} sx={{ mb: 6 }}>
          <Fade in={headerVisible} timeout={1000}>
            <div>
              <GradientText variant="h2" component="h1" align="center" gutterBottom>
                About Jeff Maxwell
              </GradientText>
              <Typography
                variant="h5"
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
        <Box ref={personalRef} sx={{ mb: 6 }}>
          <NoSsr>
            <Slide direction="up" in={personalVisible} timeout={800}>
              <PersonalCard elevation={3}>
                <Typography variant="h4" component="h2" gutterBottom align="center">
                  Beyond the Code
                </Typography>
                <Typography
                  variant="body1"
                  paragraph
                  align="center"
                  sx={{ mb: 4, fontSize: '1.125rem' }}
                >
                  When I&#39;m not debugging or mastering the latest frameworks, you&#39;ll find me
                  negotiating dinner menus with my two dogs, exploring vintage internet archives, or
                  diving deep into the philosophy of clean code architecture.
                </Typography>

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
              </PersonalCard>
            </Slide>
          </NoSsr>
        </Box>

        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Box
            sx={{
              maxWidth: 400,
              mx: 'auto',
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: 3,
              backgroundColor: 'rgb(0, 89, 149)',
            }}
          >
            <Image />
          </Box>
        </Box>

        <Box ref={techRef} sx={{ mb: 6 }}>
          <NoSsr>
            <Fade in={techVisible} timeout={1000}>
              <TechSection elevation={2}>
                <GradientText variant="h3" component="h2" align="center" gutterBottom>
                  Technology Stack & Tools
                </GradientText>
                <Typography variant="h6" align="center" color="text.secondary" paragraph>
                  The tools and technologies that power my development workflow
                </Typography>

                <Grid container spacing={3} sx={{ mt: 2 }}>
                  <Grid item xs={6} md={3}>
                    <TechCard elevation={1}>
                      {typeof window !== 'undefined' && (
                        <StyledIcon>
                          <DiIntellij />
                        </StyledIcon>
                      )}
                      <Typography variant="h6" gutterBottom>
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
                      <Typography variant="h6" gutterBottom>
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
                      <Typography variant="h6" gutterBottom>
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
                      <Typography variant="h6" gutterBottom>
                        Pied Piper
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Optimal compression algorithm
                      </Typography>
                    </TechCard>
                  </Grid>
                </Grid>
              </TechSection>
            </Fade>
          </NoSsr>
        </Box>

        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <GradientText variant="h4" component="h2" gutterBottom>
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
