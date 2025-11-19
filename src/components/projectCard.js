import React from 'react';
import PropTypes from 'prop-types';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import styled from 'styled-components';
import { FaReact, FaGit } from 'react-icons/fa';
import { DiHeroku } from 'react-icons/di';
import { useTheme } from '../context/ThemeContext';

import DemoIcon from '../images/svg-icons/demo.svg';
import OpenSourceIcon from '../images/svg-icons/open_source.svg';

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
  transition:
    background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;

  ${(props) =>
    props.variant === 'outlined' &&
    `
    color: ${props.theme?.colors?.primary || (props.theme?.mode === 'dark' ? '#90caf9' : '#1976d2')};
    border: 2px solid ${props.theme?.mode === 'dark' ? 'rgba(144, 202, 249, 0.7)' : 'rgba(25, 118, 210, 0.7)'};
    font-weight: 600;
    
    &:hover {
      border: 2px solid ${props.theme?.colors?.primary || (props.theme?.mode === 'dark' ? '#90caf9' : '#1976d2')};
      background-color: ${props.theme?.mode === 'dark' ? 'rgba(144, 202, 249, 0.12)' : 'rgba(25, 118, 210, 0.08)'};
    }
  `}

  ${(props) =>
    props.size === 'small' &&
    `
    padding: 4px 10px;
    font-size: 0.8125rem;
  `}
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
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
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
      0px 3px 14px 2px rgba(0, 0, 0, 0.12);
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
  padding-top: 0;
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    gap: 20px;
  }

  @media (max-width: 360px) {
    padding: 0 12px 12px;
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
  color: ${(props) => (props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)')};
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
  techIcon3,
  techIcon4,
  techIcon5,
  techIcon6,
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
  const normalizedDeployments = deployments.length > 0
    ? deployments
    : hostedURL
      ? [{ url: hostedURL, label: 'Live Demo' }]
      : [];

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

  const renderTechIcon = (techIcon, ariaLabel) => {
    if (React.isValidElement(techIcon)) {
      return React.cloneElement(techIcon, {
        alt: ariaLabel,
        'aria-label': ariaLabel,
      });
    }

    if (typeof techIcon === 'function') {
      return React.createElement(techIcon, {
        width: 24,
        height: 24,
        fill: theme?.mode === 'dark' ? '#90caf9' : '#1976d2',
        alt: ariaLabel,
        'aria-label': ariaLabel,
      });
    }

    return null;
  };

  const getTechAriaLabel = (iconIndex, technologies) => {
    const techMap = {
      3: technologies.find((tech) => ['Redux', 'GraphQL', 'CSS', 'MongoDB'].includes(tech)),
      4: technologies.find((tech) => ['MongoDB', 'NPM', 'Firebase'].includes(tech)),
      5: technologies.find((tech) => ['NPM', 'Redis', 'Node.js', 'Vercel'].includes(tech)),
      6: technologies.find((tech) => ['PostgreSQL', 'Neon', 'Apollo Client'].includes(tech)),
    };
    const tech = techMap[iconIndex];

    // Create more descriptive labels for SEO
    const descriptions = {
      Redux: 'Redux state management library icon for React applications',
      GraphQL: 'GraphQL query language icon for API development',
      CSS: 'CSS stylesheet technology icon for web styling',
      MongoDB: 'MongoDB NoSQL database icon for data storage',
      NPM: 'NPM Node.js package manager icon for JavaScript dependencies',
      Firebase: 'Firebase Google cloud platform icon for web development',
      Redis: 'Redis in-memory database icon for caching and data storage',
      'Node.js': 'Node.js JavaScript runtime icon for backend development',
      Vercel: 'Vercel deployment platform icon for web applications',
      PostgreSQL: 'PostgreSQL relational database icon for data management',
      Neon: 'Neon serverless PostgreSQL database icon',
      'Apollo Client': 'Apollo Client GraphQL library icon for React applications',
    };

    if (tech && descriptions[tech]) {
      return descriptions[tech];
    }
    return 'Technology used in project development';
  };

  return (
    <StyledCard theme={theme} as="article">
      <ColoredBar />
      <FlexContainer>
        <ImageBox>
          <ImageContainer>
            {videoSrcPath ? (
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label={`${title} demonstration video showing the application in action`}
              >
                {getVideoSource(videoSrcPath)}
                Your browser does not support the video tag.
              </video>
            ) : getImage(imageSrcPath) ? (
              <GatsbyImage
                image={getImage(imageSrcPath)}
                alt={`${title} main screenshot showing the application interface`}
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
            ) : (
              <PlaceholderBox theme={theme}>
                <Typography theme={theme} variant="body2" color="text.secondary">
                  Media loading...
                </Typography>
              </PlaceholderBox>
            )}
          </ImageContainer>
        </ImageBox>
        <ImageBox>
          <ImageContainer>
            {videoSrcPath2 ? (
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label={`${title} secondary demonstration video showing additional features`}
              >
                {getVideoSource(videoSrcPath2)}
                Your browser does not support the video tag.
              </video>
            ) : getImage(imageSrcPath2) ? (
              <GatsbyImage
                image={getImage(imageSrcPath2)}
                alt={`${title} secondary screenshot showing additional features`}
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
            ) : (
              <PlaceholderBox theme={theme}>
                <Typography theme={theme} variant="body2" color="text.secondary">
                  Media loading...
                </Typography>
              </PlaceholderBox>
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
            {techIcon3 && (
              <TechIcon theme={theme} role="img" aria-label={getTechAriaLabel(3, technologies)}>
                {renderTechIcon(techIcon3, getTechAriaLabel(3, technologies))}
              </TechIcon>
            )}
            {techIcon4 && (
              <TechIcon theme={theme} role="img" aria-label={getTechAriaLabel(4, technologies)}>
                {renderTechIcon(techIcon4, getTechAriaLabel(4, technologies))}
              </TechIcon>
            )}
            {techIcon5 && (
              <TechIcon theme={theme} role="img" aria-label={getTechAriaLabel(5, technologies)}>
                {renderTechIcon(techIcon5, getTechAriaLabel(5, technologies))}
              </TechIcon>
            )}
            {techIcon6 && (
              <TechIcon theme={theme} role="img" aria-label={getTechAriaLabel(6, technologies)}>
                {renderTechIcon(techIcon6, getTechAriaLabel(6, technologies))}
              </TechIcon>
            )}
            <TechIcon theme={theme} role="img" aria-label="React technology">
              <FaReact size={24} color={theme?.mode === 'dark' ? '#90caf9' : '#1976d2'} />
            </TechIcon>
            <TechIcon theme={theme} role="img" aria-label="Git version control">
              <FaGit size={24} color={theme?.mode === 'dark' ? '#90caf9' : '#1976d2'} />
            </TechIcon>
            {technologies.includes('Heroku') && (
              <TechIcon theme={theme} role="img" aria-label="Heroku deployment platform">
                <DiHeroku size={24} color={theme?.mode === 'dark' ? '#90caf9' : '#1976d2'} />
              </TechIcon>
            )}
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

        {normalizedDeployments.map((deployment, index) => (
          <DeploymentContainer key={`${deployment.url}-${index}`}>
            <IconLink
              theme={theme}
              href={deployment.url}
              title={`${deployment.label} - ${title}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${deployment.label} - ${title}`}
            >
              <DemoIcon aria-hidden="true" />
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
  techIcon3: PropTypes.elementType,
  techIcon4: PropTypes.elementType,
  techIcon5: PropTypes.elementType,
  techIcon6: PropTypes.elementType,
  technologies: PropTypes.arrayOf(PropTypes.string),
};

export default ProjectCard;
