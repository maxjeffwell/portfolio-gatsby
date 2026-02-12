import React from 'react';
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  /* CSS Variables for theme colors - prevents FOUC */
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
    --accent-pink: #e91e63;
    --accent-purple: #9c27b0;
    --primary-hover: #1565c0;
    --primary-subtle-bg: rgba(25, 118, 210, 0.1);
    --outline-border: rgba(0, 0, 0, 0.23);
    --usage-bar-track: #e0e0e0;
    --card-border: #e0e0e0;
    --stat-label: rgba(0, 0, 0, 0.5);
  }

  /* Dark mode CSS variables - applied by theme script before JS loads */
  .dark-mode {
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
    --accent-pink: #f48fb1;
    --accent-purple: #ce93d8;
    --primary-hover: #64b5f6;
    --primary-subtle-bg: rgba(144, 202, 249, 0.15);
    --outline-border: rgba(255, 255, 255, 0.23);
    --usage-bar-track: #333;
    --card-border: #333;
    --stat-label: rgba(255, 255, 255, 0.5);
  }

  /* Light mode CSS variables - applied by theme script before JS loads */
  .light-mode {
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
    --accent-pink: #e91e63;
    --accent-purple: #9c27b0;
    --primary-hover: #1565c0;
    --primary-subtle-bg: rgba(25, 118, 210, 0.1);
    --outline-border: rgba(0, 0, 0, 0.23);
    --usage-bar-track: #e0e0e0;
    --card-border: #e0e0e0;
    --stat-label: rgba(0, 0, 0, 0.5);
  }

  /* Base reset and optimization */
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body {
    height: 100%;
    width: 100%;
    max-width: 100vw;
    font-family: 'AvenirLTStd-Roman', 'AvenirFallback', 'HelveticaNeueLTStd-Roman', 'HelveticaNeueRomanFallback', -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
    line-height: 1.6;
    font-size: 16px;
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  body {
    overflow-x: hidden;
    background-color: var(--bg-color);
    color: var(--text-color);
  }

  /* Ensure all container elements respect viewport width */
  #___gatsby, #gatsby-focus-wrapper {
    max-width: 100vw;
    overflow-x: hidden;
  }

  /* Optimize image loading */
  [data-gatsby-image-wrapper] {
    will-change: auto !important;
  }

  .gatsby-image-wrapper {
    will-change: auto !important;
  }

  /* Typography styles to match design */
  h1, h2, h3, h4, h5, h6 {
    font-family: 'HelveticaNeueLTStd-Bd', 'HelveticaNeueBdFallback', 'AvenirLTStd-Roman', 'AvenirFallback', sans-serif;
    font-weight: bold;
    line-height: 1.2;
    letter-spacing: -0.02em;
    color: var(--text-color);
  }

  h1 {
    font-size: clamp(2.5rem, 8vw, 4rem) !important;
    font-weight: 700;
  }

  /* Ensure h1 in sectioning elements maintains consistent size */
  article h1,
  aside h1,
  nav h1,
  section h1 {
    font-size: clamp(2.5rem, 8vw, 4rem) !important;
  }

  h2 {
    font-size: clamp(2rem, 6vw, 3rem);
    font-weight: 700;
  }

  h3 {
    font-size: clamp(1.5rem, 4vw, 2.25rem);
    font-weight: 600;
  }

  h4 {
    font-size: clamp(1.25rem, 3vw, 1.75rem);
    font-weight: 600;
  }

  h5 {
    font-size: clamp(1.125rem, 2.5vw, 1.5rem);
    font-weight: 500;
  }

  h6 {
    font-size: clamp(1rem, 2vw, 1.25rem);
    font-weight: 500;
  }

  /* Code blocks */
  code, pre {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'Courier New', monospace;
    font-size: 0.875rem;
    line-height: 1.5;
  }

  pre {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 16px;
    overflow-x: auto;

    .dark-mode & {
      background-color: #2d3748;
    }
  }

  /* Body text with better readability */
  p {
    font-family: 'AvenirLTStd-Roman', 'AvenirFallback', 'HelveticaNeueLTStd-Roman', 'HelveticaNeueRomanFallback', sans-serif;
    line-height: 1.7;
    margin-bottom: 1rem;
    color: var(--text-color);
  }

  /* Secondary text styles */
  .text-secondary {
    color: var(--text-secondary-color);
  }

  /* Footer styles to prevent FOUC */
  footer {
    background-color: var(--paper-color) !important;
    padding: 48px 0 !important;
    border-top: 3px solid #9c27b0 !important;
    
    @media (max-width: 600px) {
      padding: 40px 0 !important;
    }
  }

  /* Footer typography to prevent FOUC */
  footer h2 {
    font-size: clamp(1.75rem, 4vw, 2rem) !important;
    font-weight: 400 !important;
    margin-bottom: 12px !important;
    color: var(--text-color) !important;
  }

  footer a[href^="mailto"] {
    font-size: clamp(1.125rem, 3vw, 1.25rem) !important;
    color: #e91e63 !important;
    display: inline-block !important;
    margin-bottom: 32px !important;
    text-decoration: underline !important;
    text-decoration-color: #e91e63 !important;
  }

  /* Footer social icons */
  footer button {
    padding: 16px !important;
    
    @media (max-width: 600px) {
      padding: 20px !important;
    }
  }

  footer svg {
    font-size: clamp(1.75rem, 4vw, 2rem) !important;
  }

  /* Footer bottom text */
  footer p:last-child {
    font-size: clamp(0.9rem, 2.5vw, 1rem) !important;
    font-weight: 400 !important;
  }

  /* Link styles */
  a {
    color: var(--primary-color);
    text-decoration: underline;
    text-decoration-color: currentColor;
    text-decoration-thickness: 1px;
    text-underline-offset: 2px;
    cursor: pointer;

    &:hover {
      opacity: 0.85;
    }

    &:visited {
      color: #7b1fa2;
    }

    .dark-mode &:visited {
      color: #ce93d8;
    }
  }

  /* Theme transitions - only during user-initiated theme toggle */
  html.theme-transitioning body,
  html.theme-transitioning main,
  html.theme-transitioning header,
  html.theme-transitioning footer {
    transition: background-color 0.3s ease, color 0.3s ease !important;
  }

  html.theme-transitioning h1,
  html.theme-transitioning h2,
  html.theme-transitioning h3,
  html.theme-transitioning h4,
  html.theme-transitioning h5,
  html.theme-transitioning h6,
  html.theme-transitioning p,
  html.theme-transitioning a,
  html.theme-transitioning .text-secondary {
    transition: color 0.3s ease !important;
  }

  html.theme-transitioning article {
    transition: opacity 0.3s ease-out, transform 0.3s ease-out, background-color 0.3s ease !important;
  }

  /* DocSearch theme overrides */
  :root {
    --docsearch-primary-color: var(--primary-color);
    --docsearch-text-color: var(--text-color);
    --docsearch-muted-color: var(--text-secondary-color);
    --docsearch-container-background: rgba(0, 0, 0, 0.5);
  }

  .dark-mode {
    --docsearch-text-color: #f5f5f5;
    --docsearch-container-background: rgba(0, 0, 0, 0.7);
    --docsearch-modal-background: #1a1a1a;
    --docsearch-searchbox-background: #2a2a2a;
    --docsearch-searchbox-focus-background: #333;
    --docsearch-hit-background: #2a2a2a;
    --docsearch-hit-color: #f5f5f5;
    --docsearch-hit-active-color: #fff;
    --docsearch-highlight-color: var(--primary-color);
    --docsearch-footer-background: #1a1a1a;
    --docsearch-footer-shadow: 0 -1px 0 rgba(255, 255, 255, 0.1);
    --docsearch-key-gradient: linear-gradient(-225deg, #444, #333);
    --docsearch-key-shadow: inset 0 -2px 0 0 #222, inset 0 0 1px 1px #555, 0 1px 2px 1px rgba(0, 0, 0, 0.3);
  }

  /* DocSearch button styling to match nav */
  .DocSearch-Button {
    border-radius: 10px !important;
    font-family: inherit !important;
    margin: 0 !important;
  }

  /* Ensure modal renders above header */
  .DocSearch-Container {
    z-index: 1400 !important;
  }

`;

export default GlobalStyles;
