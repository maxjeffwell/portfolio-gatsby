// SSR-safe MUI fallback components
import React from 'react';
import styled from '@emotion/styled';

// Simple fallback components that don't cause SSR issues

// Typography component
const Typography = styled.div`
  margin: 0;
  font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
  font-weight: ${(props) => props.fontWeight || 400};
  font-size: ${(props) => {
    switch (props.variant) {
      case 'h1':
        return '2.125rem';
      case 'h2':
        return '1.5rem';
      case 'h3':
        return '1.25rem';
      case 'h4':
        return '1.125rem';
      case 'h5':
        return '1rem';
      case 'h6':
        return '0.875rem';
      case 'subtitle1':
        return '1rem';
      case 'subtitle2':
        return '0.875rem';
      case 'body1':
        return '1rem';
      case 'body2':
        return '0.875rem';
      case 'caption':
        return '0.75rem';
      default:
        return '1rem';
    }
  }};
  line-height: ${(props) => {
    switch (props.variant) {
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        return '1.2';
      default:
        return '1.43';
    }
  }};
  color: ${(props) => {
    if (props.color === 'primary') return '#1976d2';
    if (props.color === 'secondary') return '#dc004e';
    if (props.color === 'text.secondary') return 'rgba(0, 0, 0, 0.6)';
    return 'inherit';
  }};
  margin-bottom: ${(props) => (props.gutterBottom ? '0.35em' : '0')};

  @media (prefers-color-scheme: dark) {
    color: ${(props) => {
      if (props.color === 'primary') return '#90caf9';
      if (props.color === 'secondary') return '#f48fb1';
      if (props.color === 'text.secondary') return 'rgba(255, 255, 255, 0.7)';
      return 'inherit';
    }};
  }
`;

// Paper component
const Paper = styled.div`
  background-color: #fff;
  color: rgba(0, 0, 0, 0.87);
  transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  border-radius: 4px;
  box-shadow: ${(props) => {
    const elevation = props.elevation || 1;
    if (elevation === 0) return 'none';
    if (elevation === 1)
      return '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)';
    if (elevation === 2)
      return '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)';
    if (elevation === 3)
      return '0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)';
    return '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)';
  }};

  @media (prefers-color-scheme: dark) {
    background-color: #424242;
    color: #fff;
  }
`;

// Card components
const Card = styled.div`
  overflow: hidden;
  background-color: #fff;
  color: rgba(0, 0, 0, 0.87);
  transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  border-radius: 4px;
  box-shadow:
    0px 2px 1px -1px rgba(0, 0, 0, 0.2),
    0px 1px 1px 0px rgba(0, 0, 0, 0.14),
    0px 1px 3px 0px rgba(0, 0, 0, 0.12);

  @media (prefers-color-scheme: dark) {
    background-color: #424242;
    color: #fff;
  }
`;

const CardContent = styled.div`
  padding: 16px;

  &:last-child {
    padding-bottom: 24px;
  }
`;

const CardActions = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
`;

// Button component
const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-sizing: border-box;
  background-color: transparent;
  outline: 0;
  border: 0;
  margin: 0;
  border-radius: 4px;
  padding: 6px 16px;
  cursor: pointer;
  user-select: none;
  vertical-align: middle;
  text-decoration: none;
  color: #1976d2;
  font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.75;
  letter-spacing: 0.02857em;
  text-transform: uppercase;
  min-width: 64px;
  transition:
    background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;

  ${(props) =>
    props.variant === 'contained' &&
    `
    color: #fff;
    background-color: #1976d2;
    box-shadow: 0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12);
    
    &:hover {
      background-color: #1565c0;
      box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);
    }
  `}

  ${(props) =>
    props.variant === 'outlined' &&
    `
    border: 1px solid rgba(25, 118, 210, 0.5);
    
    &:hover {
      background-color: rgba(25, 118, 210, 0.04);
      border: 1px solid #1976d2;
    }
  `}
  
  ${(props) =>
    props.color === 'secondary' &&
    props.variant === 'contained' &&
    `
    background-color: #dc004e;
    
    &:hover {
      background-color: #c51162;
    }
  `}
  
  ${(props) =>
    props.color === 'secondary' &&
    props.variant === 'outlined' &&
    `
    color: #dc004e;
    border: 1px solid rgba(220, 0, 78, 0.5);
    
    &:hover {
      background-color: rgba(220, 0, 78, 0.04);
      border: 1px solid #dc004e;
    }
  `}
  
  &:hover {
    ${(props) => !props.variant && 'background-color: rgba(25, 118, 210, 0.04);'}
  }
`;

// IconButton component
const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-sizing: border-box;
  background-color: transparent;
  outline: 0;
  border: 0;
  margin: 0;
  border-radius: 50%;
  padding: 8px;
  cursor: pointer;
  user-select: none;
  vertical-align: middle;
  text-decoration: none;
  color: rgba(0, 0, 0, 0.54);
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }

  @media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.7);

    &:hover {
      background-color: rgba(255, 255, 255, 0.08);
    }
  }
