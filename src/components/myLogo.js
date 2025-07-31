import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import ElephantLogo from '../images/elephant_logo.svg';

const StyledElephantLogo = styled(ElephantLogo)`
  width: 100px;
  height: 85px;
  transition: all 0.3s ease-in-out;
  
  path[fill="#2c3e50"], 
  circle[fill="#2c3e50"], 
  rect[fill="#2c3e50"] {
    fill: ${props => props.theme?.mode === 'dark' ? '#4a5568' : '#2c3e50'};
  }
  
  ellipse[fill="#34495e"], 
  path[fill="#34495e"] {
    fill: ${props => props.theme?.mode === 'dark' ? '#5a6575' : '#34495e'};
  }
  
  circle[fill="#ffffff"] {
    fill: ${props => props.theme?.mode === 'dark' ? '#f7fafc' : '#ffffff'};
  }
  
  circle[fill="#000000"] {
    fill: ${props => props.theme?.mode === 'dark' ? '#2d3748' : '#000000'};
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
