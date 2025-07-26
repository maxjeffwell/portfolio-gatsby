import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import { Box, Typography, Button, Paper, Grid, useTheme, Fade } from '@mui/material';
import { Email, Phone, LinkedIn, GitHub, ArrowForward } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const CTASection = styled(Paper)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`,
  borderRadius: theme.shape.borderRadius * 3,
  padding: theme.spacing(6, 4),
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: `radial-gradient(circle at center, ${theme.palette.primary.main}10 0%, transparent 70%)`,
    animation: 'rotate 20s linear infinite',
    zIndex: 0,
  },
  '@keyframes rotate': {
    from: {
      transform: 'rotate(0deg)',
    },
    to: {
      transform: 'rotate(360deg)',
    },
  },
  '& > *': {
    position: 'relative',
    zIndex: 1,
  },
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(4, 3),
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3, 2),
  },
}));

const GradientText = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  display: 'inline-block',
}));

const ContactButton = styled(Button)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 2,
  textTransform: 'none',
  backgroundColor: theme.palette.action.hover,
  color: theme.palette.text.primary,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    backgroundColor: theme.palette.action.selected,
  },
}));

const StatBox = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  '& .stat-number': {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(0.5),
  },
  '& .stat-label': {
    fontSize: '1rem',
    color: theme.palette.text.secondary,
  },
}));

const StyledLink = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
}));

const MainButton = styled(Button)(({ theme }) => ({
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

function CTASectionComponent({ visible }) {
  const theme = useTheme();
  const [hoveredCard, setHoveredCard] = useState(null);

  const contactMethods = [
    {
      icon: Email,
      text: 'Email Me',
      href: 'mailto:maxjeffwell@gmail.com',
      label: 'Send email to maxjeffwell@gmail.com',
    },
    {
      icon: Phone,
      text: 'Call Me',
      href: 'tel:+15083952008',
      label: 'Call Jeff Maxwell at 508-395-2008',
    },
    {
      icon: GitHub,
      text: 'GitHub',
      href: 'https://github.com/maxjeffwell',
      label: 'Visit GitHub profile',
    },
  ];

  const stats = [
    { number: '5+', label: 'Years Experience' },
    { number: '20+', label: 'Projects Completed' },
    { number: '100%', label: 'Client Satisfaction' },
  ];

  return (
    <CTASection elevation={3}>
      <Box sx={{ maxWidth: 600, mx: 'auto' }}>
        <GradientText variant="h3" component="h2" id="cta-heading" gutterBottom>
          Ready to Build Something Amazing?
        </GradientText>

        <Typography
          variant="body1"
          paragraph
          sx={{ mb: 4, opacity: 0.9, fontSize: '1.125rem' }}
          color="text.secondary"
        >
          Let's collaborate to create exceptional web experiences that make a difference. I'm
          passionate about solving complex problems with clean, efficient code.
        </Typography>

        <Grid container spacing={4} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={4} key={stat.label}>
              <Fade in={visible} timeout={800} style={{ transitionDelay: `${index * 200}ms` }}>
                <StatBox>
                  <Typography className="stat-number">{stat.number}</Typography>
                  <Typography className="stat-label">{stat.label}</Typography>
                </StatBox>
              </Fade>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          {contactMethods.map((method, index) => {
            const IconComponent = method.icon;
            const isExternal = method.href.startsWith('http');

            return (
              <Grid item xs={12} sm={6} md={3} key={method.text}>
                <Fade
                  in={visible}
                  timeout={800}
                  style={{ transitionDelay: `${index * 100 + 400}ms` }}
                >
                  <ContactButton
                    component="a"
                    href={method.href}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    aria-label={method.label}
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
                    fullWidth
                  >
                    <IconComponent sx={{ fontSize: 24 }} />
                    <Typography>{method.text}</Typography>
                  </ContactButton>
                </Fade>
              </Grid>
            );
          })}
        </Grid>

        <Fade in={visible} timeout={1000} style={{ transitionDelay: '800ms' }}>
          <Box>
            <StyledLink to="/projects/">
              <MainButton size="large" endIcon={<ArrowForward />}>
                View My Projects
              </MainButton>
            </StyledLink>
          </Box>
        </Fade>
      </Box>
    </CTASection>
  );
}

CTASectionComponent.propTypes = {
  visible: PropTypes.bool.isRequired,
};

export default CTASectionComponent;