`;

// Link component
const Link = styled.a`
  color: #1976d2;
  text-decoration: underline;

  &:hover {
    text-decoration: none;
  }

  @media (prefers-color-scheme: dark) {
    color: #90caf9;
  }
`;

// Stack component
const Stack = styled.div`
  display: flex;
  flex-direction: ${(props) => props.direction || 'column'};
  gap: ${(props) => (typeof props.spacing === 'number' ? `${props.spacing * 8}px` : '8px')};
  flex-wrap: ${(props) => props.flexWrap || 'nowrap'};
`;

// Select and MenuItem components
const Select = styled.select`
  display: block;
  width: 100%;
  padding: 16.5px 14px;
  font-size: 1rem;
  line-height: 1.4375em;
  color: rgba(0, 0, 0, 0.87);
  background-color: transparent;
  border: 1px solid rgba(0, 0, 0, 0.23);
  border-radius: 4px;

  &:focus {
    outline: none;
    border-color: #1976d2;
  }

  @media (prefers-color-scheme: dark) {
    color: #fff;
    border-color: rgba(255, 255, 255, 0.23);
  }
`;

const MenuItem = styled.option`
  background-color: #fff;
  color: rgba(0, 0, 0, 0.87);

  @media (prefers-color-scheme: dark) {
    background-color: #424242;
    color: #fff;
  }
`;

// Tooltip and NoSsr components (simple passthrough)
const Tooltip = ({ children, title, ...props }) => children;
const NoSsr = ({ children }) => children;

// Menu components (simple div for SSR)
const Menu = styled.div`
  background-color: #fff;
  border-radius: 4px;
  box-shadow:
    0px 5px 5px -3px rgba(0, 0, 0, 0.2),
    0px 8px 10px 1px rgba(0, 0, 0, 0.14),
    0px 3px 14px 2px rgba(0, 0, 0, 0.12);

  @media (prefers-color-scheme: dark) {
    background-color: #424242;
  }
`;

const ListItemIcon = styled.div`
  display: flex;
  align-items: center;
  min-width: 56px;
  color: rgba(0, 0, 0, 0.54);

  @media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.7);
  }
`;

const ListItemText = styled.div`
  margin: 0;
  font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.5;
  letter-spacing: 0.00938em;
`;

// Fade component (simple passthrough for SSR)
const Fade = ({ children, in: inProp, ...props }) => children;
const Slide = ({ children, in: inProp, ...props }) => children;

// GlobalStyles component (no-op for SSR)
const GlobalStyles = () => null;

// AppBar components
const AppBar = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1100;
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  flex-shrink: 0;
  background-color: #1976d2;
  color: #fff;
  transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  box-shadow:
    0px 2px 4px -1px rgba(0, 0, 0, 0.2),
    0px 4px 5px 0px rgba(0, 0, 0, 0.14),
    0px 1px 10px 0px rgba(0, 0, 0, 0.12);

  @media (prefers-color-scheme: dark) {
    background-color: #424242;
  }
`;

const Toolbar = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding-left: 16px;
  padding-right: 16px;
  min-height: 56px;

  @media (min-width: 600px) {
    min-height: 64px;
  }
`;

const Drawer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100%;
  background-color: #fff;
  box-shadow:
    0px 8px 10px -5px rgba(0, 0, 0, 0.2),
    0px 16px 24px 2px rgba(0, 0, 0, 0.14),
    0px 6px 30px 5px rgba(0, 0, 0, 0.12);
  transform: translateX(-100%);
  transition: transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms;
  z-index: 1200;

  @media (prefers-color-scheme: dark) {
    background-color: #424242;
  }

  ${(props) =>
    props.open &&
    `
    transform: translateX(0);
  `}
`;

// useTheme hook fallback
const useTheme = () => ({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    action: { hover: 'rgba(0, 0, 0, 0.04)' },
    divider: 'rgba(0, 0, 0, 0.12)',
  },
  shadows: ['none', '0px 2px 1px -1px rgba(0,0,0,0.2)'],
  breakpoints: {
    up: (key) => `@media (min-width: 600px)`, // Simple fallback
    down: (key) => `@media (max-width: 959px)`, // Simple fallback
  },
});

// useMediaQuery hook fallback
const useMediaQuery = (query) => false; // Always return false for SSR

// Export all components
export {
  Typography,
  Paper,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Link,
  Stack,
  Select,
  MenuItem,
  Tooltip,
  NoSsr,
  Menu,
  ListItemIcon,
  ListItemText,
  Fade,
  Slide,
  GlobalStyles,
  AppBar,
  Toolbar,
  Drawer,
  useTheme,
  useMediaQuery,
};

// Default export with all components
export default {
  Typography,
  Paper,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Link,
  Stack,
  Select,
  MenuItem,
  Tooltip,
  NoSsr,
  Menu,
  ListItemIcon,
  ListItemText,
  Fade,
  Slide,
  GlobalStyles,
  AppBar,
  Toolbar,
  Drawer,
  useTheme,
  useMediaQuery,
};
