import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import elephantLogo from '../images/elephant_logo.png';

const StyledLogoImg = styled.img`
  width: 50px;
  height: 50px;
  transition: all 0.3s ease-in-out;
  filter: ${props => props.theme?.mode === 'dark' ? 'brightness(0.9) contrast(1.1)' : 'none'};
  
  &:hover {
    transform: scale(1.05);
    filter: ${props => props.theme?.mode === 'dark' ? 'brightness(1) contrast(1.2)' : 'brightness(1.1)'};
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
