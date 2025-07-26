import React from 'react';
import PropTypes from 'prop-types';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  Stack,
} from '@mui/material';
import { GitHub, Launch } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { FaReact, FaGit } from 'react-icons/fa';
import { DiHeroku } from 'react-icons/di';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  transition:
    'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  willChange: 'transform, box-shadow',
  background:
    theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(30,30,30,0.95) 0%, rgba(45,45,45,0.9) 100%)'
      : theme.palette.background.paper,
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[12],
  },
}));

const ColoredBar = styled(Box)(({ theme }) => ({
  height: 4,
  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  aspectRatio: '16 / 9',
  backgroundColor: theme.palette.action.hover,
  borderRadius: '8px',
  '& [data-gatsby-image-wrapper]': {
    transition: 'transform 0.3s ease-in-out',
    willChange: 'transform',
    borderRadius: '8px',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  [theme.breakpoints.down('sm')]: {
    aspectRatio: '4 / 3',
  },
  '@media (max-width: 360px)': {
    aspectRatio: '3 / 2',
    borderRadius: '6px',
  },
}));

const TechIcon = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  borderRadius: '50%',
  backgroundColor: theme.palette.action.hover,
  transition: 'transform 0.3s ease, background-color 0.3s ease',
  willChange: 'transform, background-color',
  '&:hover': {
    transform: 'scale(1.1)',
    backgroundColor: theme.palette.action.selected,
  },
}));

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
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 1.5, md: 2 },
          p: { xs: 1.5, md: 2 },
          pb: 0,
          '@media (max-width: 360px)': {
            p: 1,
            gap: 1,
          },
        }}
      >
        <Box sx={{ flex: 1 }}>
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
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'action.hover',
                  borderRadius: '8px',
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Image loading...
                </Typography>
              </Box>
            )}
          </ImageContainer>
        </Box>
        <Box sx={{ flex: 1 }}>
          <ImageContainer>
            {getImage(imageSrcPath2) ? (
              <GatsbyImage
                image={getImage(imageSrcPath2)}
                alt={`${title} secondary screenshot showing additional features`}
                loading="lazy"
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
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'action.hover',
                  borderRadius: '8px',
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Image loading...
                </Typography>
              </Box>
            )}
          </ImageContainer>
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, pt: 2 }}>
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 2 }}
        >
          <Typography variant="h5" component="h3" color="primary" fontWeight="bold">
            {title}
          </Typography>
          <Chip label={date} size="small" color="secondary" variant="outlined" />
        </Box>

        <Typography variant="body1" color="text.secondary" paragraph>
          {description}
        </Typography>

        <Box sx={{ mt: 'auto' }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Technologies Used:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {imageSrcPath3 && (
              <TechIcon role="img" aria-label="Technology used in project">
                <img
                  src={imageSrcPath3}
                  alt="Primary technology logo used in this project"
                  width="24"
                  height="24"
                  style={{
                    objectFit: 'contain',
                    filter:
                      'brightness(0) saturate(100%) invert(13%) sepia(86%) saturate(7486%) hue-rotate(0deg) brightness(92%) contrast(119%)',
                  }}
                />
              </TechIcon>
            )}
            {imageSrcPath4 && (
              <TechIcon role="img" aria-label="Technology used in project">
                <img
                  src={imageSrcPath4}
                  alt="Secondary technology logo used in this project"
                  width="24"
                  height="24"
                  style={{
                    objectFit: 'contain',
                    filter:
                      'brightness(0) saturate(100%) invert(13%) sepia(86%) saturate(7486%) hue-rotate(0deg) brightness(92%) contrast(119%)',
                  }}
                />
              </TechIcon>
            )}
            {imageSrcPath5 && (
              <TechIcon role="img" aria-label="Technology used in project">
                <img
                  src={imageSrcPath5}
                  alt="Third technology logo used in this project"
                  width="24"
                  height="24"
                  style={{
                    objectFit: 'contain',
                    filter:
                      'brightness(0) saturate(100%) invert(13%) sepia(86%) saturate(7486%) hue-rotate(0deg) brightness(92%) contrast(119%)',
                  }}
                />
              </TechIcon>
            )}
            {imageSrcPath6 && (
              <TechIcon role="img" aria-label="Technology used in project">
                <img
                  src={imageSrcPath6}
                  alt="Additional technology logo used in this project"
                  width="24"
                  height="24"
                  style={{
                    objectFit: 'contain',
                    filter:
                      'brightness(0) saturate(100%) invert(13%) sepia(86%) saturate(7486%) hue-rotate(0deg) brightness(92%) contrast(119%)',
                  }}
                />
              </TechIcon>
            )}
            <TechIcon role="img" aria-label="React technology">
              <FaReact size={24} color="red" />
            </TechIcon>
            <TechIcon role="img" aria-label="Git version control">
              <FaGit size={24} color="red" />
            </TechIcon>
            {technologies.includes('Heroku') && (
              <TechIcon role="img" aria-label="Heroku deployment platform">
                <DiHeroku size={24} color="red" />
              </TechIcon>
            )}
          </Stack>
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', p: 2, pt: 0 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<GitHub />}
          href={sourceURL}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            borderRadius: 20,
            textTransform: 'none',
            px: 3,
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
          sx={{
            borderRadius: 20,
            textTransform: 'none',
            px: 3,
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
  imageSrcPath3: PropTypes.string.isRequired,
  imageSrcPath4: PropTypes.string.isRequired,
  imageSrcPath5: PropTypes.string.isRequired,
  imageSrcPath6: PropTypes.string,
  technologies: PropTypes.arrayOf(PropTypes.string),
};

export default ProjectCard;
