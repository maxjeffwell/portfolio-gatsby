// Create theme fallback for SSR compatibility

const createTheme = (options) => {
  return {
    palette: {
      mode: 'light',
      primary: { main: '#1976d2' },
      secondary: { main: '#dc004e' },
      ...options?.palette,
    },
    spacing: (value) => value * 8,
    breakpoints: {
      values: { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920 },
      up: (key) =>
        `@media (min-width:${typeof key === 'number' ? key : { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920 }[key]}px)`,
    },
    ...options,
  };
};

module.exports = createTheme;
module.exports.default = createTheme;
