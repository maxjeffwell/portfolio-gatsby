import React from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { DiIntellij, DiMozilla, DiDebian } from 'react-icons/di';
import { FaPiedPiperAlt, FaCode, FaCoffee, FaDog } from 'react-icons/fa';

import Layout from '../components/layout';
import SEO from '../components/seo';
import Image from '../components/image';
import Logo from '../components/logo';
import { useTheme } from '../context/ThemeContext';
import useScrollAnimation from '../hooks/useScrollAnimation';

const StyledContainer = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 1fr;
  gap: 3rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 3rem;
  }
`;

const StyledSubContainer = styled.div`
  background: ${(props) => props.theme.gradients.subtle};
  border-radius: 16px;
  padding: 2.5rem 2rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  box-shadow: ${(props) => props.theme.shadows.medium};
  backdrop-filter: blur(10px);
`;

const TechGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
`;

const TechItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1.5rem 1rem;
  background: ${(props) => props.theme.colors.surface};
  border-radius: 12px;
  border: 1px solid ${(props) => props.theme.colors.border};
  transition: all ${(props) => props.theme.transitions.normal};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${(props) => props.theme.shadows.hover};
    background: ${(props) => props.theme.colors.tertiary};
  }
`;

const PersonalSection = styled.div`
  background: ${(props) => props.theme.gradients.primary};
  border-radius: 20px;
  padding: 3rem 2.5rem;
  margin: 3rem 0;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      circle at 30% 20%,
      rgba(252, 74, 26, 0.1) 0%,
      transparent 70%
    );
    z-index: 0;
  }
  
  > * {
    position: relative;
    z-index: 1;
  }
  
  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }
`;

const InterestGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const InterestCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: ${(props) => props.theme.colors.secondary};
  border-radius: 12px;
  border: 1px solid ${(props) => props.theme.colors.border};
  transition: all ${(props) => props.theme.transitions.normal};
  
  &:hover {
    transform: translateY(-2px);
    background: ${(props) => props.theme.colors.tertiary};
  }
  
  svg {
    color: ${(props) => props.theme.colors.accent};
    font-size: 1.5rem;
    flex-shrink: 0;
  }
`;

const StyledLogoContainer = styled.div`
  display: grid;
  grid-template-columns: 0.5fr 1fr;
  margin-top: 2rem;
`;

