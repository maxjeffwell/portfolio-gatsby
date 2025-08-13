// SSR-safe MUI utils fallback
import React from 'react';

// Simple createSvgIcon function for SSR
const createSvgIcon = (path, displayName) => {
  const SvgIcon = (props) => {
    // Ensure path is a string, not an object
    const pathData = typeof path === 'string' ? path : '';

    return React.createElement(
      'svg',
      {
        ...props,
        viewBox: '0 0 24 24',
        focusable: 'false',
        'aria-hidden': 'true',
      },
      React.createElement('path', { d: pathData })
    );
  };

  SvgIcon.displayName = displayName;
  return SvgIcon;
};

export { createSvgIcon };
export default { createSvgIcon };
