import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './context/ThemeContext';

// Default light theme for tests
const defaultTheme = {
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

// Dark theme for specific tests
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

/**
 * Custom render function that wraps components with necessary providers
 */
const customRender = (ui, options = {}) => {
  const { theme = defaultTheme, withThemeContext = true, ...renderOptions } = options;

  const Wrapper = ({ children }) => {
    if (withThemeContext) {
      return (
        <HelmetProvider>
          <ThemeProvider>
            <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
          </ThemeProvider>
        </HelmetProvider>
      );
    }
    return (
      <HelmetProvider>
        <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
      </HelmetProvider>
    );
  };

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

/**
 * Render without ThemeContext (for testing ThemeContext itself)
 */
const renderWithoutThemeContext = (ui, options = {}) => {
  const { theme = defaultTheme, ...renderOptions } = options;

  const Wrapper = ({ children }) => (
    <HelmetProvider>
      <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
    </HelmetProvider>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

/**
 * Helper to mock matchMedia for dark mode preference
 */
const mockMatchMedia = (prefersDark = false) => {
  window.matchMedia = jest.fn().mockImplementation((query) => ({
    matches: query === '(prefers-color-scheme: dark)' ? prefersDark : false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
};

/**
 * Helper to mock localStorage with specific values
 */
const mockLocalStorage = (values = {}) => {
  Object.keys(values).forEach((key) => {
    window.localStorage.setItem(key, values[key]);
  });
};

/**
 * Wait for all pending promises
 */
const flushPromises = () =>
  new Promise((resolve) => {
    setTimeout(resolve, 0);
  });

// Re-export everything from testing-library
export * from '@testing-library/react';
export {
  customRender as render,
  renderWithoutThemeContext,
  mockMatchMedia,
  mockLocalStorage,
  flushPromises,
  defaultTheme,
  darkTheme,
};
