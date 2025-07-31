import React from 'react';
import styled from 'styled-components';
import { StaticImage } from 'gatsby-plugin-image';
import { useTheme } from '../context/ThemeContext';

const StyledLogoContainer = styled.div`
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease-in-out;
  filter: brightness(0) saturate(100%) invert(20%) sepia(8%) saturate(1000%) hue-rotate(180deg)
    brightness(95%) contrast(85%);

  &:hover {
    transform: scale(1.05);
    filter: brightness(0) saturate(100%) invert(15%) sepia(10%) saturate(1200%) hue-rotate(180deg)
      brightness(90%) contrast(90%);
  }

  .gatsby-image-wrapper {
    width: 100%;
    height: 100%;
  }
`;

function MyLogo() {
  const { theme } = useTheme();

  return (
    <StyledLogoContainer theme={theme}>
      <StaticImage
        src="../images/elephant_noun_project.png"
        alt="Jeff Maxwell portfolio elephant logo"
        placeholder="blurred"
        loading="eager"
        width={60}
        height={60}
        quality={95}
      />
    </StyledLogoContainer>
  );
}

export default MyLogo;
