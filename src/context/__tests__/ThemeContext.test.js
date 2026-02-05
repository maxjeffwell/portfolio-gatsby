import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../ThemeContext';
import { mockMatchMedia, mockLocalStorage } from '../../test-utils';

describe('ThemeContext', () => {
  beforeEach(() => {
    // Clear localStorage and mocks before each test
    window.localStorage.clear();
    jest.clearAllMocks();

    // Default to light mode system preference
    mockMatchMedia(false);
  });

  describe('ThemeProvider', () => {
    it('provides default light theme on initial render', () => {
      const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;
      const { result } = renderHook(() => useTheme(), { wrapper });

      // During SSR/initial render, should be light theme
      expect(result.current.isDarkMode).toBe(false);
      expect(result.current.theme.mode).toBe('light');
    });

    it('hydrates theme from localStorage when "dark" is stored', async () => {
      // Set up localStorage before rendering
      mockLocalStorage({ 'portfolio-theme': 'dark' });

      const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;
      const { result } = renderHook(() => useTheme(), { wrapper });

      // Wait for hydration effect
      await waitFor(() => {
        expect(result.current.isHydrated).toBe(true);
      });

      expect(result.current.isDarkMode).toBe(true);
      expect(result.current.theme.mode).toBe('dark');
      expect(result.current.isSystemPreference).toBe(false);
    });

    it('respects system dark mode preference when no localStorage value', async () => {
      // Mock system preference as dark
      mockMatchMedia(true);

      const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;
      const { result } = renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(result.current.isHydrated).toBe(true);
      });

      expect(result.current.isDarkMode).toBe(true);
      expect(result.current.isSystemPreference).toBe(true);
    });

    it('localStorage preference overrides system preference', async () => {
      // System prefers dark, but localStorage says light
      mockMatchMedia(true);
      mockLocalStorage({ 'portfolio-theme': 'light' });

      const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;
      const { result } = renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(result.current.isHydrated).toBe(true);
      });

      // Should follow localStorage, not system
      expect(result.current.isDarkMode).toBe(false);
      expect(result.current.isSystemPreference).toBe(false);
    });
  });

  describe('toggleTheme', () => {
    it('toggles from light to dark mode', async () => {
      const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;
      const { result } = renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(result.current.isHydrated).toBe(true);
      });

      // Initially light mode
      expect(result.current.isDarkMode).toBe(false);

      // Toggle to dark mode
      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.isDarkMode).toBe(true);
      expect(result.current.theme.mode).toBe('dark');
      expect(result.current.isSystemPreference).toBe(false);
      expect(window.localStorage.setItem).toHaveBeenCalledWith('portfolio-theme', 'dark');
    });

    it('toggles from dark to light mode', async () => {
      mockLocalStorage({ 'portfolio-theme': 'dark' });

      const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;
      const { result } = renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(result.current.isHydrated).toBe(true);
      });

      expect(result.current.isDarkMode).toBe(true);

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.isDarkMode).toBe(false);
      expect(result.current.theme.mode).toBe('light');
      expect(window.localStorage.setItem).toHaveBeenCalledWith('portfolio-theme', 'light');
    });
  });

  describe('resetToSystemPreference', () => {
    it('resets to system preference and clears localStorage', async () => {
      mockLocalStorage({ 'portfolio-theme': 'dark' });
      mockMatchMedia(false); // System prefers light

      const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;
      const { result } = renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(result.current.isHydrated).toBe(true);
      });

      // Currently dark from localStorage
      expect(result.current.isDarkMode).toBe(true);
      expect(result.current.isSystemPreference).toBe(false);

      act(() => {
        result.current.resetToSystemPreference();
      });

      // Should now follow system (light)
      expect(result.current.isDarkMode).toBe(false);
      expect(result.current.isSystemPreference).toBe(true);
      expect(window.localStorage.removeItem).toHaveBeenCalledWith('portfolio-theme');
    });

    it('follows system dark preference after reset', async () => {
      mockLocalStorage({ 'portfolio-theme': 'light' });
      mockMatchMedia(true); // System prefers dark

      const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;
      const { result } = renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(result.current.isHydrated).toBe(true);
      });

      // Currently light from localStorage
      expect(result.current.isDarkMode).toBe(false);

      act(() => {
        result.current.resetToSystemPreference();
      });

      // Should now follow system (dark)
      expect(result.current.isDarkMode).toBe(true);
      expect(result.current.isSystemPreference).toBe(true);
    });
  });

  describe('theme object structure', () => {
    it('provides correct light theme colors', async () => {
      const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;
      const { result } = renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(result.current.isHydrated).toBe(true);
      });

      expect(result.current.theme.colors).toEqual({
        primary: '#1976d2',
        secondary: '#dc004e',
        background: '#f5f5f5',
        paper: '#ffffff',
        text: '#212121',
        textSecondary: '#424242',
      });
    });

    it('provides correct dark theme colors', async () => {
      mockLocalStorage({ 'portfolio-theme': 'dark' });

      const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;
      const { result } = renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(result.current.isHydrated).toBe(true);
      });

      expect(result.current.theme.colors).toEqual({
        primary: '#90caf9',
        secondary: '#f48fb1',
        background: '#0a0a0a',
        paper: '#1a1a1a',
        text: '#ffffff',
        textSecondary: '#e0e0e0',
      });
    });
  });

  describe('context values', () => {
    it('provides all expected context values', async () => {
      const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;
      const { result } = renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(result.current.isHydrated).toBe(true);
      });

      // Check all expected properties exist
      expect(result.current).toHaveProperty('theme');
      expect(result.current).toHaveProperty('isDarkMode');
      expect(result.current).toHaveProperty('isSystemPreference');
      expect(result.current).toHaveProperty('isHydrated');
      expect(result.current).toHaveProperty('toggleTheme');
      expect(result.current).toHaveProperty('resetToSystemPreference');
      expect(result.current).toHaveProperty('systemPreference');

      // Check functions are callable
      expect(typeof result.current.toggleTheme).toBe('function');
      expect(typeof result.current.resetToSystemPreference).toBe('function');
    });
  });
});
