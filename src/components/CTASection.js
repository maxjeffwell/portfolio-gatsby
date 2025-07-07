import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { Link } from 'gatsby';
import { FaEnvelope, FaPhone, FaLinkedin, FaGithub, FaArrowRight } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const CTAContainer = styled.div`
  background: ${(props) => props.theme.gradients.primary};
  border-radius: 20px;
  padding: 4rem 3rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  box-shadow: ${(props) => props.theme.shadows.large};
  border: 1px solid ${(props) => props.theme.colors.border};

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle at center, rgba(252, 74, 26, 0.1) 0%, transparent 70%);
    animation: rotate 20s linear infinite;
    z-index: 0;
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  > * {
    position: relative;
    z-index: 1;
  }

  @media (max-width: 768px) {
    padding: 3rem 2rem;
  }

  @media (max-width: 480px) {
    padding: 2rem 1.5rem;
  }
`;

const CTAContent = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin: 2.5rem 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const ContactCard = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1.25rem;
  background: ${(props) => props.theme.colors.secondary};
  border-radius: 12px;
  text-decoration: none;
  color: ${(props) => props.theme.colors.text};
  transition: all ${(props) => props.theme.transitions.normal};
  border: 1px solid ${(props) => props.theme.colors.border};

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${(props) => props.theme.shadows.hover};
    background: ${(props) => props.theme.colors.tertiary};
  }

  &:focus {
    outline: 2px solid ${(props) => props.theme.colors.accentSecondary};
    outline-offset: 2px;
  }
`;

const ContactIcon = styled.div`
  color: ${(props) => props.theme.colors.accent};
  font-size: 1.5rem;
  display: flex;
  align-items: center;
`;

const ContactText = styled.span`
  font-family: HelveticaNeueLTStd-Roman, sans-serif;
  font-size: 1rem;
  font-weight: 500;

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const CTAButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 2.5rem;
  background: ${(props) => props.theme.gradients.accent};
  color: ${(props) => props.theme.colors.textInverse};
  text-decoration: none;
  border-radius: 50px;
  font-family: HelveticaNeueLTStd-Bd, sans-serif;
  font-size: 1.1rem;
  font-weight: bold;
  transition: all ${(props) => props.theme.transitions.normal};
  box-shadow: ${(props) => props.theme.shadows.medium};
  margin-top: 2rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left ${(props) => props.theme.transitions.slow};
  }

  &:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: ${(props) => props.theme.shadows.hover};

    &::before {
      left: 100%;
    }

    svg {
      transform: translateX(3px);
    }
  }

  &:focus {
    outline: 2px solid ${(props) => props.theme.colors.accentSecondary};
    outline-offset: 4px;
  }

  svg {
    transition: transform ${(props) => props.theme.transitions.normal};
  }

  @media (max-width: 480px) {
    padding: 1rem 2rem;
    font-size: 1rem;
  }
`;

const QuickStats = styled.div`
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin: 3rem 0 2rem;

  @media (max-width: 768px) {
    gap: 2rem;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

const Stat = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-family: HelveticaNeueLTStd-Bd, sans-serif;
  font-size: 2.5rem;
  font-weight: bold;
  color: ${(props) => props.theme.colors.accent};
  margin-bottom: 0.5rem;

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const StatLabel = styled.div`
  font-family: HelveticaNeueLTStd-Roman, sans-serif;
  font-size: 1rem;
  color: ${(props) => props.theme.colors.textSecondary};
`;

function CTASection({ visible }) {
  const { theme } = useTheme();
  const [hoveredCard, setHoveredCard] = useState(null);

  const contactMethods = [
    {
      icon: FaEnvelope,
      text: 'Email Me',
      href: 'mailto:maxjeffwell@gmail.com',
      label: 'Send email to maxjeffwell@gmail.com',
    },
    {
      icon: FaPhone,
      text: 'Call Me',
      href: 'tel:+15083952008',
      label: 'Call Jeff Maxwell at 508-395-2008',
    },
    {
      icon: FaLinkedin,
      text: 'LinkedIn',
      href: 'https://www.linkedin.com/in/jeffrey-maxwell-553176172',
      label: 'Connect on LinkedIn',
    },
    {
      icon: FaGithub,
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
    <CTAContainer theme={theme}>
      <CTAContent>
        <h2
          css={css`
            color: ${theme.colors.text};
            font-family: HelveticaNeueLTStd-Bd, sans-serif;
            font-size: 2.75rem;
            margin-bottom: 1.5rem;
            background: ${theme.gradients.accent};
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            line-height: 1.2;

            @media (max-width: 768px) {
              font-size: 2.25rem;
            }

            @media (max-width: 480px) {
              font-size: 2rem;
            }
          `}
          id="cta-heading"
        >
          Ready to Build Something Amazing?
        </h2>

        <p
          css={css`
            color: ${theme.colors.text};
            font-family: HelveticaNeueLTStd-Roman, sans-serif;
            font-size: 1.25rem;
            line-height: 1.6;
            margin-bottom: 2rem;
            opacity: 0.9;

            @media (max-width: 768px) {
              font-size: 1.125rem;
            }
          `}
        >
          Let's collaborate to create exceptional web experiences that make a difference. I'm
          passionate about solving complex problems with clean, efficient code.
        </p>

        <QuickStats>
          {stats.map((stat, index) => (
            <Stat
              key={stat.label}
              css={css`
                opacity: ${visible ? 1 : 0};
                transform: ${visible ? 'translateY(0)' : 'translateY(20px)'};
                transition: all ${theme.transitions.slow};
                transition-delay: ${index * 200}ms;
              `}
            >
              <StatNumber theme={theme}>{stat.number}</StatNumber>
              <StatLabel theme={theme}>{stat.label}</StatLabel>
            </Stat>
          ))}
        </QuickStats>

        <ContactGrid>
          {contactMethods.map((method, index) => {
            const IconComponent = method.icon;
            const isExternal = method.href.startsWith('http');

            return (
              <ContactCard
                key={method.text}
                href={method.href}
                theme={theme}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                aria-label={method.label}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                css={css`
                  opacity: ${visible ? 1 : 0};
                  transform: ${visible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)'};
                  transition: all ${theme.transitions.slow};
                  transition-delay: ${index * 100 + 400}ms;
                `}
              >
                <ContactIcon theme={theme}>
                  {typeof window !== 'undefined' && <IconComponent />}
                </ContactIcon>
                <ContactText>{method.text}</ContactText>
              </ContactCard>
            );
          })}
        </ContactGrid>

        <CTAButton
          to="/projects/"
          theme={theme}
          css={css`
            opacity: ${visible ? 1 : 0};
            transform: ${visible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)'};
            transition: all ${theme.transitions.elastic};
            transition-delay: 800ms;
          `}
        >
          View My Projects
          {typeof window !== 'undefined' && <FaArrowRight />}
        </CTAButton>
      </CTAContent>
    </CTAContainer>
  );
}

CTASection.propTypes = {
  visible: PropTypes.bool.isRequired,
};

export default CTASection;
