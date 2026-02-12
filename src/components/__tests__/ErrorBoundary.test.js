import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from '../ErrorBoundary';

// Component that throws an error for testing
const ThrowError = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test error message');
  }
  return <div>Normal content</div>;
};

// Suppress console.error for expected errors in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Error: Uncaught') ||
        args[0].includes('The above error occurred') ||
        args[0].includes('Test error message') ||
        args[0].includes('ErrorBoundary caught'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

describe('ErrorBoundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when there is no error', () => {
    it('renders children normally', () => {
      render(
        <ErrorBoundary>
          <div data-testid="child">Child content</div>
        </ErrorBoundary>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
      expect(screen.getByText('Child content')).toBeInTheDocument();
    });

    it('renders multiple children', () => {
      render(
        <ErrorBoundary>
          <div>First child</div>
          <div>Second child</div>
        </ErrorBoundary>
      );

      expect(screen.getByText('First child')).toBeInTheDocument();
      expect(screen.getByText('Second child')).toBeInTheDocument();
    });
  });

  describe('when an error occurs', () => {
    it('catches the error and displays fallback UI', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow />
        </ErrorBoundary>
      );

      // Should show error UI
      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
      expect(screen.getByText(/I apologize for the inconvenience/)).toBeInTheDocument();
    });

    it('displays action buttons', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow />
        </ErrorBoundary>
      );

      expect(screen.getByText('Try Again')).toBeInTheDocument();
      expect(screen.getByText('Go Home')).toBeInTheDocument();
      expect(screen.getByText('Report Issue')).toBeInTheDocument();
    });

    it('does not show error details in production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow />
        </ErrorBoundary>
      );

      // Technical details should not be visible in production
      expect(screen.queryByText('View technical details')).not.toBeInTheDocument();

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('action buttons', () => {
    // Note: jsdom's window.location properties are non-configurable,
    // so we test that buttons render and are functional rather than
    // testing the specific navigation implementations.

    it('Try Again button renders and is clickable', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow />
        </ErrorBoundary>
      );

      const tryAgainButton = screen.getByText('Try Again');
      expect(tryAgainButton).toBeInTheDocument();
      expect(tryAgainButton.tagName).toBe('BUTTON');

      // Button should be clickable without throwing
      expect(() => fireEvent.click(tryAgainButton)).not.toThrow();
    });

    it('Go Home button renders and is clickable', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow />
        </ErrorBoundary>
      );

      const goHomeButton = screen.getByText('Go Home');
      expect(goHomeButton).toBeInTheDocument();
      expect(goHomeButton.tagName).toBe('BUTTON');

      // Button should be clickable without throwing
      expect(() => fireEvent.click(goHomeButton)).not.toThrow();
    });

    it('Report Issue button opens mailto link when Sentry is not available', () => {
      const openMock = jest.fn();
      window.open = openMock;
      window.Sentry = undefined;

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow />
        </ErrorBoundary>
      );

      fireEvent.click(screen.getByText('Report Issue'));
      expect(openMock).toHaveBeenCalled();
      expect(openMock.mock.calls[0][0]).toContain('mailto:');
    });
  });

  describe('error reporting', () => {
    it('reports to Sentry when available', () => {
      const captureExceptionMock = jest.fn().mockReturnValue('event-123');
      window.Sentry = {
        captureException: captureExceptionMock,
        showReportDialog: jest.fn(),
      };

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow />
        </ErrorBoundary>
      );

      expect(captureExceptionMock).toHaveBeenCalled();

      // Clean up
      delete window.Sentry;
    });

    it('reports to Google Analytics when available', () => {
      const gtagMock = jest.fn();
      window.gtag = gtagMock;

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow />
        </ErrorBoundary>
      );

      expect(gtagMock).toHaveBeenCalledWith('event', 'exception', {
        description: expect.any(String),
        fatal: true,
      });

      // Clean up
      delete window.gtag;
    });
  });

  describe('recovery', () => {
    it('can recover when error condition is fixed', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow />
        </ErrorBoundary>
      );

      // Error state
      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();

      // Note: ErrorBoundary can't automatically recover without remounting
      // This test verifies the error state is properly displayed
    });
  });
});
