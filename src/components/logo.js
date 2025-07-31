import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import IapfLogo from '../images/svg-icons/iapf.svg';
import AspcaLogo from '../images/svg-icons/aspca.svg';

const LogoContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 32px;
  align-items: center;
  justify-items: center;
`;

const StyledIapfLogo = styled(IapfLogo)`
  transition: all 0.3s ease-in-out;
  width: 100%;
  max-width: 200px;
  height: auto;
  filter: ${props => props.theme?.mode === 'dark' 
    ? 'invert(1) hue-rotate(200deg) saturate(1.5) brightness(1.1) contrast(1.2)' 
    : 'none'};
`;

const StyledAspcaLogo = styled(AspcaLogo)`
  transition: all 0.3s ease-in-out;
  width: 100%;
  max-width: 200px;
  height: auto;
  filter: ${props => props.theme?.mode === 'light' 
    ? 'brightness(1.2) contrast(1.1)' 
    : 'none'};
`;

function Logo() {
  const { theme } = useTheme();
  
  return (
    <LogoContainer>
      <StyledIapfLogo
        theme={theme}
        aria-label="International Anti Poaching Foundation logo"
      />
      <StyledAspcaLogo
        theme={theme}
        aria-label="American Society for the Prevention of Cruelty to Animals logo"
      />
    </LogoContainer>
  );
}

export default Logo;
