import React from 'react';
import styled from 'styled-components';
import { DiIntellij, DiMozilla, DiDebian, DiGit } from 'react-icons/di';
import { useTheme } from '../context/ThemeContext';

import Layout from '../components/layout';
import SEO from '../components/seo';
import Image from '../components/image';
import Logo from '../components/logo';
import ClientOnlyIcon from '../components/ClientOnlyIcon';
import useScrollAnimation from '../hooks/useScrollAnimation';
import PageTransition from '../components/PageTransition';

// Simple styled components to replace MUI components
const Typography = styled.div`
  margin: 0;
  font-family: inherit;
  font-weight: ${(props) =>
    props.variant === 'h1'
      ? 300
      : props.variant === 'h2'
        ? 300
        : props.variant === 'h3'
          ? 400
          : props.variant === 'h4'
            ? 400
            : props.variant === 'h5'
              ? 400
              : props.variant === 'body1'
                ? 400
                : props.variant === 'body2'
                  ? 400
                  : 400};
  font-size: ${(props) =>
    props.variant === 'h1'
      ? '6rem'
      : props.variant === 'h2'
        ? '3.75rem'
        : props.variant === 'h3'
          ? '3rem'
          : props.variant === 'h4'
            ? '2.125rem'
            : props.variant === 'h5'
              ? '1.5rem'
              : props.variant === 'body1'
                ? '1rem'
                : props.variant === 'body2'
                  ? '0.875rem'
                  : '1rem'};
  line-height: ${(props) =>
    props.variant === 'h1'
      ? 1.167
      : props.variant === 'h2'
        ? 1.2
        : props.variant === 'h3'
          ? 1.167
          : props.variant === 'h4'
            ? 1.235
            : props.variant === 'h5'
              ? 1.334
              : props.variant === 'body1'
                ? 1.5
                : props.variant === 'body2'
                  ? 1.43
                  : 1.5};
  color: ${(props) => {
    if (props.theme?.mode === 'dark') {
      if (props.color === 'text.secondary') return 'rgba(255, 255, 255, 0.7)';
      return props.customColor || 'rgba(255, 255, 255, 0.87)';
    }
    if (props.color === 'text.secondary') return 'rgba(0, 0, 0, 0.6)';
    return props.customColor || 'rgba(0, 0, 0, 0.87)';
  }};
  margin-bottom: ${(props) => (props.gutterBottom ? '0.35em' : '0')};
  text-align: ${(props) => props.align || 'inherit'};
  transition: color 0.3s ease;
`;


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
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));

    @media (max-width: 767px) {
      grid-template-columns: 1fr;
    }

    @media (min-width: 768px) and (max-width: 1024px) {
      grid-template-columns: 1fr 1fr;

      & > :last-child {
        grid-column: 1 / -1;
        max-width: 50%;
        margin: 0 auto;
      }
    }

    @media (min-width: 1025px) {
      grid-template-columns: repeat(3, 1fr);
    }
  }
