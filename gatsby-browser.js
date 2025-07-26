/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

import React from 'react';
import { CacheProvider } from '@emotion/react';
import createEmotionCache from '@emotion/cache';
import { wrapRootElement as wrap } from './src/wrap-root-element';

// Fix for React 18 ContextRegistry issue
if (typeof window !== 'undefined' && React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) {
  if (!React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ContextRegistry) {
    React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ContextRegistry = {};
  }
}

const cache = createEmotionCache({ key: 'mui' });

export const wrapRootElement = ({ element }) => {
  return (
    <CacheProvider value={cache}>
      {wrap({ element })}
    </CacheProvider>
  );
};

// Custom scroll behavior for better UX
export const shouldUpdateScroll = ({ routerProps: { location }, getSavedScrollPosition }) => {
  const { pathname } = location;
  
  // Scroll to top for new routes
  if (!getSavedScrollPosition(location)) {
    window.scrollTo(0, 0);
  }
  
  // Always scroll to top for these routes
  if (pathname === '/' || pathname === '/projects/' || pathname === '/about/' || pathname === '/contact/') {
    window.scrollTo(0, 0);
  }
  
  return false;
};

// Performance optimization for page transitions
export const onRouteUpdate = ({ location, prevLocation }) => {
  // Track page views in analytics
  if (typeof gtag !== 'undefined') {
    gtag('config', 'GA_MEASUREMENT_ID', {
      page_path: location.pathname,
    });
  }
  
  // Preload next likely routes based on current page
  if (typeof window !== 'undefined') {
    const preloadRoutes = {
      '/': ['/projects/', '/about/'],
      '/projects/': ['/contact/', '/'],
      '/about/': ['/projects/', '/contact/'],
      '/contact/': ['/projects/', '/'],
    };
    
    const routesToPreload = preloadRoutes[location.pathname];
    if (routesToPreload) {
      routesToPreload.forEach(route => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = route;
        document.head.appendChild(link);
      });
    }
  }
};

// Service Worker registration handling
export const onServiceWorkerUpdateReady = () => {
  const answer = window.confirm(
    'This application has been updated. Reload to display the latest version?'
  );
  
  if (answer === true) {
    window.location.reload();
  }
};

// Optimize font loading
export const onInitialClientRender = () => {
  // Remove no-js class if present
  document.documentElement.classList.remove('no-js');
  
  // Add loaded class for progressive enhancement
  document.documentElement.classList.add('loaded');
  
  // Optimize font loading with font-display: swap fallback
  if ('fontDisplay' in document.documentElement.style) {
    const fontFaces = [
      'AvenirLTStd-Roman',
      'HelveticaNeueLTStd-Bd', 
      'HelveticaNeueLTStd-Roman',
      'SabonLTStd-Roman'
    ];
    
    fontFaces.forEach(fontFamily => {
      if (document.fonts && document.fonts.load) {
        document.fonts.load(`1em ${fontFamily}`).catch(() => {
          // Font loading failed - fallback fonts will be used
          console.log(`Failed to load font: ${fontFamily}`);
        });
      }
    });
  }
};
