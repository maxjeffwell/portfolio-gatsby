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
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';
import { wrapRootElement as wrap } from './src/wrap-root-element';

// styled-components SSR: collect styles during render
const sheetByPathname = new Map();

export const wrapRootElement = ({ element, pathname }) => {
  const sheet = new ServerStyleSheet();
  sheetByPathname.set(pathname, sheet);

  return <StyleSheetManager sheet={sheet.instance}>{wrap({ element })}</StyleSheetManager>;
};

// Inject theme detection script and handle SSR issues
export const onRenderBody = ({ setPreBodyComponents, setHeadComponents, pathname }) => {
  // Extract collected styled-components CSS and inject into <head>
  const sheet = sheetByPathname.get(pathname);
  if (sheet) {
    const styleElements = sheet.getStyleElement();
    if (styleElements && styleElements.length > 0) {
      setHeadComponents(styleElements);
    }
    sheetByPathname.delete(pathname);
  }

  // Add TextEncoder polyfill script before any other scripts
  setHeadComponents([
    <link
      key="preload-font-avenir"
      rel="preload"
      href="/fonts/AvenirLTStd-Roman.woff2"
      as="font"
      type="font/woff2"
      crossOrigin="anonymous"
    />,
    <link
      key="preload-font-helvetica-bd"
      rel="preload"
      href="/fonts/HelveticaNeueLTStd-Bd.woff2"
      as="font"
      type="font/woff2"
      crossOrigin="anonymous"
    />,
    <link
      key="preload-font-helvetica-roman"
      rel="preload"
      href="/fonts/HelveticaNeueLTStd-Roman.woff2"
      as="font"
      type="font/woff2"
      crossOrigin="anonymous"
    />,
    <style
      key="fonts-inline"
      dangerouslySetInnerHTML={{
        __html: `
          @font-face{font-family:'HelveticaNeueLTStd-Bd';font-style:normal;font-weight:bold;src:url('/fonts/HelveticaNeueLTStd-Bd.woff2') format('woff2'),url('/fonts/HelveticaNeueLTStd-Bd.woff') format('woff');font-display:optional}
          @font-face{font-family:'HelveticaNeueLTStd-Roman';font-style:normal;font-weight:normal;src:url('/fonts/HelveticaNeueLTStd-Roman.woff2') format('woff2'),url('/fonts/HelveticaNeueLTStd-Roman.woff') format('woff');font-display:optional}
          @font-face{font-family:'AvenirLTStd-Roman';font-style:normal;font-weight:normal;src:url('/fonts/AvenirLTStd-Roman.woff2') format('woff2'),url('/fonts/AvenirLTStd-Roman.woff') format('woff');font-display:optional}
          @font-face{font-family:'SabonLTStd-Roman';font-style:normal;font-weight:normal;src:url('/fonts/SabonLTStd-Roman.woff2') format('woff2'),url('/fonts/SabonLTStd-Roman.woff') format('woff');font-display:optional}
          @font-face{font-family:'AvenirFallback';src:local('Arial'),local('Liberation Sans'),local('Helvetica Neue'),local('Helvetica');size-adjust:92.0%;ascent-override:82.2%;descent-override:26.5%;line-gap-override:21.7%}
          @font-face{font-family:'HelveticaNeueBdFallback';src:local('Arial'),local('Liberation Sans'),local('Helvetica Neue'),local('Helvetica');font-weight:bold;size-adjust:94.9%;ascent-override:75.2%;descent-override:30.1%;line-gap-override:21.1%}
          @font-face{font-family:'HelveticaNeueRomanFallback';src:local('Arial'),local('Liberation Sans'),local('Helvetica Neue'),local('Helvetica');size-adjust:90.9%;ascent-override:78.5%;descent-override:31.5%;line-gap-override:22.0%}
        `,
      }}
    />,
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
          root.style.setProperty('--bg-color', '#0a0a0a');
          root.style.setProperty('--text-color', '#ffffff');
          root.style.setProperty('--paper-color', '#1a1a1a');
          root.style.setProperty('--primary-color', '#90caf9');
          root.style.setProperty('--secondary-color', '#f48fb1');
          root.style.setProperty('--text-secondary-color', 'rgba(255, 255, 255, 0.7)');
          root.style.setProperty('--text-muted-color', 'rgba(255, 255, 255, 0.5)');
          root.style.setProperty('--border-color', 'rgba(255, 255, 255, 0.1)');
          root.style.setProperty('--tag-bg', 'rgba(255, 255, 255, 0.08)');
          root.style.setProperty('--hover-bg', 'rgba(255, 255, 255, 0.08)');
          root.style.setProperty('--icon-color', 'rgba(255, 255, 255, 0.7)');
          root.style.setProperty('--footer-bg', '#0a0a0a');
          root.style.setProperty('--nav-bg', 'rgba(255, 255, 255, 0.08)');
          root.style.setProperty('--nav-hover-bg', 'rgba(255, 255, 255, 0.12)');
          root.style.setProperty('--nav-active-text', '#000000');
          root.style.setProperty('--divider-subtle', 'rgba(255, 255, 255, 0.1)');
          root.style.setProperty('--secondary-nav-bg', 'rgba(255, 255, 255, 0.03)');
          root.style.setProperty('--secondary-nav-border', 'rgba(255, 255, 255, 0.06)');
          root.style.setProperty('--mobile-nav-label', '#888');
        } else {
          root.classList.add('light-mode');
          root.classList.remove('dark-mode');
          root.style.setProperty('--bg-color', '#f5f5f5');
          root.style.setProperty('--text-color', '#212121');
          root.style.setProperty('--paper-color', '#ffffff');
          root.style.setProperty('--primary-color', '#1976d2');
          root.style.setProperty('--secondary-color', '#dc004e');
          root.style.setProperty('--text-secondary-color', 'rgba(0, 0, 0, 0.6)');
          root.style.setProperty('--text-muted-color', 'rgba(0, 0, 0, 0.45)');
          root.style.setProperty('--border-color', 'rgba(0, 0, 0, 0.1)');
          root.style.setProperty('--tag-bg', 'rgba(0, 0, 0, 0.06)');
          root.style.setProperty('--hover-bg', 'rgba(0, 0, 0, 0.04)');
          root.style.setProperty('--icon-color', 'rgba(0, 0, 0, 0.54)');
          root.style.setProperty('--footer-bg', '#fafafa');
          root.style.setProperty('--nav-bg', '#e8eaf6');
          root.style.setProperty('--nav-hover-bg', '#c5cae9');
          root.style.setProperty('--nav-active-text', '#ffffff');
          root.style.setProperty('--divider-subtle', 'rgba(0, 0, 0, 0.08)');
          root.style.setProperty('--secondary-nav-bg', 'rgba(0, 0, 0, 0.02)');
          root.style.setProperty('--secondary-nav-border', 'rgba(0, 0, 0, 0.06)');
          root.style.setProperty('--mobile-nav-label', '#999');
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
            --text-muted-color: rgba(0, 0, 0, 0.45);
            --border-color: rgba(0, 0, 0, 0.1);
            --tag-bg: rgba(0, 0, 0, 0.06);
            --hover-bg: rgba(0, 0, 0, 0.04);
            --icon-color: rgba(0, 0, 0, 0.54);
            --footer-bg: #fafafa;
            --nav-bg: #e8eaf6;
            --nav-hover-bg: #c5cae9;
            --nav-active-text: #ffffff;
            --divider-subtle: rgba(0, 0, 0, 0.08);
            --secondary-nav-bg: rgba(0, 0, 0, 0.02);
            --secondary-nav-border: rgba(0, 0, 0, 0.06);
            --mobile-nav-label: #999;
          }

          @media (prefers-color-scheme: dark) {
            :root {
              --bg-color: #0a0a0a;
              --text-color: #ffffff;
              --paper-color: #1a1a1a;
              --primary-color: #90caf9;
              --secondary-color: #f48fb1;
              --text-secondary-color: rgba(255, 255, 255, 0.7);
              --text-muted-color: rgba(255, 255, 255, 0.5);
              --border-color: rgba(255, 255, 255, 0.1);
              --tag-bg: rgba(255, 255, 255, 0.08);
              --hover-bg: rgba(255, 255, 255, 0.08);
              --icon-color: rgba(255, 255, 255, 0.7);
              --footer-bg: #0a0a0a;
              --nav-bg: rgba(255, 255, 255, 0.08);
              --nav-hover-bg: rgba(255, 255, 255, 0.12);
              --nav-active-text: #000000;
              --divider-subtle: rgba(255, 255, 255, 0.1);
              --secondary-nav-bg: rgba(255, 255, 255, 0.03);
              --secondary-nav-border: rgba(255, 255, 255, 0.06);
              --mobile-nav-label: #888;
            }
          }
          
          body {
            background-color: var(--bg-color);
            color: var(--text-color);
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
