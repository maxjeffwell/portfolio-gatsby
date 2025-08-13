// This component is no longer needed as MUI has been completely removed
// Keeping it as a fallback to prevent import errors during transition

import React from 'react';

const ClientOnlyMUI = ({ component: ComponentName, children, fallback = null, ...props }) => {
  // Provide basic HTML fallbacks for common components
  if (ComponentName === 'Typography') {
    const Component =
      props.variant === 'h1'
        ? 'h1'
        : props.variant === 'h2'
          ? 'h2'
          : props.variant === 'h3'
            ? 'h3'
            : props.variant === 'h4'
              ? 'h4'
              : props.variant === 'h5'
                ? 'h5'
                : props.variant === 'h6'
                  ? 'h6'
                  : 'p';
    return React.createElement(Component, { ...props, variant: undefined }, children);
  }

  if (ComponentName === 'Button') {
    return <button {...props}>{children}</button>;
  }

  // Return fallback or simple div for other components
  return fallback || <div {...props}>{children}</div>;
};

export default ClientOnlyMUI;
