import React from 'react';
import IapfLogo from '../images/iapf.svg';
import AspcaLogo from '../images/aspca.svg';

function Logo() {
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
          transition: 'opacity 0.3s ease-in-out',
          width: '100%',
          maxWidth: '200px',
          height: 'auto'
        }}
      />
      <AspcaLogo
        aria-label="American Society for the Prevention of Cruelty to Animals logo"
        style={{
          transition: 'opacity 0.3s ease-in-out',
          width: '100%',
          maxWidth: '200px',
          height: 'auto'
        }}
      />
    </div>
  );
}

export default Logo;
