/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

import React from 'react';
import { CacheProvider } from '@emotion/react';
import createEmotionCache from '@emotion/cache';
import { wrapRootElement as wrap } from './src/wrap-root-element';

const cache = createEmotionCache({ key: 'mui' });

export const wrapRootElement = ({ element }) => {
  return (
    <CacheProvider value={cache}>
      {wrap({ element })}
    </CacheProvider>
  );
};

// Inject theme detection script to prevent flash of unstyled content
export const onRenderBody = ({ setPreBodyComponents }) => {
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
      dangerouslySetInnerHTML={{
        __html: themeScript,
      }}
    />,
  ]);
};
