import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import elephantLogo from '../images/elephant_noun_project.png';

const StyledLogoImg = styled.img`
  width: 50px;
  height: 50px;
  transition: all 0.3s ease-in-out;
  filter: brightness(0) saturate(100%) invert(20%) sepia(8%) saturate(1000%) hue-rotate(180deg) brightness(95%) contrast(85%);
  
  &:hover {
    transform: scale(1.05);
    filter: brightness(0) saturate(100%) invert(15%) sepia(10%) saturate(1200%) hue-rotate(180deg) brightness(90%) contrast(90%);
  }
`;

function MyLogo() {
  const { theme } = useTheme();

  return (
    <StyledLogoImg
      src={elephantLogo}
      theme={theme}
      alt="Jeff Maxwell portfolio elephant logo"
      loading="eager"
    />
  );
}

export default MyLogo;
