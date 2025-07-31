import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

// Simple theme objects without MUI dependencies
const lightTheme = {
  mode: 'light',
  colors: {
    primary: '#1976d2',
    secondary: '#dc004e',
    background: '#f5f5f5',
    paper: '#ffffff',
    text: '#212121',
    textSecondary: '#424242',
  },
};

const darkTheme = {
  mode: 'dark',
  colors: {
    primary: '#90caf9',
    secondary: '#f48fb1',
    background: '#0a0a0a',
    paper: '#1a1a1a',
    text: '#ffffff',
    textSecondary: '#e0e0e0',
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
        isHydrated: false,
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
  if (typeof window !== 'undefined') {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
  return 'light'; // Default to light theme on the server
};

// Get stored preference or system preference
const getInitialTheme = () => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return 'light'; // Default to light theme on the server
  }

  try {
    const stored = localStorage.getItem('portfolio-theme');
    if (stored && (stored === 'light' || stored === 'dark')) {
      return stored;
    }
  } catch (e) {
    // localStorage might not be available
    console.warn('localStorage not available:', e);
  }

  return getSystemPreference();
};

// Theme Provider Component
export function ThemeProvider({ children }) {
  // Initialize with system preference to match SSR
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    return getInitialTheme() === 'dark';
  });
  const [isSystemPreference, setIsSystemPreference] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    const initialTheme = getInitialTheme();
    let hasStoredPreference = false;
    
    try {
      hasStoredPreference = typeof window !== 'undefined' && 
        typeof localStorage !== 'undefined' && 
        localStorage.getItem('portfolio-theme') !== null;
    } catch (e) {
      // localStorage not available
      hasStoredPreference = false;
    }

    // Only update if different from initial state to prevent hydration mismatch
    if ((initialTheme === 'dark') !== isDarkMode) {
      setIsDarkMode(initialTheme === 'dark');
    }
    setIsSystemPreference(!hasStoredPreference);
    setIsHydrated(true);
  }, [isDarkMode]);

  // Listen for system preference changes
  useEffect(() => {
    if (!isSystemPreference || typeof window === 'undefined') return undefined;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e) => {
      if (isSystemPreference) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [isSystemPreference]);

  // Update localStorage and document classes when theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDarkMode ? '#0a0a0a' : '#1976d2');
    }

    // Apply theme classes to document body for CSS variables
    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add(isDarkMode ? 'dark-mode' : 'light-mode');
  }, [isDarkMode]);

  const toggleTheme = useCallback(() => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    setIsSystemPreference(false);

    // Store user preference
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem('portfolio-theme', newMode ? 'dark' : 'light');
      }
    } catch (e) {
      console.warn('Could not save theme preference:', e);
    }
  }, [isDarkMode]);

  const resetToSystemPreference = useCallback(() => {
    setIsSystemPreference(true);
    setIsDarkMode(getSystemPreference() === 'dark');

    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.removeItem('portfolio-theme');
      }
    } catch (e) {
      console.warn('Could not remove theme preference:', e);
    }
  }, []);

  const theme = useMemo(() => (isDarkMode ? darkTheme : lightTheme), [isDarkMode]);

  const value = useMemo(
    () => ({
      theme,
      isDarkMode,
      isSystemPreference,
      isHydrated,
      toggleTheme,
      resetToSystemPreference,
      systemPreference: getSystemPreference(),
    }),
    [theme, isDarkMode, isSystemPreference, isHydrated, toggleTheme, resetToSystemPreference]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { ThemeContext };
