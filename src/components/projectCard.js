import React from 'react';
import PropTypes from 'prop-types';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import styled from 'styled-components';
import { FaReact, FaGit } from 'react-icons/fa';
import { DiHeroku } from 'react-icons/di';
import { useTheme } from '../context/ThemeContext';

// Simple styled components to replace MUI components
const Typography = styled.div`
  margin: 0;
  font-family: inherit;
  font-weight: ${props => 
    props.variant === 'h5' ? 400 :
    props.variant === 'h6' ? 500 :
    props.variant === 'body1' ? 400 :
    props.variant === 'body2' ? 400 :
    400
  };
  font-size: ${props => 
    props.variant === 'h5' ? '1.5rem' :
    props.variant === 'h6' ? '1.25rem' :
    props.variant === 'body1' ? '1rem' :
    props.variant === 'body2' ? '0.875rem' :
    '1rem'
  };
  line-height: ${props => 
    props.variant === 'h5' ? 1.334 :
    props.variant === 'h6' ? 1.6 :
    props.variant === 'body1' ? 1.5 :
    props.variant === 'body2' ? 1.43 :
    1.5
  };
  color: ${props => {
    if (props.theme?.mode === 'dark') {
      if (props.color === 'text.secondary') return 'rgba(255, 255, 255, 0.7)';
      if (props.color === 'primary') return '#90caf9';
      return 'rgba(255, 255, 255, 0.87)';
    }
    if (props.color === 'text.secondary') return 'rgba(0, 0, 0, 0.6)';
    if (props.color === 'primary') return '#1976d2';
    return 'rgba(0, 0, 0, 0.87)';
  }};
  margin-bottom: ${props => props.gutterBottom ? '0.35em' : '0'};
  transition: color 0.3s ease;
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
  
  ${props => props.variant === 'outlined' && `
    color: ${props.theme?.colors?.primary || (props.theme?.mode === 'dark' ? '#90caf9' : '#1976d2')};
    border: 1px solid ${props.theme?.mode === 'dark' ? 'rgba(144, 202, 249, 0.5)' : 'rgba(25, 118, 210, 0.5)'};
    
    &:hover {
      border: 1px solid ${props.theme?.colors?.primary || (props.theme?.mode === 'dark' ? '#90caf9' : '#1976d2')};
      background-color: ${props.theme?.mode === 'dark' ? 'rgba(144, 202, 249, 0.08)' : 'rgba(25, 118, 210, 0.04)'};
    }
  `}
  
  ${props => props.size === 'small' && `
    padding: 4px 10px;
    font-size: 0.8125rem;
  `}
`;

const Stack = styled.div`
  display: flex;
  flex-direction: ${props => props.direction || 'column'};
  gap: ${props => props.spacing ? `${props.spacing * 8}px` : '8px'};
`;

// Simple icon components
const GitHubIcon = styled.span`
  font-size: 20px;
  margin-right: 8px;
  &::before {
    content: '🔗';
  }
`;

const LaunchIcon = styled.span`
  font-size: 20px;
  margin-right: 8px;
  &::before {
    content: '🚀';
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
  background-color: ${props => props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'};
  border-radius: 8px;
  transition: background-color 0.3s ease;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 16px;
`;

const TechContainer = styled.div`
  margin-top: auto;
`;

const CustomChip = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  padding: 0 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.43;
  letter-spacing: 0.01071em;
  background-color: transparent;
  border: 1px solid ${props => props.theme?.mode === 'dark' ? '#ce93d8' : '#9c27b0'};
  color: ${props => props.theme?.mode === 'dark' ? '#ce93d8' : '#9c27b0'};
  white-space: nowrap;
  transition: border-color 0.3s ease, color 0.3s ease;
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
  will-change: transform, box-shadow;
  background: ${props => props.theme?.mode === 'dark' 
    ? 'linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(45, 45, 45, 0.9) 100%)' 
    : 'white'};
  box-shadow:
    0px 3px 3px -2px rgba(0, 0, 0, 0.2),
    0px 3px 4px 0px rgba(0, 0, 0, 0.14),
    0px 1px 8px 0px rgba(0, 0, 0, 0.12);

  &:hover {
    transform: translateY(-8px);
    box-shadow:
      0px 5px 5px -3px rgba(0, 0, 0, 0.2),
      0px 8px 10px 1px rgba(0, 0, 0, 0.14),
      0px 3px 14px 2px rgba(0, 0, 0, 0.12);
  }
`;

const StyledCardContent = styled.div`
  flex-grow: 1;
  padding: 16px;
  padding-top: 16px;
`;

const StyledCardActions = styled.div`
  justify-content: space-between;
  padding: 16px;
  padding-top: 0;
  display: flex;
