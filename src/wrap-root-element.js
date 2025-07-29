import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import ErrorBoundary from './components/ErrorBoundary';
import '../static/fonts/fonts.css';


// Client-only PerformanceMonitor wrapper
const ClientOnlyPerformanceMonitor = () => {
  const [PerformanceMonitor, setPerformanceMonitor] = React.useState(null);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
    // Only import and render PerformanceMonitor on the client
    import('./components/PerformanceMonitor')
      .then((module) => {
        setPerformanceMonitor(() => module.default);
      })
      .catch(() => {
        // Ignore errors if PerformanceMonitor doesn't exist
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.log('PerformanceMonitor component not found');
        }
      });
  }, []);

  if (!isClient) return null;

  return PerformanceMonitor ? React.createElement(PerformanceMonitor) : null;
};

// Theme-connected wrapper
const ThemedWrapper = ({ children }) => {
  const { theme } = useTheme();
  
  return (
    <StyledThemeProvider theme={theme}>
      {typeof window !== 'undefined' && <ClientOnlyPerformanceMonitor />}
      {children}
    </StyledThemeProvider>
  );
};

// Wrap the root element with providers
export const wrapRootElement = ({ element }) => (
  <ErrorBoundary>
    <HelmetProvider>
      <ThemeProvider>
        <ThemedWrapper>
          {element}
        </ThemedWrapper>
      </ThemeProvider>
    </HelmetProvider>
  </ErrorBoundary>
);
