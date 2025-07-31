import React from 'react';
import { useTheme } from '../context/ThemeContext';
import IapfLogo from '../images/iapf.svg';
import AspcaLogo from '../images/aspca.svg';

function Logo() {
  const { theme } = useTheme();
  
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '32px',
      alignItems: 'center',
      justifyItems: 'center'
    }}>
      <IapfLogo
        aria-label="International Anti Poaching Foundation logo"
        style={{
          transition: 'all 0.3s ease-in-out',
          width: '100%',
          maxWidth: '200px',
          height: 'auto',
          filter: theme?.mode === 'dark' 
            ? 'brightness(1.8) contrast(0.9)' 
            : 'none'
        }}
      />
      <AspcaLogo
        aria-label="American Society for the Prevention of Cruelty to Animals logo"
        style={{
          transition: 'all 0.3s ease-in-out',
          width: '100%',
          maxWidth: '200px',
          height: 'auto',
          filter: theme?.mode === 'light' 
            ? 'brightness(1.2) contrast(1.1)' 
            : 'none'
        }}
      />
    </div>
  );
}

export default Logo;
