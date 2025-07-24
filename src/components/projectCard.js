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
  Grid,
  useTheme,
} from '@mui/material';
import { GitHub, Launch, Code, Storage, Cloud } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { FaReact, FaGit } from 'react-icons/fa';
import { DiHeroku } from 'react-icons/di';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
  '& [data-gatsby-image-wrapper]': {
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.05)',
    },
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
  transition: 'all 0.3s ease',
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
  title,
  date,
  description,
  sourceURL,
  hostedURL,
}) {
  const theme = useTheme();

  return (
    <StyledCard elevation={3}>
      <ColoredBar />
      <Grid container spacing={2} sx={{ p: 2, pb: 0 }}>
        <Grid item xs={12} md={6}>
          <ImageContainer>
            <GatsbyImage
              image={getImage(imageSrcPath)}
              alt={`${title} - Screenshot 1`}
              loading="lazy"
              style={{ borderRadius: '8px' }}
            />
          </ImageContainer>
        </Grid>
        <Grid item xs={12} md={6}>
          <ImageContainer>
            <GatsbyImage
              image={getImage(imageSrcPath2)}
              alt={`${title} - Screenshot 2`}
              loading="lazy"
              style={{ borderRadius: '8px' }}
            />
          </ImageContainer>
        </Grid>
      </Grid>

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
            <TechIcon>
              <img
                src={imageSrcPath3}
                alt="Technology icon"
                width="24"
                height="24"
                style={{ objectFit: 'contain' }}
              />
            </TechIcon>
            <TechIcon>
              <img
                src={imageSrcPath4}
                alt="Technology icon"
                width="24"
                height="24"
                style={{ objectFit: 'contain' }}
              />
            </TechIcon>
            <TechIcon>
              <img
                src={imageSrcPath5}
                alt="Technology icon"
                width="24"
                height="24"
                style={{ objectFit: 'contain' }}
              />
            </TechIcon>
            {typeof window !== 'undefined' && (
              <>
                <TechIcon>
                  <FaReact size={24} color={theme.palette.text.secondary} />
                </TechIcon>
                <TechIcon>
                  <FaGit size={24} color={theme.palette.text.secondary} />
                </TechIcon>
                <TechIcon>
                  <DiHeroku size={24} color={theme.palette.text.secondary} />
                </TechIcon>
              </>
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
};

export default ProjectCard;
