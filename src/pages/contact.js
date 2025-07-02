import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

import Layout from '../components/layout';
import SEO from '../components/seo';
import ContactForm from '../components/ContactForm';
import { useTheme } from '../context/ThemeContext';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { FaLinkedin, FaGithub, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const StyledContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
`;

const HeaderSection = styled.section`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-family: HelveticaNeueLTStd-Bd, sans-serif;
  font-size: 3rem;
  margin-bottom: 1rem;
  background: ${(props) => props.theme.gradients.accent};
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  color: ${(props) => props.theme.colors.textSecondary};
  font-family: SabonLTStd-Roman, serif;
  font-size: 1.25rem;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
`;

const ContactOptionsSection = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const ContactCard = styled.div`
  background: ${(props) => props.theme.gradients.secondary};
  border: 2px solid ${(props) => props.theme.colors.border};
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  transition: all ${(props) => props.theme.transitions.normal};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${(props) => props.theme.gradients.accent};
    transform: scaleX(0);
    transition: transform ${(props) => props.theme.transitions.normal};
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${(props) => props.theme.shadows.hover};
    border-color: ${(props) => props.theme.colors.accent};

    &::before {
      transform: scaleX(1);
    }
  }
`;

const ContactIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${(props) => props.theme.gradients.accent};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-size: 1.5rem;
  color: ${(props) => props.theme.colors.textInverse};
  transition: transform ${(props) => props.theme.transitions.normal};

  ${ContactCard}:hover & {
    transform: scale(1.1) rotate(5deg);
  }
`;

const ContactTitle = styled.h3`
  color: ${(props) => props.theme.colors.text};
  font-family: HelveticaNeueLTStd-Bd, sans-serif;
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
`;

const ContactInfo = styled.p`
  color: ${(props) => props.theme.colors.textSecondary};
  font-family: SabonLTStd-Roman, serif;
  font-size: 1rem;
  margin-bottom: 1rem;
  line-height: 1.4;
`;

const ContactLink = styled.a`
  color: ${(props) => props.theme.colors.accent};
  text-decoration: none;
  font-family: SabonLTStd-Roman, serif;
  font-weight: bold;
  transition: color ${(props) => props.theme.transitions.fast};

  &:hover {
    color: ${(props) => props.theme.colors.accentSecondary};
    text-decoration: underline;
  }

  &:focus {
    outline: 2px solid ${(props) => props.theme.colors.accentSecondary};
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

const ContactPage = () => {
  const { theme } = useTheme();
  const [headerRef, headerVisible] = useScrollAnimation({ delay: 100 });
  const [cardsRef, cardsVisible] = useScrollAnimation({ delay: 200 });
  const [formRef, formVisible] = useScrollAnimation({ delay: 300 });

  return (
    <Layout>
      <SEO
        title="Contact"
        description="Get in touch with Jeff Maxwell. Send a message about your project ideas, collaboration opportunities, or just say hello. I'd love to hear from you!"
        pathname="/contact/"
        keywords={[
          'contact Jeff Maxwell',
          'web developer contact',
          'project inquiry',
          'collaboration',
          'freelance developer',
          'hire developer',
          'contact form',
          'get in touch',
          'project consultation',
        ]}
      />

      <StyledContainer>
        <HeaderSection
          ref={headerRef}
          css={css`
            opacity: ${headerVisible ? 1 : 0};
            transform: ${headerVisible ? 'translateY(0)' : 'translateY(30px)'};
            transition: all ${theme.transitions.slow};
          `}
        >
          <Title theme={theme}>Let's Work Together</Title>
          <Subtitle theme={theme}>
            Have a project in mind? Looking for a developer to join your team? 
            Or just want to say hello? I'd love to hear from you!
          </Subtitle>
        </HeaderSection>

        <ContactOptionsSection
          ref={cardsRef}
          css={css`
            opacity: ${cardsVisible ? 1 : 0};
            transform: ${cardsVisible ? 'translateY(0)' : 'translateY(30px)'};
            transition: all ${theme.transitions.slow};
          `}
        >
          <ContactCard theme={theme}>
            <ContactIcon theme={theme}>
              <FaEnvelope />
            </ContactIcon>
            <ContactTitle theme={theme}>Email</ContactTitle>
            <ContactInfo theme={theme}>
              Send me an email for project inquiries, collaboration, or general questions.
            </ContactInfo>
            <ContactLink 
              theme={theme}
              href="mailto:jeff@jeffmaxwell.dev"
              aria-label="Send email to Jeff Maxwell"
            >
              jeff@jeffmaxwell.dev
            </ContactLink>
          </ContactCard>

          <ContactCard theme={theme}>
            <ContactIcon theme={theme}>
              <FaLinkedin />
            </ContactIcon>
            <ContactTitle theme={theme}>LinkedIn</ContactTitle>
            <ContactInfo theme={theme}>
              Connect with me professionally and view my work experience and recommendations.
            </ContactInfo>
            <ContactLink 
              theme={theme}
              href="https://www.linkedin.com/in/jeffmaxwell-dev"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Jeff Maxwell's LinkedIn profile"
            >
              linkedin.com/in/jeffmaxwell-dev
            </ContactLink>
          </ContactCard>

          <ContactCard theme={theme}>
            <ContactIcon theme={theme}>
              <FaGithub />
            </ContactIcon>
            <ContactTitle theme={theme}>GitHub</ContactTitle>
            <ContactInfo theme={theme}>
              Check out my code, contribute to projects, or explore my open source work.
            </ContactInfo>
            <ContactLink 
              theme={theme}
              href="https://github.com/maxjeffwell"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Jeff Maxwell's GitHub profile"
            >
              github.com/maxjeffwell
            </ContactLink>
          </ContactCard>
        </ContactOptionsSection>

        <section
          ref={formRef}
          css={css`
            opacity: ${formVisible ? 1 : 0};
            transform: ${formVisible ? 'translateY(0)' : 'translateY(30px)'};
            transition: all ${theme.transitions.slow};
          `}
        >
          <ContactForm />
        </section>
      </StyledContainer>
    </Layout>
  );
};

export default ContactPage;