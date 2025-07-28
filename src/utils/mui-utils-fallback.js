// SSR-safe MUI utils fallback
import React from 'react';

// Simple createSvgIcon function for SSR
const createSvgIcon = (path, displayName) => {
  const SvgIcon = (props) => React.createElement('svg', {
    ...props,
    viewBox: '0 0 24 24',
    focusable: 'false',
    'aria-hidden': 'true',
  }, React.createElement('path', { d: path }));
  
  SvgIcon.displayName = displayName;
  return SvgIcon;
};

export { createSvgIcon };
export default { createSvgIcon };