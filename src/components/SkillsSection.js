import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Fade from '@mui/material/Fade';

const SkillsContainer = styled.div`
  background: ${(props) => props.theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.05)' 
    : 'rgba(0, 0, 0, 0.02)'};
  border-radius: 16px;
  padding: 3rem 2rem;
  backdrop-filter: blur(10px);
  border: 1px solid ${(props) => props.theme.palette.divider};
  box-shadow: ${(props) => props.theme.shadows[2]};

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }
`;

const SkillCategory = styled.div`
  margin-bottom: 2.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SkillItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding: 0.75rem 0;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SkillName = styled.span`
  font-family: HelveticaNeueLTStd-Roman, sans-serif;
  font-size: 1.1rem;
  color: ${(props) => props.theme.palette.mode === 'dark' ? '#000000' : props.theme.palette.text.primary};
  font-weight: 500;
`;

const SkillBar = styled.div`
  flex: 1;
  height: 8px;
  background: ${(props) => props.theme.palette.action.disabledBackground};
  border-radius: 4px;
  margin: 0 1rem;
  overflow: hidden;
  position: relative;
`;

const SkillProgress = styled.div`
  height: 100%;
  background: linear-gradient(135deg, ${(props) => props.theme.palette.primary.main} 0%, ${(props) => props.theme.palette.secondary.main} 100%);
  border-radius: 4px;
  width: ${(props) => props.level}%;
  transition: width 2s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: ${(props) => props.delay}ms;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transform: translateX(-100%);
    animation: shimmer 2s ease-in-out;
    animation-delay: ${(props) => props.delay + 500}ms;
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`;

const SkillLevel = styled.span`
  font-family: HelveticaNeueLTStd-Roman, sans-serif;
  font-size: 0.9rem;
  color: ${(props) => props.theme.palette.mode === 'dark' ? '#000000' : props.theme.palette.text.secondary};
  min-width: 40px;
  text-align: right;
`;

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

function SkillsSection({ visible }) {
  const { theme } = useTheme();

  return (
    <SkillsContainer elevation={2}>
      <Fade in={visible} timeout={800}>
        <Box>
          <GradientText variant="h4" component="h2" align="center" id="skills-heading" gutterBottom>
            Technical Skills
          </GradientText>

          {Object.entries(skills).map(([category, categorySkills], categoryIndex) => (
            <SkillCategory key={category}>
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
                      mb: 2,
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
                        background: theme => `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      }
                    }}
                  >
                    {category}
                  </Typography>
                  {categorySkills.map((skill, skillIndex) => (
                    <SkillItem key={skill.name}>
                      <SkillName theme={theme}>{skill.name}</SkillName>
                      <SkillBar theme={theme}>
                        <SkillProgress 
                          level={visible ? skill.level : 0}
                          delay={categoryIndex * 200 + skillIndex * 100}
                          theme={theme}
                        />
                      </SkillBar>
                      <SkillLevel theme={theme}>{skill.level}%</SkillLevel>
                    </SkillItem>
                  ))}
                </Box>
              </Fade>
            </SkillCategory>
          ))}
        </Box>
      </Fade>
    </SkillsContainer>
  );
}

SkillsSection.propTypes = {
  visible: PropTypes.bool.isRequired,
};

export default SkillsSection;
