/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// Polyfills are handled by webpack configuration in gatsby-node.js
// Just ensure global availability in browser environment
if (typeof window !== 'undefined') {
  window.global = window;
}

import React from 'react';
import { StyleSheetManager } from 'styled-components';
import '@docsearch/css';
import { wrapRootElement as wrap } from './src/wrap-root-element';

// Fix for React 18 ContextRegistry issue
// Apply polyfill as early as possible
(function patchReact() {
  try {
    // Try to patch the imported React
    if (React && React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) {
      if (!React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ContextRegistry) {
        React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ContextRegistry = {};
      }
    }

    // Also patch window.React if it exists
    if (
      typeof window !== 'undefined' &&
      window.React &&
      window.React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
    ) {
      if (!window.React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ContextRegistry) {
        window.React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ContextRegistry = {};
      }
    }
  } catch (e) {
    console.warn('Failed to apply React ContextRegistry polyfill:', e);
  }
})();

export const wrapRootElement = ({ element }) => {
  return <StyleSheetManager>{wrap({ element })}</StyleSheetManager>;
};

// Custom scroll behavior for better UX
export const shouldUpdateScroll = ({ routerProps: { location }, getSavedScrollPosition }) => {
  const { pathname } = location;

  // Scroll to top for new routes
  if (!getSavedScrollPosition(location)) {
    window.scrollTo(0, 0);
  }

  // Always scroll to top for these routes
  if (
    pathname === '/' ||
    pathname === '/projects/' ||
    pathname === '/about/' ||
    pathname === '/contact/'
  ) {
    window.scrollTo(0, 0);
  }

  return false;
};

// Performance optimization for page transitions
export const onRouteUpdate = ({ location }) => {
  // Track page views with our custom analytics (with delay for better performance)
  if (typeof window !== 'undefined' && typeof window.gtag === 'function' && window.dataLayer) {
    // Use requestIdleCallback for better performance
    const trackPageView = () => {
      window.gtag('config', 'G-NL37L9SVQ0', {
        page_path: location.pathname,
        page_title: document.title,
        page_location: window.location.href,
        send_page_view: true,
      });
    };

    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(trackPageView, { timeout: 1000 });
    } else {
      setTimeout(trackPageView, 300);
    }
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
      routesToPreload.forEach((route) => {
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

// Optimize font loading and apply TextEncoder polyfill
export const onInitialClientRender = () => {
  // Apply TextEncoder polyfill immediately when page loads
  let needsPolyfill = false;

  // Check if TextEncoder/TextDecoder need polyfilling
  if (typeof TextEncoder === 'undefined' || typeof TextDecoder === 'undefined') {
    needsPolyfill = true;
  } else {
    // Test if constructors work properly
    try {
      new TextEncoder();
      new TextDecoder();
    } catch (e) {
      needsPolyfill = true;
    }
  }

  if (needsPolyfill) {
    // Apply comprehensive TextEncoder/TextDecoder polyfill
    window.TextEncoder = function TextEncoder() {
      this.encode = function (str) {
        const utf8 = [];
        for (let i = 0; i < str.length; i++) {
          let charcode = str.charCodeAt(i);
          if (charcode < 0x80) utf8.push(charcode);
          else if (charcode < 0x800) {
            utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
          } else if (charcode < 0xd800 || charcode >= 0xe000) {
            utf8.push(
              0xe0 | (charcode >> 12),
              0x80 | ((charcode >> 6) & 0x3f),
              0x80 | (charcode & 0x3f)
            );
          } else {
            i++;
            charcode = 0x10000 + (((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
            utf8.push(
              0xf0 | (charcode >> 18),
              0x80 | ((charcode >> 12) & 0x3f),
              0x80 | ((charcode >> 6) & 0x3f),
              0x80 | (charcode & 0x3f)
            );
          }
        }
        return new Uint8Array(utf8);
      };
    };

    window.TextDecoder = function TextDecoder() {
      this.decode = function (bytes) {
        let str = '';
        let i = 0;
        while (i < bytes.length) {
          const c = bytes[i];
          if (c < 128) {
            str += String.fromCharCode(c);
            i++;
          } else if (c > 191 && c < 224) {
            str += String.fromCharCode(((c & 31) << 6) | (bytes[i + 1] & 63));
            i += 2;
          } else {
            str += String.fromCharCode(
              ((c & 15) << 12) | ((bytes[i + 1] & 63) << 6) | (bytes[i + 2] & 63)
            );
            i += 3;
          }
        }
        return str;
      };
    };

    // Ensure global availability
    global.TextEncoder = window.TextEncoder;
    global.TextDecoder = window.TextDecoder;
  }

  // Remove no-js class if present
  document.documentElement.classList.remove('no-js');

  // Add loaded class for progressive enhancement
  document.documentElement.classList.add('loaded');
};
