import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Typography, Button, Paper, Fade } from '@mui/material';
import { Email, Phone, GitHub } from '@mui/icons-material';
import styled from '@emotion/styled';

const CTASection = styled(Paper)`
  background: linear-gradient(135deg, rgba(252, 74, 26, 0.15) 0%, rgba(247, 183, 51, 0.15) 100%);
  border-radius: 24px;
  padding: 48px 32px;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle at center, rgba(252, 74, 26, 0.1) 0%, transparent 70%);
    z-index: 0;
    will-change: auto;
  }
  
  & > * {
    position: relative;
    z-index: 1;
  }
  
  @media (max-width: 960px) {
    padding: 32px 24px;
  }
  
  @media (max-width: 600px) {
    padding: 24px 16px;
  }
  
  @media (max-width: 360px) {
    padding: 20px 12px;
    border-radius: 16px;
  }
`;

const GradientText = styled(Typography)`
  background: linear-gradient(45deg, #fc4a1a, #f7b733);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
`;

const ContactButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  border-radius: 16px;
  text-transform: none;
  background-color: rgba(0, 0, 0, 0.04);
  color: #1976d2;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    background-color: rgba(0, 0, 0, 0.08);
  }
  
  @media (prefers-color-scheme: dark) {
    background-color: rgba(255, 255, 255, 0.08);
    color: white;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.12);
    }
  }
`;

const StatBox = styled.div`
  text-align: center;
  
  & .stat-number {
    font-size: 2.5rem;
    font-weight: bold;
    color: #fc4a1a;
    margin-bottom: 4px;
  }
  
  & .stat-label {
    font-size: 1rem;
    color: rgba(0, 0, 0, 0.6);
  }
  
  @media (prefers-color-scheme: dark) {
    & .stat-label {
      color: rgba(255, 255, 255, 0.7);
    }
  }
`;

const StyledContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const StatsContainer = styled.div`
  display: flex;
  gap: 32px;
  margin-bottom: 32px;
  justify-content: center;
  
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const StatsItem = styled.div`
  flex: 1;
  text-align: center;
`;

const ContactContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  justify-content: center;
  
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const ContactItem = styled.div`
  flex: 1;
`;


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
      <StyledContainer>
        <GradientText variant="h3" component="h2" id="cta-heading" gutterBottom>
          Ready to Build Something Amazing?
        </GradientText>

        <Typography
          variant="body1"
          paragraph
          style={{ marginBottom: 32, opacity: 0.9, fontSize: '1.125rem' }}
          color="text.secondary"
        >
          Whether you have a project in mind, need technical expertise, or just want to say hello,
          I&apos;d love to hear from you. Let&apos;s collaborate to create exceptional web
          experiences that make a difference.
        </Typography>

        <StatsContainer>
          {stats.map((stat, index) => (
            <StatsItem key={stat.label}>
              <Fade in={visible} timeout={400} style={{ transitionDelay: `${index * 50}ms` }}>
                <StatBox>
                  <Typography className="stat-number">{stat.number}</Typography>
                  <Typography className="stat-label">{stat.label}</Typography>
                </StatBox>
              </Fade>
            </StatsItem>
          ))}
        </StatsContainer>

        <ContactContainer>
          {contactMethods.map((method, index) => {
            const IconComponent = method.icon;
            const isExternal = method.href.startsWith('http');

            return (
              <ContactItem key={method.text}>
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
                    <IconComponent style={{ fontSize: 24 }} />
                    <Typography>{method.text}</Typography>
                  </ContactButton>
                </Fade>
              </ContactItem>
            );
          })}
        </ContactContainer>
      </StyledContainer>
    </CTASection>
  );
}

CTASectionComponent.propTypes = {
  visible: PropTypes.bool.isRequired,
};

export default CTASectionComponent;
