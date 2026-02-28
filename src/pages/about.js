import React from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';
import { SiWebstorm, SiMozilla, SiDebian, SiGit, SiAnthropic } from 'react-icons/si';

import Layout from '../components/layout';
import SEO from '../components/seo';
import Image from '../components/image';
import Logo from '../components/logo';
import ClientOnlyIcon from '../components/ClientOnlyIcon';
import useScrollAnimation from '../hooks/useScrollAnimation';
import PageTransition from '../components/PageTransition';
import SocialShare from '../components/SocialShare';

// Helper functions for Typography styles
const getTypographyFontWeight = (variant) => {
  switch (variant) {
    case 'h1':
    case 'h2':
      return 300;
    case 'h3':
    case 'h4':
    case 'h5':
    case 'body1':
    case 'body2':
    default:
      return 400;
  }
};

const getTypographyFontSize = (variant) => {
  switch (variant) {
    case 'h1':
      return '6rem';
    case 'h2':
      return '3.75rem';
    case 'h3':
      return '3rem';
    case 'h4':
      return '2.125rem';
    case 'h5':
      return '1.5rem';
    case 'body1':
      return '1rem';
    case 'body2':
      return '0.875rem';
    default:
      return '1rem';
  }
};

const getTypographyLineHeight = (variant) => {
  switch (variant) {
    case 'h1':
    case 'h3':
      return 1.167;
    case 'h2':
      return 1.2;
    case 'h4':
      return 1.235;
    case 'h5':
      return 1.334;
    case 'body1':
      return 1.5;
    case 'body2':
      return 1.43;
    default:
      return 1.5;
  }
};

const Typography = styled.div`
  margin: 0;
  font-family: ${(props) => {
    if (props.variant?.startsWith('h')) {
      return "'HelveticaNeueLTStd-Bd', 'HelveticaNeueBdFallback', 'AvenirLTStd-Roman', 'AvenirFallback', sans-serif";
    }
    return "'AvenirLTStd-Roman', 'AvenirFallback', 'HelveticaNeueLTStd-Roman', 'HelveticaNeueRomanFallback', sans-serif";
  }};
  font-weight: ${(props) => getTypographyFontWeight(props.variant)};
  font-size: ${(props) => getTypographyFontSize(props.variant)};
  line-height: ${(props) => getTypographyLineHeight(props.variant)};
  color: ${(props) => {
    if (props.color === 'text.secondary') return 'var(--text-secondary-color)';
    return 'var(--text-color)';
  }};
  margin-bottom: ${(props) => (props.gutterBottom ? '0.35em' : '0')};
  text-align: ${(props) => props.align || 'inherit'};
`;

const PageTitle = styled.h1`
  font-size: clamp(2.5rem, 8vw, 4rem);
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 32px;
  letter-spacing: -0.02em;
  font-family:
    'HelveticaNeueLTStd-Bd', 'HelveticaNeueBdFallback', 'AvenirLTStd-Roman', 'AvenirFallback',
    sans-serif;
  background: linear-gradient(135deg, #1565c0 0%, #9c27b0 50%, #e91e63 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  .dark-mode & {
    background: linear-gradient(135deg, #90caf9 0%, #ce93d8 50%, #f48fb1 100%);
    background-clip: text;
    -webkit-background-clip: text;
  }
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

const TechnologyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 32px;
  max-width: 800px;
  margin: 0 auto;

  /* Center the 5th item (Anthropic) when it's alone in the second row */
  @media (min-width: 768px) {
    & > div:nth-child(5):last-child {
      grid-column: 2 / 4;
      justify-self: center;
    }
  }

  /* For very large screens, ensure proper centering */
  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);

    & > div:nth-child(5):last-child {
      grid-column: 2 / 4;
      justify-self: center;
    }
  }
`;

