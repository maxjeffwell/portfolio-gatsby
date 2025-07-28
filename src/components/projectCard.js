import React from 'react';
import PropTypes from 'prop-types';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import { Card, CardContent, CardActions, Typography, Button, Stack, NoSsr } from '@mui/material';
import { GitHub, Launch } from '@mui/icons-material';
import styled from '@emotion/styled';
import { FaReact, FaGit } from 'react-icons/fa';
import { DiHeroku } from 'react-icons/di';

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
  background-color: rgba(0, 0, 0, 0.04);
  border-radius: 8px;

  @media (prefers-color-scheme: dark) {
    background-color: rgba(255, 255, 255, 0.08);
  }
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
  border: 1px solid #9c27b0;
  color: #9c27b0;
  white-space: nowrap;

  @media (prefers-color-scheme: dark) {
    border-color: #ce93d8;
    color: #ce93d8;
  }
`;

const StyledCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  overflow: hidden;
  transition:
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform, box-shadow;
  background: white;

  @media (prefers-color-scheme: dark) {
    background: linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(45, 45, 45, 0.9) 100%);
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow:
      0px 5px 5px -3px rgba(0, 0, 0, 0.2),
      0px 8px 10px 1px rgba(0, 0, 0, 0.14),
      0px 3px 14px 2px rgba(0, 0, 0, 0.12);
  }
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
  background-color: rgba(0, 0, 0, 0.04);
  transition:
    transform 0.3s ease,
    background-color 0.3s ease;
  will-change: transform, background-color;

  &:hover {
    transform: scale(1.1);
    background-color: rgba(0, 0, 0, 0.08);
  }

  @media (prefers-color-scheme: dark) {
    background-color: rgba(255, 255, 255, 0.08);

    &:hover {
      background-color: rgba(255, 255, 255, 0.12);
    }
  }
`;

function ProjectCard({
  imageSrcPath,
  imageSrcPath2,
  imageSrcPath3,
  imageSrcPath4,
  imageSrcPath5,
  imageSrcPath6,
  title,
  date,
  description,
  sourceURL,
  hostedURL,
  technologies = [],
}) {
  return (
    <StyledCard elevation={3}>
      <ColoredBar />
      <FlexContainer>
        <ImageBox>
          <ImageContainer>
            {getImage(imageSrcPath) ? (
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
              <PlaceholderBox>
                <Typography variant="body2" color="text.secondary">
                  Image loading...
                </Typography>
              </PlaceholderBox>
            )}
          </ImageContainer>
        </ImageBox>
        <ImageBox>
          <ImageContainer>
            {getImage(imageSrcPath2) ? (
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
              <PlaceholderBox>
                <Typography variant="body2" color="text.secondary">
                  Image loading...
                </Typography>
              </PlaceholderBox>
            )}
          </ImageContainer>
        </ImageBox>
      </FlexContainer>

      <CardContent style={{ flexGrow: 1, paddingTop: '16px' }}>
        <HeaderContainer>
          <Typography variant="h5" component="h3" color="primary" fontWeight="bold">
            {title}
          </Typography>
          <CustomChip>{date}</CustomChip>
        </HeaderContainer>

        <Typography variant="body1" color="text.secondary" paragraph>
          {description}
        </Typography>

        <TechContainer>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Technologies Used:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {imageSrcPath3 && (
              <TechIcon role="img" aria-label="Technology used in project">
                {React.createElement(imageSrcPath3, {
                  width: 24,
                  height: 24,
                  style: {
                    filter:
                      'brightness(0) saturate(100%) invert(13%) sepia(86%) saturate(7486%) hue-rotate(0deg) brightness(92%) contrast(119%)',
                  },
                })}
              </TechIcon>
            )}
            {imageSrcPath4 && (
              <TechIcon role="img" aria-label="Technology used in project">
                {React.createElement(imageSrcPath4, {
                  width: 24,
                  height: 24,
                  style: {
                    filter:
                      'brightness(0) saturate(100%) invert(13%) sepia(86%) saturate(7486%) hue-rotate(0deg) brightness(92%) contrast(119%)',
                  },
                })}
              </TechIcon>
            )}
            {imageSrcPath5 && (
              <TechIcon role="img" aria-label="Technology used in project">
                {React.createElement(imageSrcPath5, {
                  width: 24,
                  height: 24,
                  style: {
                    filter:
                      'brightness(0) saturate(100%) invert(13%) sepia(86%) saturate(7486%) hue-rotate(0deg) brightness(92%) contrast(119%)',
                  },
                })}
              </TechIcon>
            )}
            {imageSrcPath6 && (
              <TechIcon role="img" aria-label="Technology used in project">
                {React.createElement(imageSrcPath6, {
                  width: 24,
                  height: 24,
                  style: {
                    filter:
                      'brightness(0) saturate(100%) invert(13%) sepia(86%) saturate(7486%) hue-rotate(0deg) brightness(92%) contrast(119%)',
                  },
                })}
              </TechIcon>
            )}
            <NoSsr>
              <TechIcon role="img" aria-label="React technology">
                <FaReact size={24} color="red" />
              </TechIcon>
            </NoSsr>
            <NoSsr>
              <TechIcon role="img" aria-label="Git version control">
                <FaGit size={24} color="red" />
              </TechIcon>
            </NoSsr>
            {technologies.includes('Heroku') && (
              <NoSsr>
                <TechIcon role="img" aria-label="Heroku deployment platform">
                  <DiHeroku size={24} color="red" />
                </TechIcon>
              </NoSsr>
            )}
          </Stack>
        </TechContainer>
      </CardContent>

      <CardActions style={{ justifyContent: 'space-between', padding: '16px', paddingTop: '0' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<GitHub />}
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
          Source Code
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<Launch />}
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
          Live Demo
        </Button>
      </CardActions>
    </StyledCard>
  );
}

ProjectCard.propTypes = {
  imageSrcPath: PropTypes.object.isRequired,
  imageSrcPath2: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  sourceURL: PropTypes.string.isRequired,
  hostedURL: PropTypes.string.isRequired,
  imageSrcPath3: PropTypes.elementType,
  imageSrcPath4: PropTypes.elementType,
  imageSrcPath5: PropTypes.elementType,
  imageSrcPath6: PropTypes.elementType,
  technologies: PropTypes.arrayOf(PropTypes.string),
};

export default ProjectCard;
