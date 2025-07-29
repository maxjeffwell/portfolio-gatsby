import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './context/ThemeContext';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { muiTheme } from './theme';
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

// Wrap the root element with providers
export const wrapRootElement = ({ element }) => (
  <ErrorBoundary>
    <HelmetProvider>
      <StyledThemeProvider theme={muiTheme}>
        <ThemeProvider>
          {typeof window !== 'undefined' && <ClientOnlyPerformanceMonitor />}
          {element}
        </ThemeProvider>
      </StyledThemeProvider>
    </HelmetProvider>
  </ErrorBoundary>
);
