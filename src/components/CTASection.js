import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// Simple styled components to replace MUI components
const Typography = styled.div`
  margin: 0;
  font-family: inherit;
  font-weight: ${props => 
    props.variant === 'h3' ? 400 :
    props.variant === 'h4' ? 400 :
    props.variant === 'body1' ? 400 :
    400
  };
  font-size: ${props => 
    props.variant === 'h3' ? '3rem' :
    props.variant === 'h4' ? '2.125rem' :
    props.variant === 'body1' ? '1rem' :
    '1rem'
  };
  line-height: ${props => 
    props.variant === 'h3' ? 1.167 :
    props.variant === 'h4' ? 1.235 :
    props.variant === 'body1' ? 1.5 :
    1.5
  };
  color: ${props => 
    props.color === 'text.secondary' ? 'rgba(0, 0, 0, 0.6)' :
    'rgba(0, 0, 0, 0.87)'
  };
  margin-bottom: ${props => props.gutterBottom ? '0.35em' : '0'};
  text-align: ${props => props.align || 'inherit'};
  
  @media (prefers-color-scheme: dark) {
    color: ${props => 
      props.color === 'text.secondary' ? 'rgba(255, 255, 255, 0.7)' :
      'rgba(255, 255, 255, 0.87)'
    };
  }
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-sizing: border-box;
  background-color: transparent;
  outline: 0;
  border: 0;
  margin: 0;
  cursor: pointer;
  user-select: none;
  vertical-align: middle;
  text-decoration: none;
  font-family: inherit;
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.75;
  letter-spacing: 0.02857em;
  text-transform: uppercase;
  min-width: 64px;
  padding: 6px 16px;
  border-radius: 4px;
  transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  
  ${props => props.variant === 'contained' && props.color === 'primary' && `
    color: #fff;
    background-color: #1976d2;
    box-shadow: 0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12);
    
    &:hover {
      background-color: #1565c0;
      box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);
    }
  `}
  
  ${props => props.size === 'large' && `
    padding: 8px 22px;
    font-size: 0.9375rem;
  `}
`;

// Simple icon components
const EmailIcon = styled.span`
  font-size: 24px;
  margin-right: 8px;
  &::before {
    content: '✉';
  }
`;

const PhoneIcon = styled.span`
  font-size: 24px;
  margin-right: 8px;
  &::before {
    content: '📞';
  }
`;

const GitHubIcon = styled.span`
  font-size: 24px;
  margin-right: 8px;
  &::before {
    content: '🔗';
  }
`;

const CTASection = styled.div`
  background: linear-gradient(135deg, rgba(252, 74, 26, 0.15) 0%, rgba(247, 183, 51, 0.15) 100%);
  border-radius: 24px;
  padding: 48px 32px;
  text-align: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12);
  
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
      icon: EmailIcon,
      text: 'Email Me',
      href: 'mailto:maxjeffwell@gmail.com',
      label: 'Send email to maxjeffwell@gmail.com',
    },
    {
      icon: PhoneIcon,
      text: 'Call Me',
      href: 'tel:+15083952008',
      label: 'Call Jeff Maxwell at 508-395-2008',
    },
    {
      icon: GitHubIcon,
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
    <CTASection>
      <StyledContainer>
        <GradientText as="h2" variant="h3" id="cta-heading" gutterBottom>
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
              <StatBox style={{ 
                opacity: visible ? 1 : 0,
                transition: `opacity 400ms ease-in-out ${index * 50}ms`
              }}>
                <Typography className="stat-number">{stat.number}</Typography>
                <Typography className="stat-label">{stat.label}</Typography>
              </StatBox>
            </StatsItem>
          ))}
        </StatsContainer>

        <ContactContainer>
          {contactMethods.map((method, index) => {
            const IconComponent = method.icon;
            const isExternal = method.href.startsWith('http');

            return (
              <ContactItem key={method.text}>
                <ContactButton
                  as="a"
                  href={method.href}
                  title={method.label}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  aria-label={method.label}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{ 
                    opacity: visible ? 1 : 0,
                    transition: `opacity 400ms ease-in-out ${index * 50 + 200}ms`,
                    width: '100%'
                  }}
                >
                  <IconComponent />
                  <Typography>{method.text}</Typography>
                </ContactButton>
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
