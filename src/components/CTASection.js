import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Button, Paper, Fade } from '@mui/material';
import { Email, Phone, GitHub } from '@mui/icons-material';
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
    zIndex: 0,
    willChange: 'auto',
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
  '@media (max-width: 360px)': {
    padding: theme.spacing(2.5, 1.5),
    borderRadius: theme.shape.borderRadius * 2,
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


function CTASectionComponent({ visible }) {
  const [, setHoveredCard] = useState(null);

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
          Whether you have a project in mind, need technical expertise, or just want to say hello,
          I&apos;d love to hear from you. Let&apos;s collaborate to create exceptional web
          experiences that make a difference.
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 4,
            mb: 4,
            justifyContent: 'center',
          }}
        >
          {stats.map((stat, index) => (
            <Box key={stat.label} sx={{ flex: 1, textAlign: 'center' }}>
              <Fade in={visible} timeout={400} style={{ transitionDelay: `${index * 50}ms` }}>
                <StatBox>
                  <Typography className="stat-number">{stat.number}</Typography>
                  <Typography className="stat-label">{stat.label}</Typography>
                </StatBox>
              </Fade>
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mb: 4,
            justifyContent: 'center',
          }}
        >
          {contactMethods.map((method, index) => {
            const IconComponent = method.icon;
            const isExternal = method.href.startsWith('http');

            return (
              <Box key={method.text} sx={{ flex: 1 }}>
                <Fade
                  in={visible}
                  timeout={400}
                  style={{ transitionDelay: `${index * 50 + 200}ms` }}
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
              </Box>
            );
          })}
        </Box>
      </Box>
    </CTASection>
  );
}

CTASectionComponent.propTypes = {
  visible: PropTypes.bool.isRequired,
};

export default CTASectionComponent;
