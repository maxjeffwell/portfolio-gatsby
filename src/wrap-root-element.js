import React from 'react';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import '../static/fonts/fonts.css';

// Create emotion cache with proper insertion point
const emotionCache = createCache({ 
  key: 'portfolio',
  insertionPoint: typeof document !== 'undefined' ? document.querySelector('#emotion-insertion-point') || document.head.firstChild : undefined,
  speedy: false // Disable speedy mode for better debugging
});

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
  <CacheProvider value={emotionCache}>
    <ErrorBoundary>
      <HelmetProvider>
        <ThemeProvider>
          <ClientOnlyPerformanceMonitor />
          {element}
        </ThemeProvider>
      </HelmetProvider>
    </ErrorBoundary>
  </CacheProvider>
);
