// SSR-safe MUI styles fallback
import React from 'react';

// Simple theme object for SSR
const defaultTheme = {
  breakpoints: {
    values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 },
  },
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    action: { hover: 'rgba(0, 0, 0, 0.04)' },
    divider: 'rgba(0, 0, 0, 0.12)',
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
    },
  },
  shadows: ['none', '0px 2px 1px -1px rgba(0,0,0,0.2)'],
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
};

// Simple theme creation
const createTheme = (options = {}) => ({ ...defaultTheme, ...options });

// Simple theme provider component
const ThemeProvider = ({ children, theme }) => children;

// Export functions
export { createTheme, ThemeProvider };
export default { createTheme, ThemeProvider };
