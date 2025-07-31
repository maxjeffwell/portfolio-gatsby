import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import ElephantLogo from '../images/elephant_logo.svg';

const StyledElephantLogo = styled(ElephantLogo)`
  width: 100px;
  height: 85px;
  transition: all 0.3s ease-in-out;
  
  .elephant-body {
    fill: ${props => props.theme?.mode === 'dark' ? '#4a5568' : '#2c3e50'};
  }
  
  .elephant-accent {
    fill: ${props => props.theme?.mode === 'dark' ? '#5a6575' : '#34495e'};
  }
`;

function MyLogo() {
  const { theme } = useTheme();

  return (
    <StyledElephantLogo
      theme={theme}
      alt="Jeff Maxwell portfolio logo featuring an elephant design"
      loading="eager"
    />
  );
}

export default MyLogo;
