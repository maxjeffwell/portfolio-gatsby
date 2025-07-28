// SSR-safe react-icons/di fallback
import React from 'react';

// Simple fallback icon component for SSR
const FallbackIcon = ({ size = 24, color = 'currentColor', ...props }) => 
  React.createElement('div', {
    ...props,
    style: {
      width: size,
      height: size,
      backgroundColor: color,
      borderRadius: '2px',
      display: 'inline-block',
      opacity: 0.7,
    }
  });

// Export specific icons used in the app
export const DiHeroku = FallbackIcon;
export const DiIntellij = FallbackIcon;
export const DiMozilla = FallbackIcon;
export const DiDebian = FallbackIcon;

// Default export with all icons
export default {
  DiHeroku: FallbackIcon,
  DiIntellij: FallbackIcon,
  DiMozilla: FallbackIcon,
  DiDebian: FallbackIcon,
};