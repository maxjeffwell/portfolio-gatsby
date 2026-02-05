import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '../../context/ThemeContext';
import DarkModeToggle from '../DarkModeToggle';
import { mockMatchMedia, mockLocalStorage } from '../../test-utils';

// Mock ClientOnlyIcon
jest.mock('../ClientOnlyIcon', () => {
  return function MockClientOnlyIcon({ iconName, ...props }) {
    return <span data-testid={`icon-${iconName}`} {...props}>{iconName}</span>;
  };
});

const renderWithTheme = (ui, options = {}) => {
  return render(
    <ThemeProvider>
      {ui}
    </ThemeProvider>,
    options
  );
};

describe('DarkModeToggle', () => {
  beforeEach(() => {
    window.localStorage.clear();
    jest.clearAllMocks();
    mockMatchMedia(false); // Default to light mode
  });

  describe('rendering', () => {
    it('renders the toggle button', () => {
      renderWithTheme(<DarkModeToggle />);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('renders the DarkModeToggle icon', () => {
      renderWithTheme(<DarkModeToggle />);

      expect(screen.getByTestId('icon-DarkModeToggle')).toBeInTheDocument();
    });

    it('has correct aria-label for light mode', async () => {
      renderWithTheme(<DarkModeToggle />);

      // Wait for hydration
      await screen.findByRole('button');

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
    });

    it('has correct aria-label for dark mode', async () => {
      mockLocalStorage({ 'portfolio-theme': 'dark' });

      renderWithTheme(<DarkModeToggle />);

      // Wait for hydration and dark mode to be applied
      await new Promise(resolve => setTimeout(resolve, 50));

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
    });
  });

  describe('click behavior', () => {
    it('toggles theme on click', async () => {
      renderWithTheme(<DarkModeToggle />);

      const button = screen.getByRole('button');

      // Initially light mode - aria-label should mention switching to dark
      expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');

      // Click to toggle
      fireEvent.click(button);

      // After click, should switch to dark - aria-label should mention switching to light
      await new Promise(resolve => setTimeout(resolve, 50));
      expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
    });

    it('saves preference to localStorage on click', async () => {
      renderWithTheme(<DarkModeToggle />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(window.localStorage.setItem).toHaveBeenCalledWith('portfolio-theme', 'dark');
    });
  });

  describe('right-click menu', () => {
    it('opens menu on right-click', async () => {
      renderWithTheme(<DarkModeToggle />);

      const button = screen.getByRole('button');
      fireEvent.contextMenu(button);

      // Menu should appear
      expect(screen.getByText(/Switch to .* mode/)).toBeInTheDocument();
      expect(screen.getByText('Follow system preference')).toBeInTheDocument();
    });

    it('shows correct toggle option in menu for light mode', async () => {
      renderWithTheme(<DarkModeToggle />);

      const button = screen.getByRole('button');
      fireEvent.contextMenu(button);

      expect(screen.getByText('Switch to dark mode')).toBeInTheDocument();
    });

    it('shows correct toggle option in menu for dark mode', async () => {
      mockLocalStorage({ 'portfolio-theme': 'dark' });

      renderWithTheme(<DarkModeToggle />);

      // Wait for hydration
      await new Promise(resolve => setTimeout(resolve, 50));

      const button = screen.getByRole('button');
      fireEvent.contextMenu(button);

      expect(screen.getByText('Switch to light mode')).toBeInTheDocument();
    });

    it('toggles theme when clicking menu toggle option', async () => {
      renderWithTheme(<DarkModeToggle />);

      const button = screen.getByRole('button');
      fireEvent.contextMenu(button);

      const toggleMenuItem = screen.getByText('Switch to dark mode');
      fireEvent.click(toggleMenuItem);

      expect(window.localStorage.setItem).toHaveBeenCalledWith('portfolio-theme', 'dark');
    });

    it('resets to system preference when clicking that option', async () => {
      mockLocalStorage({ 'portfolio-theme': 'dark' });

      renderWithTheme(<DarkModeToggle />);

      // Wait for hydration
      await new Promise(resolve => setTimeout(resolve, 50));

      const button = screen.getByRole('button');
      fireEvent.contextMenu(button);

      const systemMenuItem = screen.getByText('Follow system preference');
      fireEvent.click(systemMenuItem);

      expect(window.localStorage.removeItem).toHaveBeenCalledWith('portfolio-theme');
    });

    it('closes menu after clicking an option', async () => {
      renderWithTheme(<DarkModeToggle />);

      const button = screen.getByRole('button');
      fireEvent.contextMenu(button);

      // Menu is open
      expect(screen.getByText('Follow system preference')).toBeInTheDocument();

      // Click an option
      const toggleMenuItem = screen.getByText('Switch to dark mode');
      fireEvent.click(toggleMenuItem);

      // Menu should close - the menu text should no longer be visible
      // Note: The menu is conditionally rendered, so it should be gone
      await new Promise(resolve => setTimeout(resolve, 50));
      expect(screen.queryByText('Follow system preference')).not.toBeInTheDocument();
    });
  });

  describe('tooltip', () => {
    it('has tooltip with correct text for light mode', () => {
      renderWithTheme(<DarkModeToggle />);

      const tooltip = screen.getByRole('button').closest('[data-tooltip]');
      expect(tooltip).toHaveAttribute('data-tooltip', 'Switch to dark mode');
    });

    it('has tooltip with correct text for dark mode', async () => {
      mockLocalStorage({ 'portfolio-theme': 'dark' });

      renderWithTheme(<DarkModeToggle />);

      await new Promise(resolve => setTimeout(resolve, 50));

      const tooltip = screen.getByRole('button').closest('[data-tooltip]');
      expect(tooltip).toHaveAttribute('data-tooltip', 'Switch to light mode');
    });
  });
});
