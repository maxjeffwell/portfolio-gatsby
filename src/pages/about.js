import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';

// Simple styled components to replace MUI components
const Typography = styled.div`
  margin: 0;
  font-family: inherit;
  font-weight: ${props => 
    props.variant === 'h1' ? 300 :
    props.variant === 'h2' ? 300 :
    props.variant === 'h3' ? 400 :
    props.variant === 'h4' ? 400 :
    props.variant === 'h5' ? 400 :
    props.variant === 'body1' ? 400 :
    props.variant === 'body2' ? 400 :
    400
  };
  font-size: ${props => 
    props.variant === 'h1' ? '6rem' :
    props.variant === 'h2' ? '3.75rem' :
    props.variant === 'h3' ? '3rem' :
    props.variant === 'h4' ? '2.125rem' :
    props.variant === 'h5' ? '1.5rem' :
    props.variant === 'body1' ? '1rem' :
    props.variant === 'body2' ? '0.875rem' :
    '1rem'
  };
  line-height: ${props => 
    props.variant === 'h1' ? 1.167 :
    props.variant === 'h2' ? 1.2 :
    props.variant === 'h3' ? 1.167 :
    props.variant === 'h4' ? 1.235 :
    props.variant === 'h5' ? 1.334 :
    props.variant === 'body1' ? 1.5 :
    props.variant === 'body2' ? 1.43 :
    1.5
  };
  color: ${props => {
    if (props.theme?.mode === 'dark') {
      if (props.color === 'text.secondary') return 'rgba(255, 255, 255, 0.7)';
      return props.customColor || 'rgba(255, 255, 255, 0.87)';
    }
    if (props.color === 'text.secondary') return 'rgba(0, 0, 0, 0.6)';
    return props.customColor || 'rgba(0, 0, 0, 0.87)';
  }};
  margin-bottom: ${props => props.gutterBottom ? '0.35em' : '0'};
  text-align: ${props => props.align || 'inherit'};
  transition: color 0.3s ease;
`;

// Simple icon components
const CodeIcon = styled.span`
  font-size: 24px;
  &::before {
    content: '💻';
  }
`;

const CoffeeIcon = styled.span`
  font-size: 24px;
  &::before {
    content: '☕';
  }
`;

const PetsIcon = styled.span`
  font-size: 24px;
  &::before {
    content: '🐕';
  }
`;
import { DiIntellij, DiMozilla, DiDebian } from 'react-icons/di';
import { FaPiedPiperAlt } from 'react-icons/fa';

import Layout from '../components/layout';
import SEO from '../components/seo';
import Image from '../components/image';
import Logo from '../components/logo';
import useScrollAnimation from '../hooks/useScrollAnimation';

const StyledContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;

  @media (max-width: 600px) {
    padding: 0 16px;
  }
