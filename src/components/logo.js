import React from 'react';
import styled from 'styled-components';
import IapfLogo from '../images/svg-icons/iapf.svg';
import AspcaLogo from '../images/svg-icons/aspca.svg';
import ChiapasMapImage from '../images/chiapas_map.png';

const LogoContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 32px;
  align-items: center;
  justify-items: center;
  max-width: 800px;
  margin: 0 auto;
  
  /* Center the third item (Chiapas map) when it wraps to its own row */
  & > *:nth-child(3):last-child {
    grid-column: 1 / -1;
    justify-self: center;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 24px;
    
    & > *:nth-child(3):last-child {
      grid-column: 1 / -1;
      justify-self: center;
    }
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 20px;
    max-width: 300px;
    
    & > *:nth-child(3) {
      justify-self: center;
    }
  }
`;

const StyledIapfLogo = styled(IapfLogo)`
  width: 100%;
  max-width: 200px;
  height: auto;

  .dark-mode & {
    filter: invert(1) brightness(1.2) contrast(1.2);
  }
`;

const StyledAspcaLogo = styled(AspcaLogo)`
  width: 100%;
  max-width: 200px;
  height: auto;
  filter: brightness(1.2) contrast(1.1);

  .dark-mode & {
    filter: none;
  }
`;

const StyledChiapasMap = styled.img`
  width: 100%;
  max-width: 200px;
  height: auto;
  padding: 24px;
  
  @media (max-width: 480px) {
    max-width: 150px;
    padding: 16px;
  }
`;

function Logo() {
  return (
    <LogoContainer>
      <StyledIapfLogo
        aria-label="International Anti Poaching Foundation logo"
        alt="International Anti Poaching Foundation logo"
      />
      <StyledAspcaLogo
        aria-label="American Society for the Prevention of Cruelty to Animals logo"
        alt="ASPCA - American Society for the Prevention of Cruelty to Animals logo"
      />
      <StyledChiapasMap
        src={ChiapasMapImage}
        width={200}
        height={200}
        aria-label="Map of Chiapas representing indigenous rights and social justice"
        alt="Chiapas map - Supporting indigenous rights and social justice movements"
      />
    </LogoContainer>
  );
}

export default Logo;
