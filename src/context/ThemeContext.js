import React, { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// Theme configuration
const lightTheme = {
  name: 'light',
  colors: {
    // Background colors
    primary: '#052f5f',
    secondary: '#2d3047',
    tertiary: '#121619',
    surface: '#ffffff',
    surfaceVariant: '#f5f5f5',

    // Text colors
    text: '#ffffff',
    textSecondary: '#f5f5f5',
    textInverse: '#052f5f',

    // Accent colors
    accent: '#fc4a1a',
    accentSecondary: '#f7b733',

    // Interactive colors
    link: '#f7b733',
    linkHover: '#ffffff',

    // Border colors
    border: '#363636',
    borderAccent: '#f7b733',

    // Status colors
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
    info: '#2196f3',
  },

  shadows: {
    small: '0 2px 4px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 8px rgba(0, 0, 0, 0.15)',
    large: '0 8px 16px rgba(0, 0, 0, 0.2)',
    hover: '0 12px 16px 0 rgba(0, 0, 0, 0.25), 0 17px 50px 0 rgba(0, 0, 0, 0.19)',
  },

  transitions: {
    fast: '0.15s cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: '0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    elastic: '0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },

  animations: {
    fadeIn: 'fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    slideUp: 'slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    slideInLeft: 'slideInLeft 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    slideInRight: 'slideInRight 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    scaleIn: 'scaleIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  },

  gradients: {
    primary: 'linear-gradient(135deg, #fc4a1a 0%, #f7b733 100%)',
    secondary: 'linear-gradient(135deg, #052f5f 0%, #2d3047 100%)',
    accent: 'linear-gradient(135deg, #f7b733 0%, #fc4a1a 100%)',
    subtle: 'linear-gradient(135deg, rgba(252, 74, 26, 0.1) 0%, rgba(247, 183, 51, 0.1) 100%)',
  },
};

const darkTheme = {
  name: 'dark',
  colors: {
    // Background colors
    primary: '#0a0a0a',
    secondary: '#1a1a1a',
    tertiary: '#2a2a2a',
    surface: '#121212',
    surfaceVariant: '#1e1e1e',

    // Text colors
    text: '#ffffff',
    textSecondary: '#e0e0e0',
    textInverse: '#000000',

    // Accent colors (keeping brand colors but adjusted for dark mode)
    accent: '#ff6b47',
    accentSecondary: '#ffc947',

    // Interactive colors
    link: '#ffc947',
    linkHover: '#ffffff',

    // Border colors
    border: '#404040',
    borderAccent: '#ffc947',

    // Status colors (adjusted for dark mode)
    success: '#66bb6a',
    warning: '#ffb74d',
    error: '#ef5350',
    info: '#42a5f5',
  },

  shadows: {
    small: '0 2px 4px rgba(0, 0, 0, 0.3)',
    medium: '0 4px 8px rgba(0, 0, 0, 0.4)',
    large: '0 8px 16px rgba(0, 0, 0, 0.5)',
    hover: '0 12px 16px 0 rgba(0, 0, 0, 0.4), 0 17px 50px 0 rgba(0, 0, 0, 0.3)',
  },

  transitions: {
    fast: '0.15s cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: '0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    elastic: '0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },

  animations: {
    fadeIn: 'fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    slideUp: 'slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    slideInLeft: 'slideInLeft 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    slideInRight: 'slideInRight 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    scaleIn: 'scaleIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  },

  gradients: {
    primary: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
    secondary: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
    accent: 'linear-gradient(135deg, #ffc947 0%, #ff6b47 100%)',
    subtle: 'linear-gradient(135deg, rgba(255, 201, 71, 0.1) 0%, rgba(255, 107, 71, 0.1) 100%)',
  },
};

// Create context
const ThemeContext = createContext();

// Hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    // During SSR, provide a default light theme
    if (typeof window === 'undefined') {
      return {
        theme: lightTheme,
        isDarkMode: false,
        isSystemPreference: true,
        toggleTheme: () => {},
        resetToSystemPreference: () => {},
        systemPreference: 'light',
      };
    }
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Get system preference
const getSystemPreference = () => {
  if (typeof window === 'undefined') return 'light';

  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

// Get stored preference or system preference
const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'light';

  const stored = localStorage.getItem('portfolio-theme');
  if (stored && (stored === 'light' || stored === 'dark')) {
    return stored;
  }

  return getSystemPreference();
};

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSystemPreference, setIsSystemPreference] = useState(true);

  // Initialize theme on mount
  useEffect(() => {
    const initialTheme = getInitialTheme();
    const hasStoredPreference = localStorage.getItem('portfolio-theme') !== null;

    setIsDarkMode(initialTheme === 'dark');
    setIsSystemPreference(!hasStoredPreference);
  }, []);

  // Listen for system preference changes
  useEffect(() => {
    if (!isSystemPreference) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e) => {
      if (isSystemPreference) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [isSystemPreference]);

  // Update document class and localStorage when theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;

    if (isDarkMode) {
      root.classList.add('dark-mode');
      root.classList.remove('light-mode');
    } else {
      root.classList.add('light-mode');
      root.classList.remove('dark-mode');
    }

    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDarkMode ? '#0a0a0a' : '#fc4a1a');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    setIsSystemPreference(false);

    // Store user preference
    localStorage.setItem('portfolio-theme', newMode ? 'dark' : 'light');
  };

  const resetToSystemPreference = () => {
    setIsSystemPreference(true);
    setIsDarkMode(getSystemPreference() === 'dark');
    localStorage.removeItem('portfolio-theme');
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  const value = {
    theme,
    isDarkMode,
    isSystemPreference,
    toggleTheme,
    resetToSystemPreference,
    systemPreference: getSystemPreference(),
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { ThemeContext };