function AboutPage() {
  const [headerRef] = useScrollAnimation({ delay: 100 });
  const [techRef] = useScrollAnimation({ delay: 300 });
  const [personalRef] = useScrollAnimation({ delay: 500 });

  return (
    <Layout>
      <PageTransition>
        <SEO
          title="About Jeff Maxwell | React Node.js Developer Orlando"
          description="Full Stack React and Node.js Developer in Orlando, FL. Learn about my JavaScript expertise and approach to modern web development."
          pathname="/about/"
          keywords={[
            `react developer`,
            `node.js developer`,
            `javascript developer`,
            `full stack developer`,
            `orlando web developer`,
            `technology stack`,
            `web development experience`,
            `react node.js specialist`,
            `central florida developer`,
            `modern web development`,
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
            <div>
              <PageTitle id="about-header">
                About Jeff Maxwell - React & Node.js Developer
              </PageTitle>
              <Typography
                variant="body1"
                component="p"
                color="text.secondary"
                style={{
                  maxWidth: 960,
                  margin: '0 auto',
                  fontSize: '1.375rem',
                  lineHeight: 1.5,
                  fontWeight: 400,
                  letterSpacing: '0.01em',
                }}
              >
                Full stack developer passionate about creating elegant solutions to complex
                problems. When I&apos;m not coding, I&apos;m exploring new technologies and
                perfecting my craft. Explore my{' '}
                <Link
                  to="/projects/"
                  title="Explore my complete project portfolio showcasing full stack development"
                  style={{
                    color: 'var(--primary-color)',
                    fontWeight: 'bold',
                    textDecoration: 'underline',
                  }}
                >
                  featured projects
                </Link>{' '}
                or{' '}
                <Link
                  to="/contact/"
                  title="Contact me to start collaborating on your development needs"
                  style={{
                    color: 'var(--primary-color)',
                    fontWeight: 'bold',
                    textDecoration: 'underline',
                  }}
                >
                  get in touch
                </Link>{' '}
                to discuss your next project. View my{' '}
                <Link
                  to="/resume/"
                  title="View Jeff Maxwell's professional resume"
                  style={{
                    color: 'var(--primary-color)',
                    fontWeight: 'bold',
                    textDecoration: 'underline',
                  }}
                >
                  detailed resume
                </Link>{' '}
                for comprehensive work history.
              </Typography>
            </div>
          </StyledBox>
          <section
            aria-labelledby="personal-section"
            ref={personalRef}
            style={{ marginBottom: '64px' }}
          >
            <div
              style={{
                background: 'linear-gradient(135deg, #e8eaf6 0%, #ede7f6 50%, #f3e5f5 100%)',
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
                  fontSize: 'clamp(1.875rem, 5vw, 2.5rem)',
                  fontWeight: 700,
                  lineHeight: 1.2,
                  marginBottom: '32px',
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #1565c0 0%, #9c27b0 50%, #e91e63 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                JavaScript Development Philosophy & Experience
              </Typography>
              <GridContainer className="center-last" spacing={3}>
                <GridItem>
                  <div
                    style={{
                      background: 'var(--paper-color)',
                      borderRadius: '16px',
                      padding: '32px 24px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      height: '100%',
                      boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease, background 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.12)',
                      },
                    }}
                  >
                    <div
                      style={{
                        fontSize: '4rem',
                        color: 'var(--primary-color)',
                        marginBottom: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <ClientOnlyIcon
                        iconName="CodeTerminal"
                        fontSize="4rem"
                        style={{
                          color: 'var(--primary-color)',
                        }}
                        aria-label="Code terminal icon representing clean development practices"
                        role="img"
                      />
                    </div>
                    <StyledBox>
                      <Typography
                        variant="h3"
                        component="h3"
                        style={{
                          fontWeight: 600,
                          marginBottom: '16px',
                          fontSize: '1.375rem',
                          textAlign: 'center',
                          lineHeight: 1.3,
                        }}
                        customColor="var(--text-color)"
                      >
                        React Development & Clean Code Philosophy
                      </Typography>
                      <Typography
                        variant="body2"
                        style={{
                          lineHeight: 1.5,
                          fontSize: '1rem',
                          textAlign: 'center',
                          maxWidth: '100%',
                          margin: '0 auto',
                        }}
                        customColor="var(--text-secondary-color)"
                      >
                        I believe in writing code that tells a story - clean, readable, and
                        maintainable solutions that scale gracefully. My approach emphasizes
                        component composition, separation of concerns, and comprehensive testing. I
                        leverage TypeScript for type safety, implement proper error handling, and
                        follow established patterns like SOLID principles. Every React component I
                        build focuses on single responsibility, making codebases easier to debug,
                        extend, and maintain by entire development teams.
                      </Typography>
                    </StyledBox>
                  </div>
                </GridItem>
                <GridItem>
                  <div
                    style={{
                      background: 'var(--paper-color)',
                      borderRadius: '16px',
                      padding: '32px 24px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      height: '100%',
                      boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease, background 0.3s ease',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '4rem',
                        color: 'var(--primary-color)',
                        marginBottom: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <ClientOnlyIcon
                        iconName="Coffee"
                        fontSize="4rem"
                        style={{
                          color: 'var(--primary-color)',
                        }}
                        aria-label="Coffee cup icon representing coding culture and developer lifestyle"
                        role="img"
                      />
                    </div>
                    <StyledBox>
                      <Typography
                        variant="h3"
                        component="h3"
                        style={{
                          fontWeight: 600,
                          marginBottom: '16px',
                          fontSize: '1.375rem',
                          textAlign: 'center',
                          lineHeight: 1.3,
                        }}
                        customColor="var(--text-color)"
                      >
                        Coffee & Code Culture
                      </Typography>
                      <Typography
                        variant="body2"
                        style={{
                          lineHeight: 1.5,
                          fontSize: '1rem',
                          textAlign: 'center',
                          maxWidth: '100%',
                          margin: '0 auto',
                        }}
                        customColor="var(--text-secondary-color)"
                      >
                        My development workflow is powered by carefully crafted espresso and an
                        appreciation for the ritual of coding. Whether it's early morning
                        architecture planning sessions or late-night debugging marathons, coffee
                        culture plays a central role in my productivity. I find that the methodical
                        process of brewing coffee mirrors the patience required for thoughtful
                        software development - both require attention to detail, timing, and the
                        right environment to produce exceptional results.
                      </Typography>
                    </StyledBox>
                  </div>
                </GridItem>
                <GridItem>
                  <div
                    style={{
                      background: 'var(--paper-color)',
                      borderRadius: '16px',
                      padding: '32px 24px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      height: '100%',
                      boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease, background 0.3s ease',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '4rem',
                        color: 'var(--primary-color)',
                        marginBottom: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <ClientOnlyIcon
                        iconName="Dog"
                        fontSize="4rem"
                        style={{
                          color: 'var(--primary-color)',
                        }}
                        aria-label="Dog icon representing work-life balance and developer companionship"
                        role="img"
                      />
                    </div>
                    <StyledBox>
                      <Typography
                        variant="h3"
                        component="h3"
                        style={{
                          fontWeight: 600,
                          marginBottom: '16px',
                          fontSize: '1.375rem',
                          textAlign: 'center',
                          lineHeight: 1.3,
                        }}
                        customColor="var(--text-color)"
                      >
                        Dog Parent & Developer Balance
                      </Typography>
                      <Typography
                        variant="body2"
                        style={{
                          lineHeight: 1.5,
                          fontSize: '1rem',
                          textAlign: 'center',
                          maxWidth: '100%',
                          margin: '0 auto',
                        }}
                        customColor="var(--text-secondary-color)"
                      >
                        Life with two demanding canine project managers has taught me invaluable
                        lessons about patience, adaptability, and time management - skills that
                        directly translate to software development. My dogs have mastered the art of
                        interrupting code reviews at precisely the right moment, reminding me that
                        work-life balance isn&#39;t just a buzzword but a necessity for sustainable
                        creativity. They&#39;ve also become excellent rubber duck debugging though
                        their feedback tends to focus more on treat dispensing than code
                        optimization.
                      </Typography>
                    </StyledBox>
                  </div>
                </GridItem>
              </GridContainer>
            </div>
          </section>

          {/* Technical Experience Section */}
          <StyledBox as="section" aria-labelledby="technical-experience" mb={8}>
            <Typography
              variant="h2"
              component="h2"
              id="technical-experience"
              style={{
                fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
                fontWeight: 600,
                marginBottom: '32px',
                color: 'var(--text-color)',
                textAlign: 'center',
              }}
            >
              Professional React & Node.js Development Experience
            </Typography>

            <div
              style={{
                background: 'var(--paper-color)',
                borderRadius: '24px',
                padding: '48px',
                marginBottom: '32px',
                boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.08)',
                transition: 'background 0.3s ease',
              }}
            >
              <Typography
                variant="body1"
                style={{
                  fontSize: '1.25rem',
                  lineHeight: 1.7,
                  color: 'var(--text-color)',
                  marginBottom: '24px',
                }}
              >
                My journey in full stack development spans several years of hands-on experience
                building scalable web applications with modern JavaScript technologies. I specialize
                in React ecosystem development, creating responsive user interfaces that prioritize
                both performance and accessibility. My React expertise includes advanced patterns
                like custom hooks, context management, code splitting, and server-side rendering
                with Next.js.
              </Typography>

              <Typography
                variant="body1"
                style={{
                  fontSize: '1.25rem',
                  lineHeight: 1.7,
                  color: 'var(--text-color)',
                  marginBottom: '24px',
                }}
              >
                On the backend, I architect robust Node.js applications using Express.js and modern
                frameworks, implementing RESTful APIs and GraphQL endpoints. My database experience
                includes both SQL (PostgreSQL, MySQL) and NoSQL (MongoDB) solutions, with expertise
                in query optimization and data modeling. I'm passionate about implementing proper
                testing strategies, including unit tests with Jest, integration testing, and
                end-to-end testing with Cypress.
              </Typography>

              <Typography
                variant="body1"
                style={{
                  fontSize: '1.25rem',
                  lineHeight: 1.7,
                  color: 'var(--text-color)',
                  marginBottom: '24px',
                }}
              >
                My development workflow emphasizes collaboration and quality through Git version
                control, code reviews, and CI/CD pipelines. I have experience with cloud deployment
                on platforms like Vercel, Netlify, and AWS, implementing containerization with
                Docker, and managing application monitoring and performance optimization. I stay
                current with industry trends through continuous learning, contributing to open
                source projects, and participating in the developer community.
              </Typography>

              <Typography
                variant="body1"
                style={{
                  fontSize: '1.25rem',
                  lineHeight: 1.7,
                  color: 'var(--text-color)',
                }}
              >
                Currently, I&#39;m focused on exploring emerging technologies like WebAssembly,
                serverless architectures, and progressive web applications. I believe in writing
                documentation that helps teams understand not just what the code does, but why
                architectural decisions were made. My goal is always to deliver maintainable,
                scalable solutions that solve real business problems while providing exceptional
                user experiences.
              </Typography>
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
                  gridTemplateColumns: 'repeat(3, 1fr)',
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
                    <Image imageType="developer" />
                  </StyledBox>
                </div>
              </GridItem>
            </GridContainer>
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
                JavaScript Technology Stack & Development Tools
              </Typography>
              <Typography
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

              <TechnologyGrid>
                <div
                  style={{
                    background: 'var(--paper-color)',
                    borderRadius: '16px',
                    padding: '32px 16px',
                    textAlign: 'center',
                    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease, background 0.3s ease',
                  }}
                >
                  <div
                    style={{
                      fontSize: '3.5rem',
                      color: 'rgba(255, 0, 251, 1)',
                      marginBottom: '16px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '80px',
                    }}
                  >
                    <SiWebstorm
                      aria-label="JetBrains WebStorm JavaScript development environment icon"
                      role="img"
                    />
                  </div>
                  <Typography
                    variant="h3"
                    component="h3"
                    style={{ fontWeight: 600, marginBottom: '8px', fontSize: '1.125rem' }}
                    customColor="var(--text-color)"
                  >
                    JetBrains WebStorm JavaScript Development Environment
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{ lineHeight: 1.4, fontSize: '0.875rem' }}
                    customColor="var(--text-secondary-color)"
                  >
                    My primary IDE for JavaScript and React development, featuring intelligent code
                    completion, advanced debugging capabilities, and seamless Git integration. The
                    robust plugin ecosystem enhances productivity with tools for code quality,
                    testing, and deployment workflows.
                  </Typography>
                </div>

                <div
                  style={{
                    background: 'var(--paper-color)',
                    borderRadius: '16px',
                    padding: '32px 16px',
                    textAlign: 'center',
                    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease, background 0.3s ease',
                  }}
                >
                  <div
                    style={{
                      fontSize: '3.5rem',
                      color: 'rgba(255, 0, 251, 1)',
                      marginBottom: '16px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '80px',
                    }}
                  >
                    <SiMozilla aria-label="Firefox web browser development tool icon" role="img" />
                  </div>
                  <Typography
                    variant="h3"
                    component="h3"
                    style={{ fontWeight: 600, marginBottom: '8px', fontSize: '1.125rem' }}
                    customColor="var(--text-color)"
                  >
                    Firefox Web Development
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{ lineHeight: 1.4, fontSize: '0.875rem' }}
                    customColor="var(--text-secondary-color)"
                  >
                    My preferred browser for web development and testing, offering excellent
                    developer tools for debugging JavaScript, analyzing performance, and ensuring
                    cross-browser compatibility. I rely heavily on Mozilla Developer Network (MDN)
                    documentation for web standards and best practices. The responsive design mode
                    and network throttling features are essential for testing React applications
                    across different devices and connection speeds.
                  </Typography>
                </div>

                <div
                  style={{
                    background: 'var(--paper-color)',
                    borderRadius: '16px',
                    padding: '32px 16px',
                    textAlign: 'center',
                    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease, background 0.3s ease',
                  }}
                >
                  <div
                    style={{
                      fontSize: '3.5rem',
                      color: 'rgba(255, 0, 251, 1)',
                      marginBottom: '16px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '80px',
                    }}
                  >
                    <SiDebian aria-label="Debian Linux operating system icon" role="img" />
                  </div>
                  <Typography
                    variant="h3"
                    component="h3"
                    style={{ fontWeight: 600, marginBottom: '8px', fontSize: '1.125rem' }}
                    customColor="var(--text-color)"
                  >
                    Debian Linux
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{ lineHeight: 1.4, fontSize: '0.875rem' }}
                    customColor="var(--text-secondary-color)"
                  >
                    My development environment of choice, providing a stable and secure foundation
                    for Node.js applications. The package management system and command-line tools
                    create an efficient workflow for full stack development. I appreciate the
                    open-source philosophy and the control it gives me over my development
                    environment setup.
                  </Typography>
                </div>

                <div
                  style={{
                    background: 'var(--paper-color)',
                    borderRadius: '16px',
                    padding: '32px 16px',
                    textAlign: 'center',
                    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease, background 0.3s ease',
                  }}
                >
                  <div
                    style={{
                      fontSize: '3.5rem',
                      color: 'rgba(255, 0, 251, 1)',
                      marginBottom: '16px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '80px',
                    }}
                  >
                    <SiGit aria-label="Git version control system icon" role="img" />
                  </div>
                  <Typography
                    variant="h3"
                    component="h3"
                    style={{ fontWeight: 600, marginBottom: '8px', fontSize: '1.125rem' }}
                    customColor="var(--text-color)"
                  >
                    Git
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{ lineHeight: 1.4, fontSize: '0.875rem' }}
                    customColor="var(--text-secondary-color)"
                  >
                    Essential for collaborative development and code management. I follow Git best
                    practices including meaningful commit messages, feature branch workflows, and
                    proper merge strategies. Experience with GitHub, GitLab, and advanced Git
                    operations like rebasing, cherry-picking, and conflict resolution ensures smooth
                    team collaboration.
                  </Typography>
                </div>

                <div
                  style={{
                    background: 'var(--paper-color)',
                    borderRadius: '16px',
                    padding: '32px 16px',
                    textAlign: 'center',
                    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease, background 0.3s ease',
                  }}
                >
                  <div
                    style={{
                      fontSize: '3.5rem',
                      color: 'rgba(255, 0, 251, 1)',
                      marginBottom: '16px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '80px',
                    }}
                  >
                    <SiAnthropic aria-label="Anthropic AI company logo" role="img" />
                  </div>
                  <Typography
                    variant="h3"
                    component="h3"
                    style={{ fontWeight: 600, marginBottom: '8px', fontSize: '1.125rem' }}
                    customColor="var(--text-color)"
                  >
                    Anthropic Claude AI Assistant
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{ lineHeight: 1.4, fontSize: '0.875rem' }}
                    customColor="var(--text-secondary-color)"
                  >
                    Advanced AI assistant for code review, documentation, and development workflow
                    optimization. Provides intelligent suggestions for architecture decisions,
                    debugging complex issues, and maintaining code quality standards across large
                    projects.
                  </Typography>
                </div>
              </TechnologyGrid>
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

          {/* Social Sharing Section */}
          <StyledBox as="section" aria-labelledby="social-share">
            <SocialShare
              url={
                typeof window !== 'undefined' && window.location
                  ? window.location.href
                  : 'https://el-jefe.me/about/'
              }
              title="About Jeff Maxwell - Full Stack React & Node.js Developer"
              description="Learn about Jeff Maxwell's development background, experience with React and Node.js, and his approach to building modern web applications."
            />
          </StyledBox>
        </StyledContainer>
      </PageTransition>
    </Layout>
  );
}

export default AboutPage;
