// Color manipulator fallback for SSR compatibility

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

module.exports = {
  alpha,
  lighten,
  darken,
  emphasize,
  getContrastRatio,
  getLuminance,
};