`;

const ColoredBar = styled.div`
  height: 4px;
  background: linear-gradient(90deg, #fc4a1a, #f7b733);
`;

const ImageContainer = styled.div`
  position: relative;
  overflow: hidden;
  aspect-ratio: 16 / 9;
  background-color: rgba(0, 0, 0, 0.04);
  border-radius: 8px;

  & [data-gatsby-image-wrapper] {
    transition: transform 0.3s ease-in-out;
    will-change: transform;
    border-radius: 8px;

    &:hover {
      transform: scale(1.05);
    }
  }

  & video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
    transition: transform 0.3s ease-in-out;
    will-change: transform;

    &:hover {
      transform: scale(1.05);
    }
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
  background-color: ${props => props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'};
  transition:
    transform 0.3s ease,
    background-color 0.3s ease;
  will-change: transform, background-color;

  &:hover {
    transform: scale(1.1);
    background-color: ${props => props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)'};
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
  technologies = [],
}) {
  const { theme } = useTheme();
  
  return (
    <StyledCard theme={theme}>
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
                <source src={videoSrcPath} type="video/webm" />
                <source src={videoSrcPath.replace('.webm', '.mp4')} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : getImage(imageSrcPath) ? (
              <GatsbyImage
                image={getImage(imageSrcPath)}
                alt={`${title} main screenshot showing the application interface`}
                loading="eager"
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
                <source src={videoSrcPath2} type="video/webm" />
                <source src={videoSrcPath2.replace('.webm', '.mp4')} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : getImage(imageSrcPath2) ? (
              <GatsbyImage
                image={getImage(imageSrcPath2)}
                alt={`${title} secondary screenshot showing additional features`}
                loading="eager"
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
        <HeaderContainer>
          <Typography theme={theme} variant="h5" component="h3" color="primary" fontWeight="bold">
            {title}
          </Typography>
          <CustomChip theme={theme}>{date}</CustomChip>
        </HeaderContainer>

        <Typography theme={theme} variant="body1" color="text.secondary" paragraph>
          {description}
        </Typography>

        <TechContainer>
          <Typography theme={theme} variant="subtitle2" color="text.secondary" gutterBottom>
            Technologies Used:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {techIcon3 && (
              <TechIcon theme={theme} role="img" aria-label="Technology used in project">
                {React.isValidElement(techIcon3) ? (
                  techIcon3
                ) : typeof techIcon3 === 'function' ? (
                  React.createElement(techIcon3, {
                    width: 24,
                    height: 24,
                    fill: '#fc4a1a',
                  })
                ) : (
                  <span>Icon3</span>
                )}
              </TechIcon>
            )}
            {techIcon4 && (
              <TechIcon theme={theme} role="img" aria-label="Technology used in project">
                {React.isValidElement(techIcon4) ? (
                  techIcon4
                ) : typeof techIcon4 === 'function' ? (
                  React.createElement(techIcon4, {
                    width: 24,
                    height: 24,
                    fill: '#fc4a1a',
                  })
                ) : (
                  <span>Icon4</span>
                )}
              </TechIcon>
            )}
            {techIcon5 && (
              <TechIcon theme={theme} role="img" aria-label="Technology used in project">
                {React.isValidElement(techIcon5) ? (
                  techIcon5
                ) : typeof techIcon5 === 'function' ? (
                  React.createElement(techIcon5, {
                    width: 24,
                    height: 24,
                    fill: '#fc4a1a',
                  })
                ) : (
                  <span>Icon5</span>
                )}
              </TechIcon>
            )}
            {techIcon6 && (
              <TechIcon theme={theme} role="img" aria-label="Technology used in project">
                {React.isValidElement(techIcon6) ? (
                  techIcon6
                ) : typeof techIcon6 === 'function' ? (
                  React.createElement(techIcon6, {
                    width: 24,
                    height: 24,
                    fill: '#fc4a1a',
                  })
                ) : (
                  <span>Icon6</span>
                )}
              </TechIcon>
            )}
            <TechIcon theme={theme} role="img" aria-label="React technology">
              <FaReact size={24} color="red" />
            </TechIcon>
            <TechIcon theme={theme} role="img" aria-label="Git version control">
              <FaGit size={24} color="red" />
            </TechIcon>
            {technologies.includes('Heroku') && (
              <TechIcon theme={theme} role="img" aria-label="Heroku deployment platform">
                <DiHeroku size={24} color="red" />
              </TechIcon>
            )}
          </Stack>
        </TechContainer>
      </StyledCardContent>

      <StyledCardActions>
        <Button
          theme={theme}
          as="a"
          variant="outlined"
          href={sourceURL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            borderRadius: 20,
            textTransform: 'none',
            paddingLeft: 24,
            paddingRight: 24,
          }}
        >
          <GitHubIcon />
          Source Code
        </Button>
        <Button
          theme={theme}
          as="a"
          variant="outlined"
          href={hostedURL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            borderRadius: 20,
            textTransform: 'none',
            paddingLeft: 24,
            paddingRight: 24,
          }}
        >
          <LaunchIcon />
          Live Demo
        </Button>
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
  hostedURL: PropTypes.string.isRequired,
  techIcon3: PropTypes.elementType,
  techIcon4: PropTypes.elementType,
  techIcon5: PropTypes.elementType,
  techIcon6: PropTypes.elementType,
  technologies: PropTypes.arrayOf(PropTypes.string),
};

export default ProjectCard;
