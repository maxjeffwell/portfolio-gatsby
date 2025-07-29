// Simple theme configuration for styled-components
// This replaces the previous MUI theme configuration

export const theme = {
  colors: {
    primary: '#fc4a1a',
    secondary: '#052f5f',
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
    },
    background: {
      paper: '#ffffff',
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      'AvenirLTStd-Roman',
      'HelveticaNeueLTStd-Roman',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  breakpoints: {
    xs: '0px',
    sm: '600px',
    md: '960px',
    lg: '1280px',
    xl: '1920px',
  },
  spacing: (factor) => `${factor * 8}px`,
};

// Export for backward compatibility
export const muiTheme = theme;
export const muiThemeConfig = theme;