`;

const StyledBox = styled.div`
  margin-bottom: ${(props) => (props.mb ? `${props.mb * 8}px` : '0')};
  margin-top: ${(props) => (props.mt ? `${props.mt * 8}px` : '0')};
  text-align: ${(props) => props.textAlign || 'inherit'};
  display: ${(props) => props.display || 'block'};
  flex-direction: ${(props) => props.flexDirection || 'row'};
  align-items: ${(props) => props.alignItems || 'stretch'};
  gap: ${(props) => (props.gap ? `${props.gap * 8}px` : '0')};
  padding: ${(props) => (props.p ? `${props.p * 8}px` : '0')};
  padding-top: ${(props) => (props.pt ? `${props.pt * 8}px` : 'inherit')};
  padding-bottom: ${(props) => (props.pb ? `${props.pb * 8}px` : 'inherit')};
  border-radius: ${(props) => (props.borderRadius ? `${props.borderRadius * 8}px` : '0')};
  overflow: ${(props) => props.overflow || 'visible'};
  position: ${(props) => props.position || 'static'};
  min-height: ${(props) => props.minHeight || 'auto'};
  background-color: ${(props) =>
    props.bgColor === 'hover' ? 'rgba(0, 0, 0, 0.04)' : 'transparent'};
  height: ${(props) => props.height || 'auto'};
  width: ${(props) => props.width || 'auto'};
  left: ${(props) => props.left || 'auto'};
  font-size: ${(props) => props.fontSize || 'inherit'};
  max-width: ${(props) => (props.maxWidth ? `${props.maxWidth}px` : 'none')};
  margin-left: ${(props) => (props.mx === 'auto' ? 'auto' : 'inherit')};
  margin-right: ${(props) => (props.mx === 'auto' ? 'auto' : 'inherit')};
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${(props) => (props.spacing ? `${props.spacing * 8}px` : '16px')};
  margin-bottom: ${(props) => (props.mb ? `${props.mb * 8}px` : '0')};
  margin-top: ${(props) => (props.mt ? `${props.mt * 8}px` : '0')};

  &.two-column {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));

    @media (min-width: 768px) {
      grid-template-columns: 1fr 1fr;
    }
  }

  &.three-column {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));

    @media (min-width: 768px) {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  &.four-column {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    justify-items: center;

    @media (min-width: 768px) {
      grid-template-columns: repeat(4, 1fr);
      justify-items: stretch;
    }
    
    /* Center lone items on smaller screens */
    @media (max-width: 767px) {
      & > :nth-child(4):last-child {
        grid-column: 1 / -1;
        max-width: 200px;
      }
    }
  }

  &.center-last {
    @media (min-width: 768px) {
      grid-template-columns: 1fr 1fr;

      & > :last-child {
        grid-column: 1 / -1;
        max-width: 50%;
        margin: 0 auto;
      }
    }
  }
`;

const GridItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const GradientText = styled(Typography)`
  background: linear-gradient(45deg, #fc4a1a, #f7b733);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
  will-change: transform;
  backface-visibility: hidden;
  transform: translateZ(0);
  -webkit-font-smoothing: antialiased;
`;

const TechSection = styled.div`
  padding: 32px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(240, 240, 240, 0.95) 0%, rgba(250, 250, 250, 0.9) 100%);
  backdrop-filter: blur(10px);
  box-shadow: 0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12);

  @media (prefers-color-scheme: dark) {
    background: linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(45, 45, 45, 0.9) 100%);
  }
`;

const PersonalCard = styled.div`
  padding: 24px;
  border-radius: 24px;
  background: linear-gradient(135deg, rgba(252, 74, 26, 0.1) 0%, rgba(247, 183, 51, 0.1) 100%);
  position: relative;
  overflow: hidden;
  box-shadow: 0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 30% 20%, rgba(252, 74, 26, 0.1) 0%, transparent 70%);
    z-index: 0;
  }

  & > * {
    position: relative;
    z-index: 1;
  }
`;

const TechCard = styled.div`
  text-align: center;
  padding: 24px 16px;
  height: 100%;
  min-height: 160px;
  transition:
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform, box-shadow;
  box-shadow: 0px 1px 3px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12);

  &:hover {
    transform: translateY(-8px);
    box-shadow:
      0px 5px 5px -3px rgba(0, 0, 0, 0.2),
      0px 8px 10px 1px rgba(0, 0, 0, 0.14),
      0px 3px 14px 2px rgba(0, 0, 0, 0.12);
  }
`;

const StyledCard = styled.div`
  box-shadow: 0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12);
  border-radius: 8px;
  overflow: hidden;
`;

const InterestItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 12px;
  background-color: rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }

  @media (prefers-color-scheme: dark) {
    background-color: rgba(255, 255, 255, 0.08);

    &:hover {
      background-color: rgba(255, 255, 255, 0.12);
    }
  }
`;

const StyledIcon = styled.div`
  font-size: 3.5rem;
  color: #fc4a1a;
  margin-bottom: 16px;
  transition: transform 0.3s ease;
  will-change: transform;

  .MuiCard-root:hover & {
    transform: scale(1.1) rotate(5deg);
  }
`;

