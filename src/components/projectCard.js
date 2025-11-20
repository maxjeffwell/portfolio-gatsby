import React from 'react';
import PropTypes from 'prop-types';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import styled from 'styled-components';
import {
  FaReact,
  FaGit,
  FaDocker,
  FaNodeJs,
  FaDatabase,
  FaCss3Alt,
  FaJs,
  FaSitemap,
} from 'react-icons/fa';
import { DiHeroku } from 'react-icons/di';
import {
  SiExpress,
  SiJsonwebtokens,
  SiApollographql,
  SiRedux,
  SiFirebase,
  SiVercel,
  SiRender,
  SiGooglecloud,
  SiMongodb,
  SiPostgresql,
  SiRedis,
  SiGraphql,
  SiNpm,
  SiTensorflow,
  SiWebgl,
  SiKubernetes,
  SiVite,
  SiMui,
  SiSocketdotio,
  SiHelm,
  SiPrometheus,
  SiGrafana,
} from 'react-icons/si';
import { useTheme } from '../context/ThemeContext';

import DemoIcon from '../images/svg-icons/demo.svg';
import OpenSourceIcon from '../images/svg-icons/open_source.svg';
import NeonIcon from '../images/svg-icons/neon-tech.svg';
import DockerIcon from '../images/svg-icons/docker.svg';

// Helper functions for Typography styles
const getTypographyFontWeight = (variant) => {
  if (variant === 'h5') return 700;
  if (variant === 'h6') return 600;
  return 400;
};

const getTypographyFontSize = (variant) => {
  if (variant === 'h5') return '1.75rem';
  if (variant === 'h6') return '1.375rem';
  if (variant === 'body1') return '1.375rem';
  if (variant === 'body2') return '0.9375rem';
  return '1rem';
};

const getTypographyLineHeight = (variant) => {
  if (variant === 'h5') return 1.334;
  if (variant === 'h6') return 1.6;
  if (variant === 'body1') return 1.5;
  if (variant === 'body2') return 1.43;
  return 1.5;
};

const getResponsiveFontSize480 = (variant) => {
  if (variant === 'h5') return '1.25rem';
  if (variant === 'h6') return '1.125rem';
  if (variant === 'body1') return '1.1875rem';
  if (variant === 'body2') return '0.8rem';
  return '0.9rem';
};

const getResponsiveFontSize360 = (variant) => {
  if (variant === 'h5') return '1.125rem';
  if (variant === 'h6') return '1rem';
  if (variant === 'body1') return '1.125rem';
  if (variant === 'body2') return '0.75rem';
  return '0.85rem';
};

const Typography = styled.div`
  margin: 0;
  font-family: inherit;
  font-weight: ${(props) => getTypographyFontWeight(props.variant)};
  font-size: ${(props) => getTypographyFontSize(props.variant)};
  line-height: ${(props) => getTypographyLineHeight(props.variant)};
  color: ${(props) => {
    if (props.theme?.mode === 'dark') {
      if (props.color === 'text.secondary') return 'rgba(255, 255, 255, 0.7)';
      if (props.color === 'primary') return '#90caf9';
      return 'rgba(255, 255, 255, 0.87)';
    }
    if (props.color === 'text.secondary') return 'rgba(0, 0, 0, 0.6)';
    if (props.color === 'primary') return '#1976d2';
    return 'rgba(0, 0, 0, 0.87)';
  }};
  margin-bottom: ${(props) => (props.gutterBottom ? '0.35em' : '0')};
  transition: color 0.3s ease;
  word-wrap: break-word;
  overflow-wrap: break-word;

  @media (max-width: 480px) {
    font-size: ${(props) => getResponsiveFontSize480(props.variant)};
  }

  @media (max-width: 360px) {
    font-size: ${(props) => getResponsiveFontSize360(props.variant)};
  }
`;

const Stack = styled.div`
  display: flex;
  flex-direction: ${(props) => props.direction || 'column'};
  gap: ${(props) => (props.spacing ? `${props.spacing * 8}px` : '8px')};
  flex-wrap: wrap;
  width: 100%;
  overflow: hidden;
  justify-content: ${(props) => props.justifyContent || 'flex-start'};

  @media (max-width: 480px) {
    gap: ${(props) => (props.spacing ? `${props.spacing * 6}px` : '6px')};
  }

  @media (max-width: 360px) {
    gap: ${(props) => (props.spacing ? `${props.spacing * 4}px` : '4px')};
  }
`;

