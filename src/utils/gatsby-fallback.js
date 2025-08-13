// SSR-safe Gatsby fallback
import React from 'react';

// Simple Script component that doesn't cause SSR issues
const Script = ({ children, strategy, src, id, ...props }) => {
  // Return null during SSR, scripts will be handled by the browser
  return null;
};

// Export Script component
export { Script };

// Default export with all Gatsby components we might need
export default {
  Script,
};
