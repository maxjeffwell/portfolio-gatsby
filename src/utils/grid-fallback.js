// SSR-safe Grid fallback component
import React from 'react';

// Simple fallback component that doesn't cause SSR issues
const GridFallback = ({ children, ...props }) => {
  return React.createElement('div', props, children);
};

// Export as default and named export to match MUI Grid API
export default GridFallback;
export { GridFallback as Grid };