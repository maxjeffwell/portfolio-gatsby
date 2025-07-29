import React from 'react';
import styled from 'styled-components';

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

    @media (min-width: 768px) {
      grid-template-columns: repeat(4, 1fr);
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
        <StyledBox as="section" aria-labelledby="about-header" ref={headerRef} mb={6}>
          <div style={{ willChange: 'opacity' }}>
            <GradientText
              variant="h2"
              component="h1"
              id="about-header"
              align="center"
              gutterBottom
            >
              About Jeff Maxwell
            </GradientText>
            <Typography
              variant="h5"
              component="h2"
              align="center"
              color="text.secondary"
              style={{ maxWidth: 600, margin: '0 auto' }}
            >
              Full stack developer passionate about creating elegant solutions to complex
              problems. When I&#39;m not coding, I&#39;m exploring new technologies and perfecting
              my craft.
            </Typography>
          </div>
        </StyledBox>
        <StyledBox as="section" aria-labelledby="personal-section" ref={personalRef} mb={6}>
          <PersonalCard>
                <Typography 
                  variant="h3" 
                  component="h2" 
                  id="personal-section"
                  align="center" 
                  gutterBottom
                  style={{ marginBottom: '32px', fontSize: '2rem' }}
                >
                  What Drives Me
                </Typography>
                <GridContainer className="three-column" spacing={2}>
                    <GridItem>
                      <InterestItem>
                        <CodeIcon />
                        <StyledBox>
                          <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                            Clean Code
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Readable, maintainable solutions
                          </Typography>
                        </StyledBox>
                      </InterestItem>
                    </GridItem>
                    <GridItem>
                      <InterestItem>
                        <CoffeeIcon />
                        <StyledBox>
                          <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                            Coffee & Code
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Fuel for late-night debugging
                          </Typography>
                        </StyledBox>
                      </InterestItem>
                    </GridItem>
                    <GridItem>
                      <InterestItem>
                        <PetsIcon />
                        <StyledBox>
                          <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                            Dog Parent
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Expert at dinner negotiations
                          </Typography>
                        </StyledBox>
                      </InterestItem>
                    </GridItem>
                </GridContainer>
              </PersonalCard>
        </StyledBox>

        <StyledBox as="section" aria-labelledby="illustrations-section">
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
          <GridContainer className="center-last" spacing={4} mb={6}>
              <GridItem>
                <StyledCard
                  style={{
                    borderRadius: 24,
                    backgroundColor: 'rgb(0, 89, 149)',
                    aspectRatio: '1 / 1',
                    minHeight: '400px',
                    position: 'relative',
                    willChange: 'transform',
                  }}
                >
                  <StyledBox
                    height="100%"
                    display="flex"
                    alignItems="center"
                    style={{ justifyContent: 'center' }}
                  >
                    <Image imageType="mascot" />
                  </StyledBox>
                </StyledCard>
              </GridItem>
              <GridItem>
                <StyledCard
                  style={{
                    borderRadius: 24,
                    backgroundColor: 'rgb(0, 89, 149)',
                    aspectRatio: '1 / 1',
                    minHeight: '400px',
                    position: 'relative',
                    willChange: 'transform',
                  }}
                >
                  <StyledBox
                    height="100%"
                    display="flex"
                    alignItems="center"
                    style={{ justifyContent: 'center' }}
                  >
                    <Image imageType="dogs" />
                  </StyledBox>
                </StyledCard>
              </GridItem>
              <GridItem>
                <StyledCard
                  style={{
                    borderRadius: 24,
                    backgroundColor: 'rgb(0, 89, 149)',
                    aspectRatio: '1 / 1',
                    minHeight: '400px',
                    position: 'relative',
                    willChange: 'transform',
                  }}
                >
                  <StyledBox
                    height="100%"
                    display="flex"
                    alignItems="center"
                    style={{ justifyContent: 'center' }}
                  >
                    <Image imageType="developer" />
                  </StyledBox>
                </StyledCard>
              </GridItem>
            </GridContainer>
        </StyledBox>

        <StyledBox as="section" aria-labelledby="tech-stack" ref={techRef} mb={6}>
          <TechSection style={{ willChange: 'transform' }}>
                <GradientText
                  variant="h2"
                  component="h2"
                  id="tech-stack"
                  align="center"
                  gutterBottom
                >
                  Technology Stack & Tools
                </GradientText>
                <Typography
                  variant="body1"
                  align="center"
                  color="text.secondary"
                  paragraph
                  style={{ fontSize: '1.125rem' }}
                >
                  The tools and technologies that power my development workflow
                </Typography>

                <GridContainer className="four-column" spacing={3} mt={2}>
                    <GridItem>
                      <TechCard>
                        <StyledIcon>
                          <DiIntellij />
                        </StyledIcon>
                        <Typography variant="h6" component="h3" gutterBottom>
                          IntelliJ IDEA
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Primary development environment
                        </Typography>
                      </TechCard>
                    </GridItem>

                    <GridItem>
                      <TechCard>
                        <StyledIcon>
                          <DiMozilla />
                        </StyledIcon>
                        <Typography variant="h6" component="h3" gutterBottom>
                          Firefox
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Development & testing browser
                        </Typography>
                      </TechCard>
                    </GridItem>

                    <GridItem>
                      <TechCard>
                        <StyledIcon>
                          <DiDebian />
                        </StyledIcon>
                        <Typography variant="h6" component="h3" gutterBottom>
                          Debian Linux
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Preferred operating system
                        </Typography>
                      </TechCard>
                    </GridItem>

                    <GridItem>
                      <TechCard>
                        <StyledIcon>
                          <FaPiedPiperAlt />
                        </StyledIcon>
                        <Typography variant="h6" component="h3" gutterBottom>
                          Pied Piper
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Optimal compression algorithm
                        </Typography>
                      </TechCard>
                    </GridItem>
                  </GridContainer>
              </TechSection>
        </StyledBox>

        <StyledBox as="section" aria-labelledby="organizations" textAlign="center" mt={6}>
          <GradientText variant="h2" component="h2" id="organizations" gutterBottom>
            Supported Organizations
          </GradientText>
          <StyledBox maxWidth={300} mx="auto">
            <Logo />
          </StyledBox>
        </StyledBox>
      </StyledContainer>
    </Layout>
  );
}

export default AboutPage;
