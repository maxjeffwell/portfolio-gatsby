// MUI System fallback for SSR compatibility
// Provides minimal implementations of system utilities

// Color manipulation utilities
const alpha = (color, value) => {
  if (typeof color !== 'string') return color;
  
  // Handle hex colors
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    const num = parseInt(hex, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${value})`;
  }
  
  // Handle rgb/rgba colors - just return as is for SSR
  if (color.startsWith('rgb')) {
    return color;
  }
  
  return color;
};

const lighten = (color, coefficient) => {
  // Simple fallback - return original color for SSR
  return color;
};

const darken = (color, coefficient) => {
  // Simple fallback - return original color for SSR
  return color;
};

const emphasize = (color, coefficient = 0.15) => {
  // Simple fallback - return original color for SSR
  return color;
};

const getContrastRatio = (foreground, background) => {
  // Simple fallback - return reasonable contrast ratio
  return 4.5;
};

const getLuminance = (color) => {
  // Simple fallback - return middle luminance
  return 0.5;
};

// Spacing function
const spacing = (...args) => {
  if (args.length === 0) return 8;
  if (args.length === 1) return args[0] * 8;
  return args.map(arg => typeof arg === 'number' ? arg * 8 : arg).join(' ');
};

// Breakpoints utilities
const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
  },
  up: (key) => `@media (min-width:${typeof key === 'number' ? key : breakpoints.values[key]}px)`,
  down: (key) => `@media (max-width:${typeof key === 'number' ? key - 1 : breakpoints.values[key] - 1}px)`,
  between: (start, end) => 
    `@media (min-width:${typeof start === 'number' ? start : breakpoints.values[start]}px) and (max-width:${typeof end === 'number' ? end - 1 : breakpoints.values[end] - 1}px)`,
  only: (key) => {
    const keys = Object.keys(breakpoints.values);
    const keyIndex = keys.indexOf(key);
    if (keyIndex === keys.length - 1) {
      return breakpoints.up(key);
    }
    return breakpoints.between(key, keys[keyIndex + 1]);
  },
};

// System props utilities
const compose = (...transforms) => {
  return (props) => {
    return transforms.reduce((acc, transform) => {
      return { ...acc, ...transform(props) };
    }, {});
  };
};

const style = (options) => {
  const { prop, cssProperty, transform } = options;
  return (props) => {
    const value = props[prop];
    if (value == null) return {};
    
    const finalValue = transform ? transform(value) : value;
    const finalCssProperty = cssProperty || prop;
    
    return { [finalCssProperty]: finalValue };
  };
};

// Theme utilities
const createTheme = (options) => {
  return {
    palette: {
      mode: 'light',
      primary: { main: '#1976d2' },
      secondary: { main: '#dc004e' },
      ...options?.palette
    },
    spacing: options?.spacing || spacing,
    breakpoints: options?.breakpoints || breakpoints,
    ...options
  };
};

const createStyled = () => {
  return () => 'div';
};

const useThemeProps = ({ props, name }) => {
  return props;
};

const useMediaQuery = (query) => {
  // SSR fallback - assume desktop
  return false;
};

const styleFunctionSx = () => ({});

// Grid component fallback
const UnstableGrid = 'div';

// Export all utilities
module.exports = {
  // Color manipulation
  alpha,
  lighten,
  darken,
  emphasize,
  getContrastRatio,
  getLuminance,
  
  // Layout
  spacing,
  breakpoints,
  
  // System utilities
  compose,
  style,
  createTheme,
  createStyled,
  useThemeProps,
  useMediaQuery,
  styleFunctionSx,
  Unstable_Grid: UnstableGrid,
  
  // Default exports for common imports
  default: {
    alpha,
    lighten,
    darken,
    emphasize,
    getContrastRatio,
    getLuminance,
    spacing,
    breakpoints,
    compose,
    style,
    createTheme,
    createStyled,
    useThemeProps,
    useMediaQuery,
    styleFunctionSx,
    Unstable_Grid: UnstableGrid,
  }
};