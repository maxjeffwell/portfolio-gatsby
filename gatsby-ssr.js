/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

// Node.js polyfills for SSR environment (Gatsby 5 compatible)
if (typeof global !== 'undefined') {
  // Only add polyfills if they don't already exist
  if (!global.Buffer) {
    global.Buffer = require('buffer').Buffer;
  }
  if (!global.process) {
    global.process = require('process/browser');
  }
  if (!global.TextEncoder) {
    const { TextEncoder, TextDecoder } = require('fastestsmallesttextencoderdecoder');
    global.TextEncoder = TextEncoder;
    global.TextDecoder = TextDecoder;
  }
}

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
    <SSRErrorBoundary>
      {wrap({ element })}
    </SSRErrorBoundary>
  );
};

// Inject theme detection script and handle SSR issues
export const onRenderBody = ({ setPreBodyComponents, setHeadComponents }) => {
  // Add TextEncoder polyfill script before any other scripts
  setHeadComponents([
    <script
      key="textencoder-polyfill"
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            if (typeof window === 'undefined') return;
            
            var needsPolyfill = false;
            
            if (typeof TextEncoder === 'undefined' || typeof TextDecoder === 'undefined') {
              needsPolyfill = true;
            } else {
              try {
                new TextEncoder();
                new TextDecoder();
              } catch (e) {
                needsPolyfill = true;
              }
            }
            
            if (needsPolyfill) {
              window.TextEncoder = function TextEncoder() {
                this.encode = function(str) {
                  var utf8 = [];
                  for (var i = 0; i < str.length; i++) {
                    var charcode = str.charCodeAt(i);
                    if (charcode < 0x80) utf8.push(charcode);
                    else if (charcode < 0x800) {
                      utf8.push(0xc0 | (charcode >> 6), 
                                0x80 | (charcode & 0x3f));
                    }
                    else if (charcode < 0xd800 || charcode >= 0xe000) {
                      utf8.push(0xe0 | (charcode >> 12), 
                                0x80 | ((charcode>>6) & 0x3f), 
                                0x80 | (charcode & 0x3f));
                    }
                    else {
                      i++;
                      charcode = 0x10000 + (((charcode & 0x3ff)<<10)
                                | (str.charCodeAt(i) & 0x3ff));
                      utf8.push(0xf0 | (charcode >>18), 
                                0x80 | ((charcode>>12) & 0x3f), 
                                0x80 | ((charcode>>6) & 0x3f), 
                                0x80 | (charcode & 0x3f));
                    }
                  }
                  return new Uint8Array(utf8);
                };
              };
              
              window.TextDecoder = function TextDecoder() {
                this.decode = function(bytes) {
                  var str = '';
                  var i = 0;
                  while (i < bytes.length) {
                    var c = bytes[i];
                    if (c < 128) {
                      str += String.fromCharCode(c);
                      i++;
                    } else if (c > 191 && c < 224) {
                      str += String.fromCharCode(((c & 31) << 6) | (bytes[i + 1] & 63));
                      i += 2;
                    } else {
                      str += String.fromCharCode(((c & 15) << 12) | ((bytes[i + 1] & 63) << 6) | (bytes[i + 2] & 63));
                      i += 3;
                    }
                  }
                  return str;
                };
              };
              
              if (typeof global !== 'undefined') {
                global.TextEncoder = window.TextEncoder;
                global.TextDecoder = window.TextDecoder;
              }
            }
          })();
        `,
      }}
    />,
  ]);
  // Mock window and document APIs for SSR to prevent issues
  if (typeof window === 'undefined') {
    // Ensure polyfills are available (already set at top of file)
    if (!global.TextEncoder) {
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
        // Only run on client-side
        if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
        
        var theme = localStorage.getItem('portfolio-theme');
        var systemPreference = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        var initialTheme = theme || systemPreference;
        var root = document.documentElement;
        
        if (initialTheme === 'dark') {
          root.classList.add('dark-mode');
          root.classList.remove('light-mode');
          // Set CSS variables immediately
          root.style.setProperty('--bg-color', '#0a0a0a');
          root.style.setProperty('--text-color', '#ffffff');
          root.style.setProperty('--paper-color', '#1a1a1a');
          root.style.setProperty('--primary-color', '#90caf9');
          root.style.setProperty('--secondary-color', '#f48fb1');
          root.style.setProperty('--text-secondary-color', 'rgba(255, 255, 255, 0.7)');
        } else {
          root.classList.add('light-mode');
          root.classList.remove('dark-mode');
          // Set CSS variables immediately
          root.style.setProperty('--bg-color', '#f5f5f5');
          root.style.setProperty('--text-color', '#212121');
          root.style.setProperty('--paper-color', '#ffffff');
          root.style.setProperty('--primary-color', '#1976d2');
          root.style.setProperty('--secondary-color', '#dc004e');
          root.style.setProperty('--text-secondary-color', 'rgba(0, 0, 0, 0.6)');
        }
        
        // Body styles are handled by CSS variables in stylesheet
        
        // Set theme-color meta tag
        var metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
          metaThemeColor.setAttribute('content', initialTheme === 'dark' ? '#0a0a0a' : '#1976d2');
        }
      } catch (e) {
        // Fallback to light theme if any error occurs
        var root = document.documentElement;
        root.classList.add('light-mode');
        root.classList.remove('dark-mode');
        root.style.setProperty('--bg-color', '#f5f5f5');
        root.style.setProperty('--text-color', '#212121');
        root.style.setProperty('--paper-color', '#ffffff');
        root.style.setProperty('--primary-color', '#1976d2');
        root.style.setProperty('--secondary-color', '#dc004e');
        root.style.setProperty('--text-secondary-color', 'rgba(0, 0, 0, 0.6)');
        // Body styles are handled by CSS variables in stylesheet
      }
    })();
  `;

  setPreBodyComponents([
    <style
      key="initial-theme-styles"
      dangerouslySetInnerHTML={{
        __html: `
          /* Prevent FOUC by setting initial styles */
          :root {
            --bg-color: #f5f5f5;
            --text-color: #212121;
            --paper-color: #ffffff;
            --primary-color: #1976d2;
            --secondary-color: #dc004e;
            --text-secondary-color: rgba(0, 0, 0, 0.6);
          }
          
          @media (prefers-color-scheme: dark) {
            :root {
              --bg-color: #0a0a0a;
              --text-color: #ffffff;
              --paper-color: #1a1a1a;
              --primary-color: #90caf9;
              --secondary-color: #f48fb1;
              --text-secondary-color: rgba(255, 255, 255, 0.7);
            }
          }
          
          body {
            background-color: var(--bg-color);
            color: var(--text-color);
            transition: background-color 0.3s ease, color 0.3s ease;
          }
          
          h1, h2, h3, h4, h5, h6 {
            color: var(--text-color);
          }
        `,
      }}
    />,
    <script
      key="theme-script"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: themeScript,
      }}
    />,
  ]);
};