`;

const GridItem = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;








function AboutPage() {
  const { theme } = useTheme();
  const [headerRef] = useScrollAnimation({ delay: 100 });
  const [techRef] = useScrollAnimation({ delay: 300 });
  const [personalRef] = useScrollAnimation({ delay: 500 });

  return (
    <Layout>
      <PageTransition>
        <SEO
          title="About"
          description="Meet Jeff Maxwell, Full Stack Developer. Technology stack, development process, and the team behind innovative web solutions and modern applications."
          pathname="/about/"
          keywords={[
            `about me`,
            `development team`,
            `web developer bio`,
            `technology stack`,
            `development tools`,
            `full stack developer profile`,
          ]}
        />
        <StyledContainer>
          <StyledBox
            as="section"
            aria-labelledby="about-header"
            ref={headerRef}
            mb={8}
            style={{ textAlign: 'center', paddingTop: '40px' }}
          >
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
                About Me
              </Typography>
              <Typography
                theme={theme}
                variant="h5"
                component="h2"
                color="text.secondary"
                style={{
                  maxWidth: 700,
                  margin: '0 auto',
                  fontSize: '1.375rem',
                  lineHeight: 1.5,
                  fontWeight: 400,
                  letterSpacing: '0.01em',
                }}
              >
                Full stack developer passionate about creating elegant solutions to complex
                problems. When I&apos;m not coding, I&apos;m exploring new technologies and perfecting my
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
              <GridContainer className="center-last" spacing={3}>
                <GridItem>
                  <div
                    style={{
                      background:
                        theme?.mode === 'dark' ? theme?.colors?.paper || '#1a1a1a' : '#ffffff',
                      borderRadius: '16px',
                      padding: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      height: '100%',
                      boxShadow:
                        theme?.mode === 'dark'
                          ? '0px 2px 8px rgba(0, 0, 0, 0.3)'
                          : '0px 2px 8px rgba(0, 0, 0, 0.06)',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease, background 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow:
                          theme?.mode === 'dark'
                            ? '0px 4px 16px rgba(0, 0, 0, 0.4)'
                            : '0px 4px 16px rgba(0, 0, 0, 0.12)',
                      },
                    }}
                  >
                    <div
                      style={{
                        fontSize: '2rem',
                        color:
                          theme?.mode === 'dark' ? theme?.colors?.primary || '#90caf9' : '#1565c0',
                        flexShrink: 0,
                        transition: 'color 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <ClientOnlyIcon
                        iconName="CodeTerminal"
                        fontSize="large"
                        style={{
                          fontSize: '2.5rem',
                          color:
                            theme?.mode === 'dark'
                              ? theme?.colors?.primary || '#90caf9'
                              : '#1565c0',
                        }}
                      />
                    </div>
                    <StyledBox>
                      <Typography
                        theme={theme}
                        variant="h6"
                        style={{ fontWeight: 600, marginBottom: '4px', fontSize: '1.5rem' }}
                        customColor={
                          theme?.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.87)'
                            : 'rgba(0, 0, 0, 0.87)'
                        }
                      >
                        Clean Code
                      </Typography>
                      <Typography
                        theme={theme}
                        variant="body2"
                        style={{ lineHeight: 1.4, fontSize: '1.125rem' }}
                        customColor={
                          theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'
                        }
                      >
                        Readable, maintainable solutions
                      </Typography>
                    </StyledBox>
                  </div>
                </GridItem>
                <GridItem>
                  <div
                    style={{
                      background:
                        theme?.mode === 'dark' ? theme?.colors?.paper || '#1a1a1a' : '#ffffff',
                      borderRadius: '16px',
                      padding: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      height: '100%',
                      boxShadow:
                        theme?.mode === 'dark'
                          ? '0px 2px 8px rgba(0, 0, 0, 0.3)'
                          : '0px 2px 8px rgba(0, 0, 0, 0.06)',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease, background 0.3s ease',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '2rem',
                        color:
                          theme?.mode === 'dark' ? theme?.colors?.primary || '#90caf9' : '#1565c0',
                        flexShrink: 0,
                        transition: 'color 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <ClientOnlyIcon
                        iconName="Coffee"
                        fontSize="large"
                        style={{
                          fontSize: '2rem',
                          color:
                            theme?.mode === 'dark'
                              ? theme?.colors?.primary || '#90caf9'
                              : '#1565c0',
                        }}
                      />
                    </div>
                    <StyledBox>
                      <Typography
                        theme={theme}
                        variant="h6"
                        style={{ fontWeight: 600, marginBottom: '4px', fontSize: '1.5rem' }}
                        customColor={
                          theme?.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.87)'
                            : 'rgba(0, 0, 0, 0.87)'
                        }
                      >
                        Coffee & Code
                      </Typography>
                      <Typography
                        theme={theme}
                        variant="body2"
                        style={{ lineHeight: 1.4, fontSize: '1.125rem' }}
                        customColor={
                          theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'
                        }
                      >
                        Fuel for late-night debugging
                      </Typography>
                    </StyledBox>
                  </div>
                </GridItem>
                <GridItem>
                  <div
                    style={{
                      background:
                        theme?.mode === 'dark' ? theme?.colors?.paper || '#1a1a1a' : '#ffffff',
                      borderRadius: '16px',
                      padding: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      height: '100%',
                      boxShadow:
                        theme?.mode === 'dark'
                          ? '0px 2px 8px rgba(0, 0, 0, 0.3)'
                          : '0px 2px 8px rgba(0, 0, 0, 0.06)',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease, background 0.3s ease',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '2rem',
                        color:
                          theme?.mode === 'dark' ? theme?.colors?.primary || '#90caf9' : '#1565c0',
                        flexShrink: 0,
                        transition: 'color 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <ClientOnlyIcon
                        iconName="Dog"
                        fontSize="large"
                        style={{
                          fontSize: '2.5rem',
                          color:
                            theme?.mode === 'dark'
                              ? theme?.colors?.primary || '#90caf9'
                              : '#1565c0',
                        }}
                      />
                    </div>
                    <StyledBox>
                      <Typography
                        theme={theme}
                        variant="h6"
                        style={{ fontWeight: 600, marginBottom: '4px', fontSize: '1.5rem' }}
                        customColor={
                          theme?.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.87)'
                            : 'rgba(0, 0, 0, 0.87)'
                        }
                      >
                        Dog Parent
                      </Typography>
                      <Typography
                        theme={theme}
                        variant="body2"
                        style={{ lineHeight: 1.4, fontSize: '1.125rem' }}
                        customColor={
                          theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'
                        }
                      >
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
            <GridContainer
              spacing={4}
              style={{
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                '@media (min-width: 768px)': {
                  gridTemplateColumns: '1fr 1fr',
                },
              }}
            >
              <GridItem>
                <div
                  style={{
                    borderRadius: '24px',
                    backgroundColor: '#1565c0',
                    aspectRatio: '1 / 1',
                    minHeight: '350px',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow:
                      '0px 8px 24px rgba(21, 101, 192, 0.2), 0px 4px 12px rgba(0, 0, 0, 0.08)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow:
                        '0px 12px 32px rgba(21, 101, 192, 0.3), 0px 8px 16px rgba(0, 0, 0, 0.12)',
                    },
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
                    boxShadow:
                      '0px 8px 24px rgba(21, 101, 192, 0.2), 0px 4px 12px rgba(0, 0, 0, 0.08)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow:
                        '0px 12px 32px rgba(21, 101, 192, 0.3), 0px 8px 16px rgba(0, 0, 0, 0.12)',
                    },
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
                    boxShadow:
                      '0px 8px 24px rgba(21, 101, 192, 0.2), 0px 4px 12px rgba(0, 0, 0, 0.08)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow:
                        '0px 12px 32px rgba(21, 101, 192, 0.3), 0px 8px 16px rgba(0, 0, 0, 0.12)',
                    },
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
                textAlign: 'center',
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
                theme={theme}
                variant="body1"
                color="text.secondary"
                style={{
                  fontSize: '1.125rem',
                  maxWidth: '600px',
                  margin: '0 auto 48px auto',
                  lineHeight: 1.5,
                }}
              >
                The tools and technologies that power my development workflow
              </Typography>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '32px',
                  maxWidth: '800px',
                  margin: '0 auto',
                }}
              >
                <div
                  style={{
                    background:
                      theme?.mode === 'dark' ? theme?.colors?.paper || '#1a1a1a' : '#ffffff',
                    borderRadius: '16px',
                    padding: '32px 16px',
                    textAlign: 'center',
                    boxShadow:
                      theme?.mode === 'dark'
                        ? '0px 2px 8px rgba(0, 0, 0, 0.3)'
                        : '0px 2px 8px rgba(0, 0, 0, 0.06)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease, background 0.3s ease',
                  }}
                >
                  <div
                    style={{
                      fontSize: '3.5rem',
                      color:
                        theme?.mode === 'dark' ? theme?.colors?.primary || '#90caf9' : '#1565c0',
                      marginBottom: '16px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '80px',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    <DiIntellij />
                  </div>
                  <Typography
                    theme={theme}
                    variant="h6"
                    style={{ fontWeight: 600, marginBottom: '8px', fontSize: '1.125rem' }}
                    customColor={
                      theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)'
                    }
                  >
                    IntelliJ IDEA
                  </Typography>
                  <Typography
                    theme={theme}
                    variant="body2"
                    style={{ lineHeight: 1.4, fontSize: '0.875rem' }}
                    customColor={
                      theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'
                    }
                  >
                    Primary development environment
                  </Typography>
                </div>

                <div
                  style={{
                    background:
                      theme?.mode === 'dark' ? theme?.colors?.paper || '#1a1a1a' : '#ffffff',
                    borderRadius: '16px',
                    padding: '32px 16px',
                    textAlign: 'center',
                    boxShadow:
                      theme?.mode === 'dark'
                        ? '0px 2px 8px rgba(0, 0, 0, 0.3)'
                        : '0px 2px 8px rgba(0, 0, 0, 0.06)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease, background 0.3s ease',
                  }}
                >
                  <div
                    style={{
                      fontSize: '3.5rem',
                      color:
                        theme?.mode === 'dark' ? theme?.colors?.primary || '#90caf9' : '#1565c0',
                      marginBottom: '16px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '80px',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    <DiMozilla />
                  </div>
                  <Typography
                    theme={theme}
                    variant="h6"
                    style={{ fontWeight: 600, marginBottom: '8px', fontSize: '1.125rem' }}
                    customColor={
                      theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)'
                    }
                  >
                    Firefox
                  </Typography>
                  <Typography
                    theme={theme}
                    variant="body2"
                    style={{ lineHeight: 1.4, fontSize: '0.875rem' }}
                    customColor={
                      theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'
                    }
                  >
                    Development & testing browser
                  </Typography>
                </div>

                <div
                  style={{
                    background:
                      theme?.mode === 'dark' ? theme?.colors?.paper || '#1a1a1a' : '#ffffff',
                    borderRadius: '16px',
                    padding: '32px 16px',
                    textAlign: 'center',
                    boxShadow:
                      theme?.mode === 'dark'
                        ? '0px 2px 8px rgba(0, 0, 0, 0.3)'
                        : '0px 2px 8px rgba(0, 0, 0, 0.06)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease, background 0.3s ease',
                  }}
                >
                  <div
                    style={{
                      fontSize: '3.5rem',
                      color:
                        theme?.mode === 'dark' ? theme?.colors?.primary || '#90caf9' : '#1565c0',
                      marginBottom: '16px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '80px',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    <DiDebian />
                  </div>
                  <Typography
                    theme={theme}
                    variant="h6"
                    style={{ fontWeight: 600, marginBottom: '8px', fontSize: '1.125rem' }}
                    customColor={
                      theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)'
                    }
                  >
                    Debian Linux
                  </Typography>
                  <Typography
                    theme={theme}
                    variant="body2"
                    style={{ lineHeight: 1.4, fontSize: '0.875rem' }}
                    customColor={
                      theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'
                    }
                  >
                    Preferred operating system
                  </Typography>
                </div>

                <div
                  style={{
                    background:
                      theme?.mode === 'dark' ? theme?.colors?.paper || '#1a1a1a' : '#ffffff',
                    borderRadius: '16px',
                    padding: '32px 16px',
                    textAlign: 'center',
                    boxShadow:
                      theme?.mode === 'dark'
                        ? '0px 2px 8px rgba(0, 0, 0, 0.3)'
                        : '0px 2px 8px rgba(0, 0, 0, 0.06)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease, background 0.3s ease',
                  }}
                >
                  <div
                    style={{
                      fontSize: '3.5rem',
                      color:
                        theme?.mode === 'dark' ? theme?.colors?.primary || '#90caf9' : '#1565c0',
                      marginBottom: '16px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '80px',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    <DiGit />
                  </div>
                  <Typography
                    theme={theme}
                    variant="h6"
                    style={{ fontWeight: 600, marginBottom: '8px', fontSize: '1.125rem' }}
                    customColor={
                      theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)'
                    }
                  >
                    Git
                  </Typography>
                  <Typography
                    theme={theme}
                    variant="body2"
                    style={{ lineHeight: 1.4, fontSize: '0.875rem' }}
                    customColor={
                      theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'
                    }
                  >
                    Version control system
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
              <StyledBox style={{ maxWidth: '600px', margin: '0 auto' }}>
                <Logo />
              </StyledBox>
            </div>
          </StyledBox>
        </StyledContainer>
      </PageTransition>
    </Layout>
  );
}

export default AboutPage;
