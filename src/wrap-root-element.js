import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
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
    <ThemeProvider>
      <ClientOnlyPerformanceMonitor />
      {element}
    </ThemeProvider>
  </ErrorBoundary>
);
