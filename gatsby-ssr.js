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
    <StyledThemeProvider theme={muiTheme}>
      <SSRErrorBoundary>
        {wrap({ element })}
      </SSRErrorBoundary>
    </StyledThemeProvider>
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
