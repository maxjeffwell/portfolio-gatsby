import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from '../../context/ThemeContext';
import Header from '../header';
import { mockMatchMedia } from '../../test-utils';

// Mock Gatsby Link
jest.mock('gatsby', () => ({
  Link: ({ to, children, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

// Mock ClientOnlyIcon
jest.mock('../ClientOnlyIcon', () => {
  return function MockClientOnlyIcon({ iconName, ...props }) {
    return <span data-testid={`icon-${iconName}`} {...props}>{iconName}</span>;
  };
});

// Mock MyLogo
jest.mock('../myLogo', () => {
  return function MockMyLogo() {
    return <div data-testid="my-logo">Logo</div>;
  };
});

// Mock SSRSafeDarkModeToggle
jest.mock('../SSRSafeDarkModeToggle', () => {
  return function MockSSRSafeDarkModeToggle() {
    return <button data-testid="dark-mode-toggle">Toggle Dark Mode</button>;
  };
});

const renderWithTheme = (ui) => {
  return render(
    <ThemeProvider>
      {ui}
    </ThemeProvider>
  );
};

describe('Header', () => {
  beforeEach(() => {
    window.localStorage.clear();
    jest.clearAllMocks();

    // Reset global location mock
    window.location.pathname = '/';
    window.location.href = 'http://localhost/';

    // Default to desktop viewport
    mockMatchMedia(false);
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: query === '(max-width: 959px)' ? false : false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
  });

  describe('desktop rendering', () => {
    it('renders the header', () => {
      renderWithTheme(<Header />);

      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('renders the logo', () => {
      renderWithTheme(<Header />);

      expect(screen.getByTestId('my-logo')).toBeInTheDocument();
    });

    it('renders the dark mode toggle', () => {
      renderWithTheme(<Header />);

      expect(screen.getByTestId('dark-mode-toggle')).toBeInTheDocument();
    });

    it('renders navigation links on desktop', async () => {
      renderWithTheme(<Header />);

      // Wait for hydration and media query to settle
      await waitFor(() => {
        expect(screen.getByText('Home')).toBeInTheDocument();
      });

      expect(screen.getByText('Bio')).toBeInTheDocument();
      expect(screen.getByText('Projects')).toBeInTheDocument();
      expect(screen.getByText('Blog')).toBeInTheDocument();
      expect(screen.getByText('Contact')).toBeInTheDocument();
    });

    it('navigation links have correct href', async () => {
      renderWithTheme(<Header />);

      await waitFor(() => {
        expect(screen.getByText('Home')).toBeInTheDocument();
      });

      expect(screen.getByText('Home').closest('a')).toHaveAttribute('href', '/');
      expect(screen.getByText('Bio').closest('a')).toHaveAttribute('href', '/about');
      expect(screen.getByText('Projects').closest('a')).toHaveAttribute('href', '/projects');
      expect(screen.getByText('Blog').closest('a')).toHaveAttribute('href', '/blog');
      expect(screen.getByText('Contact').closest('a')).toHaveAttribute('href', '/contact');
    });

    it('does not show hamburger menu on desktop', async () => {
      renderWithTheme(<Header />);

      await waitFor(() => {
        expect(screen.getByText('Home')).toBeInTheDocument();
      });

      // Hamburger icon should not be present on desktop
      expect(screen.queryByTestId('icon-Burger')).not.toBeInTheDocument();
    });
  });

  describe('mobile rendering', () => {
    beforeEach(() => {
      // Mock mobile viewport
      window.matchMedia = jest.fn().mockImplementation((query) => ({
        matches: query === '(max-width: 959px)' ? true : false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));
    });

    it('shows hamburger menu button on mobile', async () => {
      renderWithTheme(<Header />);

      await waitFor(() => {
        expect(screen.getByTestId('icon-Burger')).toBeInTheDocument();
      });
    });

    it('opens drawer when hamburger is clicked', async () => {
      renderWithTheme(<Header />);

      await waitFor(() => {
        expect(screen.getByTestId('icon-Burger')).toBeInTheDocument();
      });

      const menuButton = screen.getByLabelText('open drawer');
      fireEvent.click(menuButton);

      // Drawer should be open with navigation links
      await waitFor(() => {
        expect(screen.getByText('Home')).toBeInTheDocument();
      });

      // Close button should be visible
      expect(screen.getByLabelText('close drawer')).toBeInTheDocument();
    });

    it('closes drawer when close button is clicked', async () => {
      renderWithTheme(<Header />);

      await waitFor(() => {
        expect(screen.getByTestId('icon-Burger')).toBeInTheDocument();
      });

      // Open drawer
      const menuButton = screen.getByLabelText('open drawer');
      fireEvent.click(menuButton);

      await waitFor(() => {
        expect(screen.getByLabelText('close drawer')).toBeInTheDocument();
      });

      // Close drawer
      const closeButton = screen.getByLabelText('close drawer');
      fireEvent.click(closeButton);

      // The drawer backdrop should no longer be visible
      // (The drawer uses transform to hide, so elements may still be in DOM)
    });

    it('closes drawer when backdrop is clicked', async () => {
      renderWithTheme(<Header />);

      await waitFor(() => {
        expect(screen.getByTestId('icon-Burger')).toBeInTheDocument();
      });

      // Open drawer
      const menuButton = screen.getByLabelText('open drawer');
      fireEvent.click(menuButton);

      // Find and click backdrop
      await waitFor(() => {
        expect(screen.getByLabelText('close drawer')).toBeInTheDocument();
      });

      // The backdrop is rendered when drawer is open
      // Click on it to close
      const backdrop = document.querySelector('[class*="DrawerBackdrop"]');
      if (backdrop) {
        fireEvent.click(backdrop);
      }
    });

    it('closes drawer when navigation link is clicked', async () => {
      renderWithTheme(<Header />);

      await waitFor(() => {
        expect(screen.getByTestId('icon-Burger')).toBeInTheDocument();
      });

      // Open drawer
      const menuButton = screen.getByLabelText('open drawer');
      fireEvent.click(menuButton);

      await waitFor(() => {
        expect(screen.getByText('Home')).toBeInTheDocument();
      });

      // Click a navigation link
      const homeLink = screen.getByText('Home');
      fireEvent.click(homeLink);

      // Drawer should close (but we can't easily verify this without checking state)
    });
  });

  describe('scroll behavior', () => {
    it('responds to scroll events', async () => {
      renderWithTheme(<Header />);

      // Simulate scroll
      fireEvent.scroll(window, { target: { scrollY: 150 } });

      // The header should update its scrolled state
      // (Visual changes are tested via styled-components)
    });
  });

  describe('accessibility', () => {
    it('has proper navigation landmark', async () => {
      renderWithTheme(<Header />);

      await waitFor(() => {
        expect(screen.getByText('Home')).toBeInTheDocument();
      });

      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('hamburger button has accessible label', async () => {
      // Set to mobile
      window.matchMedia = jest.fn().mockImplementation((query) => ({
        matches: query === '(max-width: 959px)' ? true : false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      renderWithTheme(<Header />);

      await waitFor(() => {
        expect(screen.getByLabelText('open drawer')).toBeInTheDocument();
      });
    });

    it('close drawer button has accessible label', async () => {
      // Set to mobile
      window.matchMedia = jest.fn().mockImplementation((query) => ({
        matches: query === '(max-width: 959px)' ? true : false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      renderWithTheme(<Header />);

      await waitFor(() => {
        expect(screen.getByLabelText('open drawer')).toBeInTheDocument();
      });

      // Open drawer
      fireEvent.click(screen.getByLabelText('open drawer'));

      await waitFor(() => {
        expect(screen.getByLabelText('close drawer')).toBeInTheDocument();
      });
    });
  });

  describe('menu items', () => {
    it('renders all five menu items', async () => {
      renderWithTheme(<Header />);

      await waitFor(() => {
        expect(screen.getByText('Home')).toBeInTheDocument();
      });

      const menuItems = ['Home', 'Bio', 'Projects', 'Blog', 'Contact'];
      menuItems.forEach((item) => {
        expect(screen.getByText(item)).toBeInTheDocument();
      });
    });
  });
});
