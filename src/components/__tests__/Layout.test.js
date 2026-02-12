import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../../context/ThemeContext';
import Layout from '../layout';
import { mockMatchMedia } from '../../test-utils';

// Mock Gatsby
jest.mock('gatsby', () => ({
  Link: ({ to, children, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  useStaticQuery: jest.fn().mockReturnValue({
    site: {
      siteMetadata: {
        title: 'Jeff Maxwell Developer Portfolio',
        author: 'Jeff Maxwell',
        createdAt: '2019-2025',
      },
    },
  }),
  graphql: jest.fn(),
}));

// Mock ClientOnlyIcon
jest.mock('../ClientOnlyIcon', () => {
  return function MockClientOnlyIcon({ iconName, ...props }) {
    return <span data-testid={`icon-${iconName}`} {...props}>{iconName}</span>;
  };
});

// Mock Header
jest.mock('../header', () => {
  return function MockHeader() {
    return <header data-testid="mock-header">Header</header>;
  };
});

// Mock GlobalStyles
jest.mock('../GlobalStyles', () => {
  return function MockGlobalStyles() {
    return null;
  };
});

// Mock ProtectedEmail
jest.mock('../ProtectedEmail', () => {
  return function MockProtectedEmail({ children, ...props }) {
    return <a data-testid="protected-email" {...props}>{children}</a>;
  };
});

const renderWithTheme = (ui) => {
  return render(
    <ThemeProvider>
      {ui}
    </ThemeProvider>
  );
};

describe('Layout', () => {
  beforeEach(() => {
    window.localStorage.clear();
    jest.clearAllMocks();
    mockMatchMedia(false);

    // Mock matchMedia for desktop detection
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: query === '(pointer: coarse)' ? false : false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
  });

  describe('structure', () => {
    it('renders children content', () => {
      renderWithTheme(
        <Layout>
          <div data-testid="child-content">Page Content</div>
        </Layout>
      );

      expect(screen.getByTestId('child-content')).toBeInTheDocument();
      expect(screen.getByText('Page Content')).toBeInTheDocument();
    });

    it('renders the Header component', () => {
      renderWithTheme(
        <Layout>
          <div>Content</div>
        </Layout>
      );

      expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    });

    it('renders the footer', () => {
      renderWithTheme(
        <Layout>
          <div>Content</div>
        </Layout>
      );

      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });

    it('renders main element with children', () => {
      renderWithTheme(
        <Layout>
          <div>Content</div>
        </Layout>
      );

      expect(screen.getByRole('main')).toBeInTheDocument();
    });
  });

  describe('footer content', () => {
    it('displays author name', () => {
      renderWithTheme(
        <Layout>
          <div>Content</div>
        </Layout>
      );

      expect(screen.getByText('Jeff Maxwell')).toBeInTheDocument();
    });

    it('displays email link', () => {
      renderWithTheme(
        <Layout>
          <div>Content</div>
        </Layout>
      );

      expect(screen.getByTestId('protected-email')).toBeInTheDocument();
      expect(screen.getByText('jeff@el-jefe.me')).toBeInTheDocument();
    });

    it('displays "Built by" text with Gatsby icon', () => {
      renderWithTheme(
        <Layout>
          <div>Content</div>
        </Layout>
      );

      expect(screen.getByText(/Built by Jeff Maxwell, created with/)).toBeInTheDocument();
      expect(screen.getByTestId('icon-Gatsby')).toBeInTheDocument();
    });
  });

  describe('social links', () => {
    it('renders GitHub link', () => {
      renderWithTheme(
        <Layout>
          <div>Content</div>
        </Layout>
      );

      const githubLink = screen.getByLabelText(/GitHub profile/i);
      expect(githubLink).toBeInTheDocument();
      expect(githubLink).toHaveAttribute('href', 'https://github.com/maxjeffwell');
      expect(githubLink).toHaveAttribute('target', '_blank');
      expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('renders Wellfound link', () => {
      renderWithTheme(
        <Layout>
          <div>Content</div>
        </Layout>
      );

      const wellfoundLink = screen.getByLabelText(/wellfound profile/i);
      expect(wellfoundLink).toBeInTheDocument();
      expect(wellfoundLink).toHaveAttribute('href', 'https://wellfound.com/u/maxjeffwell');
    });

    it('renders phone link', () => {
      renderWithTheme(
        <Layout>
          <div>Content</div>
        </Layout>
      );

      const phoneLink = screen.getByLabelText(/Call Jeff Maxwell/i);
      expect(phoneLink).toBeInTheDocument();
      expect(phoneLink).toHaveAttribute('href', 'tel:+01-508-395-2008');
    });

    it('renders social link icons', () => {
      renderWithTheme(
        <Layout>
          <div>Content</div>
        </Layout>
      );

      expect(screen.getByTestId('icon-GitHub')).toBeInTheDocument();
      expect(screen.getByTestId('icon-wellfound')).toBeInTheDocument();
      expect(screen.getByTestId('icon-Phone')).toBeInTheDocument();
    });
  });

  describe('social links navigation', () => {
    it('has navigation landmark for social links', () => {
      renderWithTheme(
        <Layout>
          <div>Content</div>
        </Layout>
      );

      const socialNav = screen.getByLabelText('Social media links');
      expect(socialNav).toBeInTheDocument();
      expect(socialNav.tagName).toBe('NAV');
    });
  });

  describe('accessibility', () => {
    it('has proper footer role', () => {
      renderWithTheme(
        <Layout>
          <div>Content</div>
        </Layout>
      );

      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });

    it('has proper main landmark', () => {
      renderWithTheme(
        <Layout>
          <div>Content</div>
        </Layout>
      );

      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('social links have accessible labels', () => {
      renderWithTheme(
        <Layout>
          <div>Content</div>
        </Layout>
      );

      expect(screen.getByLabelText(/GitHub profile/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/wellfound profile/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Call Jeff Maxwell/i)).toBeInTheDocument();
    });

    it('external links have rel noopener noreferrer', () => {
      renderWithTheme(
        <Layout>
          <div>Content</div>
        </Layout>
      );

      const githubLink = screen.getByLabelText(/GitHub profile/i);
      const wellfoundLink = screen.getByLabelText(/wellfound profile/i);

      expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
      expect(wellfoundLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('multiple children', () => {
    it('renders multiple children correctly', () => {
      renderWithTheme(
        <Layout>
          <div data-testid="child-1">First</div>
          <div data-testid="child-2">Second</div>
          <div data-testid="child-3">Third</div>
        </Layout>
      );

      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
      expect(screen.getByTestId('child-3')).toBeInTheDocument();
    });
  });

  describe('theming', () => {
    it('applies theme to main element', () => {
      renderWithTheme(
        <Layout>
          <div>Content</div>
        </Layout>
      );

      const main = screen.getByRole('main');
      expect(main).toHaveStyle({ backgroundColor: '#f5f5f5' });
    });
  });
});
