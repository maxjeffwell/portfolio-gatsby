/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

import React from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { muiTheme } from './src/theme';
import { wrapRootElement as wrap } from './src/wrap-root-element';

// Error boundary component for SSR
const SSRErrorBoundary = ({ children }) => {
  return children;
};

export const wrapRootElement = ({ element }) => {
  return (
    <StyledThemeProvider theme={muiTheme}>
      <SSRErrorBoundary>
        {wrap({ element })}
      </SSRErrorBoundary>
    </StyledThemeProvider>
  );
};

// Inject theme detection script and handle SSR issues
export const onRenderBody = ({ setPreBodyComponents, setHeadComponents }) => {
  // Mock window and document APIs for SSR to prevent MUI Grid issues
  if (typeof window === 'undefined') {
    // Add TextEncoder/TextDecoder polyfills for SSR environment
    if (typeof global.TextEncoder === 'undefined') {
      const { TextEncoder, TextDecoder } = require('fastestsmallesttextencoderdecoder');
      global.TextEncoder = TextEncoder;
      global.TextDecoder = TextDecoder;
    }
    
    global.window = {
      matchMedia: () => ({
        matches: false,
        addEventListener: () => {},
        removeEventListener: () => {},
      }),
      navigator: { userAgent: 'SSR' },
      document: {
        createElement: () => ({}),
        addEventListener: () => {},
        removeEventListener: () => {},
      },
    };
    
    global.document = {
      createElement: () => ({}),
      addEventListener: () => {},
      removeEventListener: () => {},
      body: {},
      documentElement: { style: {} },
    };
  }

  // styled-components handles SSR automatically, no manual insertion point needed
  const themeScript = `
    (function() {
      try {
        var theme = localStorage.getItem('portfolio-theme');
        var systemPreference = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        var initialTheme = theme || systemPreference;
        
        if (initialTheme === 'dark') {
          document.documentElement.classList.add('dark-mode');
          document.documentElement.classList.remove('light-mode');
        } else {
          document.documentElement.classList.add('light-mode');
          document.documentElement.classList.remove('dark-mode');
        }
        
        // Set theme-color meta tag
        var metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
          metaThemeColor.setAttribute('content', initialTheme === 'dark' ? '#0a0a0a' : '#fc4a1a');
        }
      } catch (e) {
        // Fallback to light theme if any error occurs
        document.documentElement.classList.add('light-mode');
        document.documentElement.classList.remove('dark-mode');
      }
    })();
  `;

  setPreBodyComponents([
    <script
      key="theme-script"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: themeScript,
      }}
    />,
  ]);
};
