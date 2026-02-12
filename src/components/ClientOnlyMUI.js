// This component is no longer needed as MUI has been completely removed
// Keeping it as a fallback to prevent import errors during transition

import React from 'react';

const variantMap = { h1: 'h1', h2: 'h2', h3: 'h3', h4: 'h4', h5: 'h5', h6: 'h6' };

const ClientOnlyMUI = ({ component: ComponentName, children, fallback = null, ...props }) => {
  // Provide basic HTML fallbacks for common components
  if (ComponentName === 'Typography') {
    const Component = variantMap[props.variant] || 'p';
    return React.createElement(Component, { ...props, variant: undefined }, children);
  }

  if (ComponentName === 'Button') {
    return (
      <button type="button" {...props}>
        {children}
      </button>
    );
  }

  // Return fallback or simple div for other components
  return fallback || <div {...props}>{children}</div>;
};

export default ClientOnlyMUI;