function AboutPage() {
  const { theme } = useTheme();
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
      <StyledContainer>
        <StyledBox as="section" aria-labelledby="about-header" ref={headerRef} mb={8} style={{ textAlign: 'center', paddingTop: '40px' }}>
          <div style={{ willChange: 'opacity' }}>
            <Typography
              variant="h1"
              component="h1"
              id="about-header"
              style={{
                fontSize: 'clamp(2.5rem, 8vw, 4rem)',
                fontWeight: 700,
                lineHeight: 1.2,
                marginBottom: '32px',
                background: 'linear-gradient(135deg, #1565c0 0%, #9c27b0 50%, #e91e63 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em',
              }}
            >
              About Jeff Maxwell
            </Typography>
            <Typography
              variant="h5"
              component="h2"
              style={{
                maxWidth: 700,
                margin: '0 auto',
                fontSize: '1.375rem',
                lineHeight: 1.5,
                color: 'rgba(0, 0, 0, 0.7)',
                fontWeight: 400,
                letterSpacing: '0.01em',
              }}
            >
              Full stack developer passionate about creating elegant
              solutions to complex problems. When I'm not coding,
              I'm exploring new technologies and perfecting my
              craft.
            </Typography>
          </div>
        </StyledBox>
        <StyledBox as="section" aria-labelledby="personal-section" ref={personalRef} mb={8}>
          <div
            style={{
              background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 50%, #fce4ec 100%)',
              borderRadius: '24px',
              padding: '48px 32px',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08), 0px 1px 4px rgba(0, 0, 0, 0.04)',
            }}
          >
            <Typography 
              variant="h2" 
              component="h2" 
              id="personal-section"
              style={{
                position: 'absolute',
                left: '-10000px',
                width: '1px',
                height: '1px',
                overflow: 'hidden',
              }}
            >
              Personal Interests
            </Typography>
            <GridContainer className="three-column" spacing={3} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
              <GridItem>
                <div style={{
                  background: theme?.mode === 'dark' ? theme?.colors?.paper || '#1a1a1a' : '#ffffff',
                  borderRadius: '16px',
                  padding: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  boxShadow: theme?.mode === 'dark' ? '0px 2px 8px rgba(0, 0, 0, 0.3)' : '0px 2px 8px rgba(0, 0, 0, 0.06)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease, background 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme?.mode === 'dark' ? '0px 4px 16px rgba(0, 0, 0, 0.4)' : '0px 4px 16px rgba(0, 0, 0, 0.12)',
                  }
                }}>
                  <div style={{
                    fontSize: '2rem',
                    color: theme?.mode === 'dark' ? theme?.colors?.primary || '#90caf9' : '#1565c0',
                    flexShrink: 0,
                    transition: 'color 0.3s ease',
                  }}>
                    💻
                  </div>
                  <StyledBox>
                    <Typography theme={theme} variant="h6" style={{ fontWeight: 600, marginBottom: '4px' }} customColor={theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)'}>
                      Clean Code
                    </Typography>
                    <Typography theme={theme} variant="body2" style={{ lineHeight: 1.4 }} customColor={theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'}>
                      Readable, maintainable solutions
                    </Typography>
                  </StyledBox>
                </div>
              </GridItem>
              <GridItem>
                <div style={{
                  background: theme?.mode === 'dark' ? theme?.colors?.paper || '#1a1a1a' : '#ffffff',
                  borderRadius: '16px',
                  padding: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  boxShadow: theme?.mode === 'dark' ? '0px 2px 8px rgba(0, 0, 0, 0.3)' : '0px 2px 8px rgba(0, 0, 0, 0.06)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease, background 0.3s ease',
                }}>
                  <div style={{
                    fontSize: '2rem',
                    color: theme?.mode === 'dark' ? theme?.colors?.primary || '#90caf9' : '#1565c0',
                    flexShrink: 0,
                    transition: 'color 0.3s ease',
                  }}>
                    ☕
                  </div>
                  <StyledBox>
                    <Typography theme={theme} variant="h6" style={{ fontWeight: 600, marginBottom: '4px' }} customColor={theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)'}>
                      Coffee & Code
                    </Typography>
                    <Typography theme={theme} variant="body2" style={{ lineHeight: 1.4 }} customColor={theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'}>
                      Fuel for late-night debugging
                    </Typography>
                  </StyledBox>
                </div>
              </GridItem>
              <GridItem>
                <div style={{
                  background: theme?.mode === 'dark' ? theme?.colors?.paper || '#1a1a1a' : '#ffffff',
                  borderRadius: '16px',
                  padding: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  boxShadow: theme?.mode === 'dark' ? '0px 2px 8px rgba(0, 0, 0, 0.3)' : '0px 2px 8px rgba(0, 0, 0, 0.06)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease, background 0.3s ease',
                }}>
                  <div style={{
                    fontSize: '2rem',
                    color: theme?.mode === 'dark' ? theme?.colors?.primary || '#90caf9' : '#1565c0',
                    flexShrink: 0,
                    transition: 'color 0.3s ease',
                  }}>
                    🐾
                  </div>
                  <StyledBox>
                    <Typography theme={theme} variant="h6" style={{ fontWeight: 600, marginBottom: '4px' }} customColor={theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)'}>
                      Dog Parent
                    </Typography>
                    <Typography theme={theme} variant="body2" style={{ lineHeight: 1.4 }} customColor={theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'}>
                      Expert at dinner negotiations
                    </Typography>
                  </StyledBox>
                </div>
              </GridItem>
            </GridContainer>
          </div>
        </StyledBox>

        <StyledBox as="section" aria-labelledby="illustrations-section" mb={8}>
          <Typography
            variant="h2"
            component="h2"
            id="illustrations-section"
            style={{
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
          <GridContainer spacing={4} style={{ 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            '@media (min-width: 768px)': {
              gridTemplateColumns: '1fr 1fr'
            }
          }}>
            <GridItem>
              <div
                style={{
                  borderRadius: '24px',
                  backgroundColor: '#1565c0',
                  aspectRatio: '1 / 1',
                  minHeight: '350px',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0px 8px 24px rgba(21, 101, 192, 0.2), 0px 4px 12px rgba(0, 0, 0, 0.08)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0px 12px 32px rgba(21, 101, 192, 0.3), 0px 8px 16px rgba(0, 0, 0, 0.12)',
                  }
                }}
              >
                <StyledBox
                  height="100%"
                  display="flex"
                  alignItems="center"
                  style={{ justifyContent: 'center', padding: '24px' }}
                >
                  <Image imageType="mascot" />
                </StyledBox>
              </div>
            </GridItem>
            <GridItem>
              <div
                style={{
                  borderRadius: '24px',
                  backgroundColor: '#1565c0',
                  aspectRatio: '1 / 1',
                  minHeight: '350px',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0px 8px 24px rgba(21, 101, 192, 0.2), 0px 4px 12px rgba(0, 0, 0, 0.08)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0px 12px 32px rgba(21, 101, 192, 0.3), 0px 8px 16px rgba(0, 0, 0, 0.12)',
                  }
                }}
              >
                <StyledBox
                  height="100%"
                  display="flex"
                  alignItems="center"
                  style={{ justifyContent: 'center', padding: '24px' }}
                >
                  <Image imageType="dogs" />
                </StyledBox>
              </div>
            </GridItem>
          </GridContainer>
          
          {/* Center the third image */}
          <StyledBox mt={4} style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ maxWidth: '400px', width: '100%' }}>
              <div
                style={{
                  borderRadius: '24px',
                  backgroundColor: '#1565c0',
                  aspectRatio: '1 / 1',
                  minHeight: '350px',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0px 8px 24px rgba(21, 101, 192, 0.2), 0px 4px 12px rgba(0, 0, 0, 0.08)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0px 12px 32px rgba(21, 101, 192, 0.3), 0px 8px 16px rgba(0, 0, 0, 0.12)',
                  }
                }}
              >
                <StyledBox
                  height="100%"
                  display="flex"
                  alignItems="center"
                  style={{ justifyContent: 'center', padding: '24px' }}
                >
                  <Image imageType="developer" />
                </StyledBox>
              </div>
            </div>
          </StyledBox>
        </StyledBox>

        <StyledBox as="section" aria-labelledby="tech-stack" ref={techRef} mb={8} mt={8}>
          <div
            style={{
              background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
              borderRadius: '24px',
              padding: '64px 32px',
              textAlign: 'center'
            }}
          >
            <Typography
              variant="h2"
              component="h2"
              id="tech-stack"
              style={{
                fontSize: 'clamp(2rem, 6vw, 3rem)',
                fontWeight: 700,
                lineHeight: 1.2,
                marginBottom: '16px',
                background: 'linear-gradient(135deg, #1565c0 0%, #9c27b0 50%, #e91e63 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em',
              }}
            >
              Technology Stack & Tools
            </Typography>
            <Typography
              variant="body1"
              style={{
                fontSize: '1.125rem',
                color: 'rgba(0, 0, 0, 0.7)',
                maxWidth: '600px',
                margin: '0 auto 48px auto',
                lineHeight: 1.5,
              }}
            >
              The tools and technologies that power my development workflow
            </Typography>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '32px',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              <div style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '32px 16px',
                textAlign: 'center',
                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}>
                <div style={{
                  fontSize: '3.5rem',
                  color: '#1565c0',
                  marginBottom: '16px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '80px'
                }}>
                  <DiIntellij />
                </div>
                <Typography theme={theme} variant="h6" style={{ fontWeight: 600, marginBottom: '8px', fontSize: '1.125rem' }} customColor={theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)'}>
                  IntelliJ IDEA
                </Typography>
                <Typography theme={theme} variant="body2" style={{ lineHeight: 1.4, fontSize: '0.875rem' }} customColor={theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'}>
                  Primary development environment
                </Typography>
              </div>

              <div style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '32px 16px',
                textAlign: 'center',
                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}>
                <div style={{
                  fontSize: '3.5rem',
                  color: '#1565c0',
                  marginBottom: '16px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '80px'
                }}>
                  <DiMozilla />
                </div>
                <Typography theme={theme} variant="h6" style={{ fontWeight: 600, marginBottom: '8px', fontSize: '1.125rem' }} customColor={theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)'}>
                  Firefox
                </Typography>
                <Typography theme={theme} variant="body2" style={{ lineHeight: 1.4, fontSize: '0.875rem' }} customColor={theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'}>
                  Development & testing browser
                </Typography>
              </div>

              <div style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '32px 16px',
                textAlign: 'center',
                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}>
                <div style={{
                  fontSize: '3.5rem',
                  color: '#1565c0',
                  marginBottom: '16px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '80px'
                }}>
                  <DiDebian />
                </div>
                <Typography theme={theme} variant="h6" style={{ fontWeight: 600, marginBottom: '8px', fontSize: '1.125rem' }} customColor={theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)'}>
                  Debian Linux
                </Typography>
                <Typography theme={theme} variant="body2" style={{ lineHeight: 1.4, fontSize: '0.875rem' }} customColor={theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'}>
                  Preferred operating system
                </Typography>
              </div>

              <div style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '32px 16px',
                textAlign: 'center',
                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}>
                <div style={{
                  fontSize: '3.5rem',
                  color: '#1565c0',
                  marginBottom: '16px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '80px'
                }}>
                  <FaPiedPiperAlt />
                </div>
                <Typography theme={theme} variant="h6" style={{ fontWeight: 600, marginBottom: '8px', fontSize: '1.125rem' }} customColor={theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)'}>
                  Pied Piper
                </Typography>
                <Typography theme={theme} variant="body2" style={{ lineHeight: 1.4, fontSize: '0.875rem' }} customColor={theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'}>
                  Optimal compression algorithm
                </Typography>
              </div>
            </div>
          </div>
        </StyledBox>

        <StyledBox as="section" aria-labelledby="organizations" mt={8} mb={6}>
          <div style={{ textAlign: 'center' }}>
            <Typography
              variant="h2"
              component="h2"
              id="organizations"
              style={{
                fontSize: 'clamp(2rem, 6vw, 3rem)',
                fontWeight: 700,
                lineHeight: 1.2,
                marginBottom: '48px',
                background: 'linear-gradient(135deg, #1565c0 0%, #9c27b0 50%, #e91e63 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em',
              }}
            >
              Supported Organizations
            </Typography>
            <StyledBox style={{ maxWidth: '400px', margin: '0 auto' }}>
              <Logo />
            </StyledBox>
          </div>
        </StyledBox>

      </StyledContainer>
    </Layout>
  );
}

export default AboutPage;
