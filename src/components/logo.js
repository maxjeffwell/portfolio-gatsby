import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import IapfLogo from '../images/svg-icons/iapf.svg';
import AspcaLogo from '../images/svg-icons/aspca.svg';
import ZapatistaFlag from '../images/svg-icons/zapatista_flag.svg';

const LogoContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 32px;
  align-items: center;
  justify-items: center;
  max-width: 800px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 24px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 20px;
    max-width: 300px;
  }
`;

const StyledIapfLogo = styled(IapfLogo)`
  transition: all 0.3s ease-in-out;
  width: 100%;
  max-width: 200px;
  height: auto;
  filter: ${(props) =>
    props.theme?.mode === 'dark' ? 'invert(1) brightness(1.2) contrast(1.2)' : 'none'};
`;

const StyledAspcaLogo = styled(AspcaLogo)`
  transition: all 0.3s ease-in-out;
  width: 100%;
  max-width: 200px;
  height: auto;
  filter: ${(props) => (props.theme?.mode === 'light' ? 'brightness(1.2) contrast(1.1)' : 'none')};
`;

const StyledZapatistaFlag = styled(ZapatistaFlag)`
  transition: all 0.3s ease-in-out;
  width: 100%;
  max-width: 200px;
  height: auto;
  filter: ${(props) =>
    props.theme?.mode === 'dark' ? 'brightness(1.1) contrast(1.1)' : 'none'};
  
  @media (max-width: 480px) {
    max-width: 150px;
  }
`;

function Logo() {
  const { theme } = useTheme();

  return (
    <LogoContainer>
      <StyledIapfLogo
        theme={theme}
        aria-label="International Anti Poaching Foundation logo"
        alt="International Anti Poaching Foundation logo"
      />
      <StyledAspcaLogo
        theme={theme}
        aria-label="American Society for the Prevention of Cruelty to Animals logo"
        alt="ASPCA - American Society for the Prevention of Cruelty to Animals logo"
      />
      <StyledZapatistaFlag
        theme={theme}
        aria-label="Zapatista movement flag representing indigenous rights and social justice"
        alt="Zapatista flag - Supporting indigenous rights and social justice movements"
      />
    </LogoContainer>
  );
}

export default Logo;