// SVG Icon Link components
const IconLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:focus {
    outline: 2px solid ${(props) => (props.theme?.mode === 'dark' ? '#90caf9' : '#1976d2')};
    outline-offset: 4px;
    border-radius: 4px;
  }

  svg {
    width: 64px;
    height: 64px;
    fill: ${(props) => (props.theme?.mode === 'dark' ? '#90caf9' : '#1976d2')};
    transition: fill 0.3s ease;
  }

  @media (max-width: 768px) {
    svg {
      width: 56px;
      height: 56px;
    }
  }

  @media (max-width: 480px) {
    svg {
      width: 48px;
      height: 48px;
    }
  }

  @media (max-width: 360px) {
    svg {
      width: 42px;
      height: 42px;
    }
  }
`;

const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 16px 0;

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 16px;
    padding: 16px 16px 0;
  }

  @media (max-width: 360px) {
    padding: 8px 8px 0;
    gap: 8px;
  }
`;

const ImageBox = styled.div`
  flex: 1;
`;

const PlaceholderBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) =>
    props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'};
  border-radius: 8px;
  transition: background-color 0.3s ease;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 16px;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 12px;
  }

  @media (max-width: 360px) {
    margin-bottom: 10px;
  }
`;

const TechContainer = styled.div`
  margin-top: auto;
  padding-top: 20px;
`;

const CustomChip = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  padding: 0 16px;
  border-radius: 16px;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.43;
  letter-spacing: 0.01071em;
  background-color: transparent;
  border: 2px solid ${(props) => (props.theme?.mode === 'dark' ? '#ce93d8' : '#9c27b0')};
  color: ${(props) => (props.theme?.mode === 'dark' ? '#ce93d8' : '#9c27b0')};
  white-space: nowrap;
  transition:
    border-color 0.3s ease,
    color 0.3s ease;
`;

const StyledCard = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  overflow: hidden;
  transition:
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    background 0.3s ease;
  background: ${(props) =>
    props.theme?.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(45, 45, 45, 0.9) 100%)'
      : 'white'};
  box-shadow:
    0 3px 3px -2px rgba(0, 0, 0, 0.2),
    0 3px 4px 0 rgba(0, 0, 0, 0.14),
    0 1px 8px 0 rgba(0, 0, 0, 0.12);

  &:hover {
    box-shadow:
      0 5px 5px -3px rgba(0, 0, 0, 0.2),
      0 8px 10px 1px rgba(0, 0, 0, 0.14),
      0 3px 14px 2px rgba(0, 0, 0, 0.12);
  }
`;

const StyledCardContent = styled.div`
  flex-grow: 1;
  padding: 16px;
  @media (max-width: 480px) {
    padding: 12px;
  }

  @media (max-width: 360px) {
    padding: 10px;
  }
`;

const StyledCardActions = styled.div`
  justify-content: center;
  padding: 16px;
  padding-top: 12px;
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    gap: 20px;
  }

  @media (max-width: 360px) {
    padding: 8px 12px 12px;
    gap: 16px;
  }
`;

const DeploymentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const DeploymentLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${(props) =>
    props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: color 0.3s ease;
`;

const ColoredBar = styled.div`
  height: 4px;
  background: linear-gradient(90deg, #e91e63, #9c27b0, #3f51b5);
`;

const ImageContainer = styled.div`
  position: relative;
  overflow: hidden;
  aspect-ratio: 16 / 9;
  background-color: rgba(0, 0, 0, 0.04);
  border-radius: 8px;

  & [data-gatsby-image-wrapper] {
    border-radius: 8px;
  }

  & video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
  }

  @media (max-width: 600px) {
    aspect-ratio: 4 / 3;
  }

  @media (max-width: 360px) {
    aspect-ratio: 3 / 2;
    border-radius: 6px;
  }

  @media (prefers-color-scheme: dark) {
    background-color: rgba(255, 255, 255, 0.08);
  }
`;

const TechIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${(props) =>
    props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'};
  transition: background-color 0.3s ease;
  flex-shrink: 0;

  &:hover {
    background-color: ${(props) =>
      props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)'};
  }

  @media (max-width: 480px) {
    width: 36px;
    height: 36px;

    svg {
      width: 20px !important;
      height: 20px !important;
    }
  }

  @media (max-width: 360px) {
    width: 32px;
    height: 32px;

    svg {
      width: 18px !important;
      height: 18px !important;
    }
  }
`;

function ProjectCard({
  imageSrcPath,
  imageSrcPath2,
  videoSrcPath,
  videoSrcPath2,
  title,
  date,
  description,
  sourceURL,
  hostedURL,
  deployments = [],
  technologies = [],
}) {
  const { theme } = useTheme();

  // Normalize deployments - support both single hostedURL and deployments array
  const normalizedDeployments = (() => {
    if (deployments.length > 0) {
      return deployments;
    }
    if (hostedURL) {
      return [{ url: hostedURL, label: 'Live Demo' }];
    }
    return [];
  })();

  const getVideoSource = (videoPath) => {
    if (!videoPath) return null;
    if (videoPath.endsWith('.mp4')) {
      return <source src={videoPath} type="video/mp4" />;
    }
    if (videoPath.endsWith('.webm')) {
      return <source src={videoPath} type="video/webm" />;
    }
    return null;
  };

  // Map technology names to their icons and descriptions
  const getTechnologyIcon = (tech) => {
    const iconColor = theme?.mode === 'dark' ? '#90caf9' : '#1976d2';
    const iconSize = 24;

    const techMap = {
      JavaScript: {
        icon: <FaJs size={iconSize} color={iconColor} />,
        label: 'JavaScript programming language',
      },
      React: {
        icon: <FaReact size={iconSize} color={iconColor} />,
        label: 'React JavaScript library',
      },
      'Context API': {
        icon: <FaSitemap size={iconSize} color={iconColor} />,
        label: 'React Context API for state management',
      },
      'Node.js': {
        icon: <FaNodeJs size={iconSize} color={iconColor} />,
        label: 'Node.js JavaScript runtime',
      },
      Express: {
        icon: <SiExpress size={iconSize} color={iconColor} />,
        label: 'Express.js web framework',
      },
      Redux: {
        icon: <SiRedux size={iconSize} color={iconColor} />,
        label: 'Redux state management',
      },
      MongoDB: {
        icon: <SiMongodb size={iconSize} color={iconColor} />,
        label: 'MongoDB NoSQL database',
      },
      PostgreSQL: {
        icon: <SiPostgresql size={iconSize} color={iconColor} />,
        label: 'PostgreSQL database',
      },
      Redis: {
        icon: <SiRedis size={iconSize} color={iconColor} />,
        label: 'Redis in-memory database',
      },
      GraphQL: {
        icon: <SiGraphql size={iconSize} color={iconColor} />,
        label: 'GraphQL query language',
      },
      'Apollo Client': {
        icon: <SiApollographql size={iconSize} color={iconColor} />,
        label: 'Apollo Client GraphQL',
      },
      'Apollo Server': {
        icon: <SiApollographql size={iconSize} color={iconColor} />,
        label: 'Apollo Server GraphQL',
      },
      JWT: {
        icon: <SiJsonwebtokens size={iconSize} color={iconColor} />,
        label: 'JSON Web Tokens',
      },
      WebSocket: {
        icon: <FaDatabase size={iconSize} color={iconColor} />,
        label: 'WebSocket real-time communication',
      },
      Git: { icon: <FaGit size={iconSize} color={iconColor} />, label: 'Git version control' },
      Docker: {
        icon: <FaDocker size={iconSize} color={iconColor} />,
        label: 'Docker containerization',
      },
      Heroku: {
        icon: <DiHeroku size={iconSize} color={iconColor} />,
        label: 'Heroku deployment platform',
      },
      Vercel: {
        icon: <SiVercel size={iconSize} color={iconColor} />,
        label: 'Vercel deployment platform',
      },
      Render: {
        icon: <SiRender size={iconSize} color={iconColor} />,
        label: 'Render deployment platform',
      },
      Firebase: {
        icon: <SiFirebase size={iconSize} color={iconColor} />,
        label: 'Firebase cloud platform',
      },
      'Google Cloud': {
        icon: <SiGooglecloud size={iconSize} color={iconColor} />,
        label: 'Google Cloud Platform',
      },
      NPM: { icon: <SiNpm size={iconSize} color={iconColor} />, label: 'NPM package manager' },
      CSS: {
        icon: <FaCss3Alt size={iconSize} color={iconColor} />,
        label: 'CSS stylesheet language',
      },
      Emotion: {
        icon: <FaCss3Alt size={iconSize} color={iconColor} />,
        label: 'Emotion CSS-in-JS library',
      },
      Neon: {
        icon: <NeonIcon width={iconSize} height={iconSize} style={{ fill: iconColor }} />,
        label: 'Neon serverless PostgreSQL',
      },
      'TensorFlow.js': {
        icon: <SiTensorflow size={iconSize} color={iconColor} />,
        label: 'TensorFlow.js machine learning',
      },
      'Machine Learning': {
        icon: <SiTensorflow size={iconSize} color={iconColor} />,
        label: 'Machine Learning',
      },
      WebGPU: { icon: <SiWebgl size={iconSize} color={iconColor} />, label: 'WebGPU graphics API' },
      Kubernetes: {
        icon: <SiKubernetes size={iconSize} color={iconColor} />,
        label: 'Kubernetes container orchestration',
      },
      Vite: {
        icon: <SiVite size={iconSize} color={iconColor} />,
        label: 'Vite build tool',
      },
      'Material-UI': {
        icon: <SiMui size={iconSize} color={iconColor} />,
        label: 'Material-UI React component library',
      },
      'Socket.io': {
        icon: <SiSocketdotio size={iconSize} color={iconColor} />,
        label: 'Socket.io real-time communication',
      },
      Helm: {
        icon: <SiHelm size={iconSize} color={iconColor} />,
        label: 'Helm Kubernetes package manager',
      },
      Prometheus: {
        icon: <SiPrometheus size={iconSize} color={iconColor} />,
        label: 'Prometheus monitoring system',
      },
      Grafana: {
        icon: <SiGrafana size={iconSize} color={iconColor} />,
        label: 'Grafana analytics and monitoring',
      },
    };

    return techMap[tech] || null;
  };

  const renderMediaContent = (videoPath, imagePath, altText) => {
    if (videoPath) {
      return (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={`${title} ${altText}`}
        >
          {getVideoSource(videoPath)}
          Your browser does not support the video tag.
        </video>
      );
    }

    const imageData = getImage(imagePath);
    if (imageData) {
      return (
        <GatsbyImage
          image={imageData}
          alt={`${title} ${altText}`}
          loading="lazy"
          sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 40vw, 33vw"
          style={{
            borderRadius: '8px',
            width: '100%',
            height: '100%',
          }}
          imgStyle={{
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
      );
    }

    return (
      <PlaceholderBox theme={theme}>
        <Typography theme={theme} variant="body2" color="text.secondary">
          Media loading...
        </Typography>
      </PlaceholderBox>
    );
  };

  return (
    <StyledCard theme={theme} as="article">
      <ColoredBar />
      <FlexContainer>
        <ImageBox>
          <ImageContainer>
            {renderMediaContent(
              videoSrcPath,
              imageSrcPath,
              'demonstration video showing the application in action'
            )}
          </ImageContainer>
        </ImageBox>
        <ImageBox>
          <ImageContainer>
            {renderMediaContent(
              videoSrcPath2,
              imageSrcPath2,
              'secondary demonstration video showing additional features'
            )}
          </ImageContainer>
        </ImageBox>
      </FlexContainer>

      <StyledCardContent>
        <HeaderContainer as="header">
          <Typography theme={theme} variant="h5" component="h2" color="primary" fontWeight="bold">
            {title}
          </Typography>
          <CustomChip theme={theme}>{date}</CustomChip>
        </HeaderContainer>

        <Typography theme={theme} variant="body1" color="text.secondary" paragraph>
          {description}
        </Typography>

        <TechContainer>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap justifyContent="center">
            {technologies.map((tech) => {
              const techData = getTechnologyIcon(tech);
              if (!techData) return null;

              return (
                <TechIcon
                  key={tech}
                  theme={theme}
                  role="img"
                  aria-label={techData.label}
                  title={techData.label}
                >
                  {techData.icon}
                </TechIcon>
              );
            })}
          </Stack>
        </TechContainer>
      </StyledCardContent>

      <StyledCardActions>
        <DeploymentContainer>
          <IconLink
            theme={theme}
            href={sourceURL}
            title={`View source code for ${title} on GitHub`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View source code for ${title} on GitHub`}
          >
            <OpenSourceIcon aria-hidden="true" />
          </IconLink>
          <DeploymentLabel theme={theme}>Source Code</DeploymentLabel>
        </DeploymentContainer>

        {normalizedDeployments.map((deployment) => (
          <DeploymentContainer key={deployment.url}>
            <IconLink
              theme={theme}
              href={deployment.url}
              title={`${deployment.label} - ${title}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${deployment.label} - ${title}`}
            >
              {deployment.label === 'Docker Hub' ? (
                <DockerIcon aria-hidden="true" />
              ) : (
                <DemoIcon aria-hidden="true" />
              )}
            </IconLink>
            <DeploymentLabel theme={theme}>{deployment.label}</DeploymentLabel>
          </DeploymentContainer>
        ))}
      </StyledCardActions>
    </StyledCard>
  );
}

ProjectCard.propTypes = {
  imageSrcPath: PropTypes.object,
  imageSrcPath2: PropTypes.object,
  videoSrcPath: PropTypes.string,
  videoSrcPath2: PropTypes.string,
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  sourceURL: PropTypes.string.isRequired,
  hostedURL: PropTypes.string,
  deployments: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  technologies: PropTypes.arrayOf(PropTypes.string),
};

export default ProjectCard;