const AboutPage = () => {
  const { theme } = useTheme();
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
    <main role="main">
      <StyledContainer>
        <header ref={headerRef}>
          <h1
            css={css`
              font-family: HelveticaNeueLTStd-Bd, sans-serif;
              font-size: 2.75rem;
              background: ${theme.gradients.accent};
              background-clip: text;
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              margin-bottom: 2rem;
              text-align: center;
              opacity: ${headerVisible ? 1 : 0};
              transform: ${headerVisible ? 'translateY(0)' : 'translateY(-20px)'};
              transition: all ${theme.transitions.slow};
              
              @media (max-width: 768px) {
                font-size: 2.25rem;
              }
            `}
          >
            About Jeff Maxwell
          </h1>
          <p
            css={css`
              font-family: HelveticaNeueLTStd-Roman, sans-serif;
              font-size: 1.25rem;
              color: ${theme.colors.text};
              text-align: center;
              line-height: 1.6;
              max-width: 600px;
              margin: 0 auto 3rem;
              opacity: ${headerVisible ? 1 : 0};
              transform: ${headerVisible ? 'translateY(0)' : 'translateY(20px)'};
              transition: all ${theme.transitions.slow};
              transition-delay: 0.2s;
            `}
          >
            Full stack developer passionate about creating elegant solutions to complex problems.
            When I'm not coding, I'm exploring new technologies and perfecting my craft.
          </p>
        </header>
        <section 
          ref={personalRef}
          aria-labelledby="personal-info"
          css={css`
            opacity: ${personalVisible ? 1 : 0};
            transform: ${personalVisible ? 'translateY(0)' : 'translateY(30px)'};
            transition: all ${theme.transitions.slow};
          `}
        >
          <PersonalSection theme={theme}>
            <h2
              id="personal-info"
              css={css`
                font-family: HelveticaNeueLTStd-Bd, sans-serif;
                font-size: 2rem;
                color: ${theme.colors.text};
                margin-bottom: 2rem;
                text-align: center;
                
                @media (max-width: 768px) {
                  font-size: 1.75rem;
                }
              `}
            >
              Beyond the Code
            </h2>
            <p
              css={css`
                font-family: HelveticaNeueLTStd-Roman, sans-serif;
                font-size: 1.125rem;
                color: ${theme.colors.text};
                line-height: 1.7;
                text-align: center;
                margin-bottom: 2rem;
                opacity: 0.9;
              `}
            >
              When I'm not debugging or mastering the latest frameworks, you'll find me negotiating
              dinner menus with my two dogs, exploring vintage internet archives, or diving deep
              into the philosophy of clean code architecture.
            </p>
            
            <InterestGrid>
              <InterestCard theme={theme}>
                {typeof window !== 'undefined' && <FaCode />}
                <div>
                  <h3
                    css={css`
                      font-family: HelveticaNeueLTStd-Bd, sans-serif;
                      font-size: 1rem;
                      color: ${theme.colors.text};
                      margin-bottom: 0.25rem;
                    `}
                  >
                    Clean Code
                  </h3>
                  <p
                    css={css`
                      font-family: HelveticaNeueLTStd-Roman, sans-serif;
                      font-size: 0.9rem;
                      color: ${theme.colors.textSecondary};
                      margin: 0;
                    `}
                  >
                    Readable, maintainable solutions
                  </p>
                </div>
              </InterestCard>
              
              <InterestCard theme={theme}>
                {typeof window !== 'undefined' && <FaCoffee />}
                <div>
                  <h3
                    css={css`
                      font-family: HelveticaNeueLTStd-Bd, sans-serif;
                      font-size: 1rem;
                      color: ${theme.colors.text};
                      margin-bottom: 0.25rem;
                    `}
                  >
                    Coffee & Code
                  </h3>
                  <p
                    css={css`
                      font-family: HelveticaNeueLTStd-Roman, sans-serif;
                      font-size: 0.9rem;
                      color: ${theme.colors.textSecondary};
                      margin: 0;
                    `}
                  >
                    Fuel for late-night debugging
                  </p>
                </div>
              </InterestCard>
              
              <InterestCard theme={theme}>
                {typeof window !== 'undefined' && <FaDog />}
                <div>
                  <h3
                    css={css`
                      font-family: HelveticaNeueLTStd-Bd, sans-serif;
                      font-size: 1rem;
                      color: ${theme.colors.text};
                      margin-bottom: 0.25rem;
                    `}
                  >
                    Dog Parent
                  </h3>
                  <p
                    css={css`
                      font-family: HelveticaNeueLTStd-Roman, sans-serif;
                      font-size: 0.9rem;
                      color: ${theme.colors.textSecondary};
                      margin: 0;
                    `}
                  >
                    Expert at dinner negotiations
                  </p>
                </div>
              </InterestCard>
            </InterestGrid>
          </PersonalSection>
          
          <div
            css={css`
              text-align: center;
              margin-top: 2rem;
            `}
          >
            <Image
              css={css`
                max-width: 400px;
                margin: 0 auto;
                border-radius: 12px;
                box-shadow: ${theme.shadows.medium};
              `}
            />
          </div>
        </section>
      </StyledContainer>

      <section 
        ref={techRef}
        aria-labelledby="tech-stack"
        css={css`
          opacity: ${techVisible ? 1 : 0};
          transform: ${techVisible ? 'translateY(0)' : 'translateY(30px)'};
          transition: all ${theme.transitions.slow};
        `}
      >
        <StyledSubContainer theme={theme}>
          <h2
            id="tech-stack"
            css={css`
              font-family: HelveticaNeueLTStd-Bd, sans-serif;
              font-size: 2.25rem;
              background: ${theme.gradients.accent};
              background-clip: text;
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              margin-bottom: 0.5rem;
              text-align: center;
              
              @media (max-width: 768px) {
                font-size: 1.875rem;
              }
            `}
          >
            Technology Stack & Tools
          </h2>
          <p
            css={css`
              font-family: HelveticaNeueLTStd-Roman, sans-serif;
              font-size: 1.125rem;
              color: ${theme.colors.textSecondary};
              text-align: center;
              margin-bottom: 1rem;
              line-height: 1.6;
            `}
          >
            The tools and technologies that power my development workflow
          </p>
          
          <TechGrid>
            <TechItem theme={theme}>
              {typeof window !== 'undefined' && <DiIntellij
                css={css`
                  font-size: 4rem;
                  color: ${theme.colors.accent};
                  margin-bottom: 1rem;
                  transition: all ${theme.transitions.normal};
                  
                  ${TechItem}:hover & {
                    transform: scale(1.1);
                  }
                  
                  @media (max-width: 480px) {
                    font-size: 3rem;
                  }
                `}
                title="JetBrains IntelliJ"
              />}
              <h3
                css={css`
                  font-family: HelveticaNeueLTStd-Bd, sans-serif;
                  font-size: 1.125rem;
                  color: ${theme.colors.text};
                  margin-bottom: 0.5rem;
                `}
              >
                IntelliJ IDEA
              </h3>
              <p
                css={css`
                  font-family: HelveticaNeueLTStd-Roman, sans-serif;
                  font-size: 0.9rem;
                  color: ${theme.colors.textSecondary};
                  margin: 0;
                  text-align: center;
                `}
              >
                Primary development environment
              </p>
            </TechItem>
            
            <TechItem theme={theme}>
              {typeof window !== 'undefined' && <DiMozilla
                css={css`
                  font-size: 4rem;
                  color: ${theme.colors.accent};
                  margin-bottom: 1rem;
                  transition: all ${theme.transitions.normal};
                  
                  ${TechItem}:hover & {
                    transform: scale(1.1);
                  }
                  
                  @media (max-width: 480px) {
                    font-size: 3rem;
                  }
                `}
                title="Mozilla Firefox"
              />}
              <h3
                css={css`
                  font-family: HelveticaNeueLTStd-Bd, sans-serif;
                  font-size: 1.125rem;
                  color: ${theme.colors.text};
                  margin-bottom: 0.5rem;
                `}
              >
                Firefox
              </h3>
              <p
                css={css`
                  font-family: HelveticaNeueLTStd-Roman, sans-serif;
                  font-size: 0.9rem;
                  color: ${theme.colors.textSecondary};
                  margin: 0;
                  text-align: center;
                `}
              >
                Development & testing browser
              </p>
            </TechItem>
            
            <TechItem theme={theme}>
              {typeof window !== 'undefined' && <DiDebian
                css={css`
                  font-size: 4rem;
                  color: ${theme.colors.accent};
                  margin-bottom: 1rem;
                  transition: all ${theme.transitions.normal};
                  
                  ${TechItem}:hover & {
                    transform: scale(1.1);
                  }
                  
                  @media (max-width: 480px) {
                    font-size: 3rem;
                  }
                `}
                title="Debian Linux"
              />}
              <h3
                css={css`
                  font-family: HelveticaNeueLTStd-Bd, sans-serif;
                  font-size: 1.125rem;
                  color: ${theme.colors.text};
                  margin-bottom: 0.5rem;
                `}
              >
                Debian Linux
              </h3>
              <p
                css={css`
                  font-family: HelveticaNeueLTStd-Roman, sans-serif;
                  font-size: 0.9rem;
                  color: ${theme.colors.textSecondary};
                  margin: 0;
                  text-align: center;
                `}
              >
                Preferred operating system
              </p>
            </TechItem>
            
            <TechItem theme={theme}>
              {typeof window !== 'undefined' && <FaPiedPiperAlt
                css={css`
                  font-size: 4rem;
                  color: ${theme.colors.accent};
                  margin-bottom: 1rem;
                  transition: all ${theme.transitions.normal};
                  
                  ${TechItem}:hover & {
                    transform: scale(1.1);
                  }
                  
                  @media (max-width: 480px) {
                    font-size: 3rem;
                  }
                `}
                title="Pied Piper (Silicon Valley Reference)"
              />}
              <h3
                css={css`
                  font-family: HelveticaNeueLTStd-Bd, sans-serif;
                  font-size: 1.125rem;
                  color: ${theme.colors.text};
                  margin-bottom: 0.5rem;
                `}
              >
                Pied Piper
              </h3>
              <p
                css={css`
                  font-family: HelveticaNeueLTStd-Roman, sans-serif;
                  font-size: 0.9rem;
                  color: ${theme.colors.textSecondary};
                  margin: 0;
                  text-align: center;
                `}
              >
                Optimal compression algorithm
              </p>
            </TechItem>
          </TechGrid>
        </StyledSubContainer>
      </section>

      <section 
        aria-labelledby="supported-organizations"
        css={css`
          text-align: center;
          margin-top: 4rem;
        `}
      >
        <h2 
          id="supported-organizations"
          css={css`
            font-family: HelveticaNeueLTStd-Bd, sans-serif;
            font-size: 2rem;
            background: ${theme.gradients.accent};
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 2rem;
            
            @media (max-width: 768px) {
              font-size: 1.75rem;
            }
          `}
        >
          Supported Organizations
        </h2>
        <div
          css={css`
            max-width: 300px;
            margin: 0 auto;
          `}
        >
          <Logo />
        </div>
      </section>
    </main>
  </Layout>
  );
};

export default AboutPage;
