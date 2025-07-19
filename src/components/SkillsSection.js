import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { useTheme } from '../context/ThemeContext';

const SkillsContainer = styled.div`
  background: ${(props) => props.theme.gradients.subtle};
  border-radius: 16px;
  padding: 3rem 2rem;
  backdrop-filter: blur(10px);
  border: 1px solid ${(props) => props.theme.colors.border};
  box-shadow: ${(props) => props.theme.shadows.medium};

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
  color: ${(props) => props.theme.name === 'dark' ? '#000000' : props.theme.colors.text};
  font-weight: 500;
`;

const SkillBar = styled.div`
  flex: 1;
  height: 8px;
  background: ${(props) => props.theme.colors.secondary};
  border-radius: 4px;
  margin: 0 1rem;
  overflow: hidden;
  position: relative;
`;

const SkillProgress = styled.div`
  height: 100%;
  background: ${(props) => props.theme.gradients.accent};
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
  color: ${(props) => props.theme.name === 'dark' ? '#000000' : props.theme.colors.textSecondary};
  min-width: 40px;
  text-align: right;
`;

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
    // eslint-disable-next-line react/jsx-filename-extension
    <SkillsContainer theme={theme}>
      <h2
        css={css`
          color: ${theme.name === 'dark' ? '#000000' : theme.colors.text};
          font-family: HelveticaNeueLTStd-Bd, sans-serif;
          font-size: 2.25rem;
          margin-bottom: 2rem;
          text-align: center;
          background: ${theme.gradients.accent};
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;

          @media (max-width: 768px) {
            font-size: 1.875rem;
          }
        `}
        id="skills-heading"
      >
        Technical Skills
      </h2>

      {Object.entries(skills).map(([category, categorySkills], categoryIndex) => (
        <SkillCategory key={category}>
          <h3
            css={css`
              color: ${theme.name === 'dark' ? '#000000' : theme.colors.text};
              font-family: HelveticaNeueLTStd-Bd, sans-serif;
              font-size: 1.5rem;
              margin-bottom: 1.5rem;
              padding-bottom: 0.5rem;
              border-bottom: 2px solid ${theme.colors.accentSecondary};
              position: relative;

              &::after {
                content: '';
                position: absolute;
                bottom: -2px;
                left: 0;
                width: 50px;
                height: 2px;
                background: ${theme.gradients.accent};
              }

              @media (max-width: 768px) {
                font-size: 1.25rem;
              }
            `}
          >
            {category}
          </h3>

          {categorySkills.map((skill, skillIndex) => (
            <SkillItem key={skill.name}>
              <SkillName theme={theme}>{skill.name}</SkillName>
              <SkillBar theme={theme}>
                <SkillProgress
                  theme={theme}
                  level={visible ? skill.level : 0}
                  delay={categoryIndex * 200 + skillIndex * 100}
                />
              </SkillBar>
              <SkillLevel theme={theme}>{skill.level}%</SkillLevel>
            </SkillItem>
          ))}
        </SkillCategory>
      ))}
    </SkillsContainer>
  );
}

SkillsSection.propTypes = {
  visible: PropTypes.bool.isRequired,
};

export default SkillsSection;
