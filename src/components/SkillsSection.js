import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { useTheme } from '../context/ThemeContext';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Fade from '@mui/material/Fade';

const SkillsContainer = styled('div')(({ theme }) => ({
  background: theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.05)' 
    : 'rgba(0, 0, 0, 0.02)',
  borderRadius: '16px',
  padding: '3rem 2rem',
  backdropFilter: 'blur(10px)',
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[2],
  [theme.breakpoints.down('md')]: {
    padding: '2rem 1.5rem',
  },
}));

const SkillCategory = styled('div')({
  marginBottom: '2.5rem',
  '&:last-child': {
    marginBottom: 0,
  },
});

const SkillItem = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '1rem',
  padding: '0.75rem 0',
  '&:last-child': {
    marginBottom: 0,
  },
});

const SkillName = styled('span')(({ theme }) => ({
  fontFamily: 'HelveticaNeueLTStd-Roman, sans-serif',
  fontSize: '1.1rem',
  color: theme.palette.mode === 'dark' ? '#000000' : theme.palette.text.primary,
  fontWeight: 500,
}));

const SkillBar = styled('div')(({ theme }) => ({
  flex: 1,
  height: '8px',
  background: theme.palette.action.disabledBackground,
  borderRadius: '4px',
  margin: '0 1rem',
  overflow: 'hidden',
  position: 'relative',
}));

const SkillProgress = styled('div')(({ theme, level, delay }) => ({
  height: '100%',
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  borderRadius: '4px',
  width: `${level}%`,
  transition: 'width 2s cubic-bezier(0.4, 0, 0.2, 1)',
  transitionDelay: `${delay}ms`,
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
    transform: 'translateX(-100%)',
    animation: 'shimmer 2s ease-in-out',
    animationDelay: `${delay + 500}ms`,
  },
  '@keyframes shimmer': {
    '0%': {
      transform: 'translateX(-100%)',
    },
    '100%': {
      transform: 'translateX(100%)',
    },
  },
}));

const SkillLevel = styled('span')(({ theme }) => ({
  fontFamily: 'HelveticaNeueLTStd-Roman, sans-serif',
  fontSize: '0.9rem',
  color: theme.palette.mode === 'dark' ? '#000000' : theme.palette.text.secondary,
  minWidth: '40px',
  textAlign: 'right',
}));

const GradientText = styled(Typography)(({ theme }) => ({
  fontFamily: 'Avenir',
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  textFillColor: 'transparent',
  fontWeight: 700,
  marginBottom: theme.spacing(3),
}));

const skills = {
  'Frontend Development': [
    { name: 'React / Next.js', level: 95 },
    { name: 'JavaScript / TypeScript', level: 92 },
    { name: 'CSS / Sass / Styled Components', level: 90 },
    { name: 'HTML5 / Accessibility', level: 88 },
    { name: 'Redux / Context API', level: 85 },
  ],
  'Backend Development': [
    { name: 'Node.js / Express', level: 88 },
    { name: 'GraphQL / Apollo', level: 85 },
    { name: 'REST APIs', level: 90 },
    { name: 'MongoDB / PostgreSQL', level: 82 },
    { name: 'Redis / Caching', level: 78 },
  ],
  'Tools & Technologies': [
    { name: 'Git / GitHub', level: 92 },
    { name: 'Docker / Containerization', level: 75 },
    { name: 'AWS / Cloud Services', level: 70 },
    { name: 'Jest / Testing', level: 80 },
    { name: 'Webpack / Build Tools', level: 85 },
  ],
};

function SkillsSection({ visible = true }) {
  const { theme } = useTheme();

  return (
    <Box sx={{
      background: theme.palette.mode === 'dark' 
        ? 'rgba(255, 255, 255, 0.05)' 
        : 'rgba(0, 0, 0, 0.02)',
      borderRadius: 2,
      p: { xs: 3, md: 4 },
      backdropFilter: 'blur(10px)',
      border: `1px solid ${theme.palette.divider}`,
      boxShadow: theme.shadows[2],
    }}>
      <Typography 
        variant="h4" 
        component="h2" 
        align="center" 
        gutterBottom
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontWeight: 700,
          mb: 4,
        }}
      >
        Technical Skills
      </Typography>

      {Object.entries(skills).map(([category, categorySkills], categoryIndex) => (
        <Box key={category} sx={{ mb: 4, '&:last-child': { mb: 0 } }}>
          <Fade 
            in={visible} 
            timeout={800} 
            style={{ transitionDelay: `${categoryIndex * 200}ms` }}
          >
            <Box>
              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                  mb: 3,
                  pb: 1,
                  borderBottom: 2,
                  borderColor: 'primary.main',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -2,
                    left: 0,
                    width: 50,
                    height: 2,
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  }
                }}
              >
                {category}
              </Typography>
              
              {categorySkills.map((skill, skillIndex) => (
                <Box 
                  key={skill.name}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 2,
                    py: 1,
                    '&:last-child': { mb: 0 },
                  }}
                >
                  <Typography 
                    sx={{ 
                      fontSize: '1.1rem',
                      color: theme.palette.text.primary,
                      fontWeight: 500,
                    }}
                  >
                    {skill.name}
                  </Typography>
                  
                  <Box 
                    sx={{ 
                      flex: 1, 
                      height: 8, 
                      bgcolor: theme.palette.action.disabledBackground,
                      borderRadius: 1,
                      mx: 2,
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    <Box
                      sx={{
                        height: '100%',
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                        borderRadius: 1,
                        width: visible ? `${skill.level}%` : '0%',
                        transition: 'width 2s cubic-bezier(0.4, 0, 0.2, 1)',
                        transitionDelay: `${categoryIndex * 200 + skillIndex * 100}ms`,
                      }}
                    />
                  </Box>
                  
                  <Typography 
                    sx={{ 
                      fontSize: '0.9rem',
                      color: theme.palette.text.secondary,
                      minWidth: 40,
                      textAlign: 'right',
                    }}
                  >
                    {skill.level}%
                  </Typography>
                </Box>
              ))}
            </Box>
          </Fade>
        </Box>
      ))}
    </Box>
  );
}

SkillsSection.propTypes = {
  visible: PropTypes.bool.isRequired,
};

export default SkillsSection;
