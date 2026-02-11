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
  }

  /* Dark mode CSS variables - applied by theme script before JS loads */
  .dark-mode {
    --bg-color: #0a0a0a;
    --text-color: #ffffff;
    --paper-color: #1a1a1a;
    --primary-color: #90caf9;
    --secondary-color: #f48fb1;
    --text-secondary-color: rgba(255, 255, 255, 0.7);
  }

  /* Light mode CSS variables - applied by theme script before JS loads */
  .light-mode {
    --bg-color: #f5f5f5;
    --text-color: #212121;
    --paper-color: #ffffff;
    --primary-color: #1976d2;
    --secondary-color: #dc004e;
    --text-secondary-color: rgba(0, 0, 0, 0.6);
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
    font-family: 'AvenirLTStd-Roman', 'HelveticaNeueLTStd-Roman', -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
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
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  /* Ensure all container elements respect viewport width */
  #___gatsby, #gatsby-focus-wrapper {
    max-width: 100vw;
    overflow-x: hidden;
  }

  /* Prevent FOUC for gradients */
  [class*="GradientText"], .gradient-text {
    background: linear-gradient(45deg, #fc4a1a, #f7b733) !important;
    background-clip: text !important;
    -webkit-background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
    -moz-text-fill-color: transparent !important;
    color: #fc4a1a !important; /* Fallback color */
    
    @supports (background-clip: text) or (-webkit-background-clip: text) {
      color: transparent !important;
    }
  }

  /* Ensure button styles work consistently */
  [class*="StyledButton"], .styled-button {
    border-radius: 30px !important;
    padding: 12px 32px !important;
    font-size: 1.1rem !important;
    text-transform: none !important;
    background: #7c4dff !important;
    background-image: linear-gradient(135deg, #7c4dff 0%, #b388ff 100%) !important;
    color: white !important;
    border: none !important;
    cursor: pointer !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12) !important;
    
    &:hover {
      transform: translateY(-2px) !important;
      background: #651fff !important;
      background-image: linear-gradient(135deg, #651fff 0%, #9c64ff 100%) !important;
      box-shadow: 0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12) !important;
    }
  }

  /* Ensure hero section styles work */
  [class*="HeroSection"], .hero-section {
    background: linear-gradient(135deg, #f3e5f5 0%, #e8eaf6 100%) !important;
    border-radius: 24px !important;
    padding: 48px 32px !important;
    text-align: center !important;
    position: relative !important;
    overflow: hidden !important;
    margin-bottom: 32px !important;
    box-shadow: 0px 3px 3px -2px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12) !important;
    
    @media (max-width: 600px) {
      padding: 32px 16px !important;
    }
    
    @media (max-width: 360px) {
      padding: 24px 12px !important;
      margin-bottom: 24px !important;
      border-radius: 16px !important;
    }
  }

  /* Ensure typing text wrapper styles work */
  [class*="TypingTextWrapper"], .typing-text-wrapper {
    & span {
      background: linear-gradient(45deg, #1565c0, #42a5f5) !important;
      background-clip: text !important;
      -webkit-background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
      -moz-text-fill-color: transparent !important;
      color: #1565c0 !important; /* Fallback color */
      
      @supports (background-clip: text) or (-webkit-background-clip: text) {
        color: transparent !important;
      }
    }
  }

  /* Card styles */
  [class*="StyledCard"], .styled-card {
    background-color: var(--paper-color) !important;
    border-radius: 16px !important;
    box-shadow: 0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12) !important;
    overflow: hidden !important;
    transition: opacity 0.3s ease-out, transform 0.3s ease-out, background-color 0.3s ease !important;
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
    font-family: 'HelveticaNeueLTStd-Bd', 'AvenirLTStd-Roman', sans-serif;
    font-weight: bold;
    line-height: 1.2;
    letter-spacing: -0.02em;
    color: var(--text-color);
    transition: color 0.3s ease;
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
    
    @media (prefers-color-scheme: dark) {
      background-color: #2d3748;
    }
  }

  /* Body text with better readability */
  p {
    font-family: 'AvenirLTStd-Roman', 'HelveticaNeueLTStd-Roman', sans-serif;
    line-height: 1.7;
    margin-bottom: 1rem;
    color: var(--text-color);
    transition: color 0.3s ease;
  }

  /* Secondary text styles */
  .text-secondary {
    color: var(--text-secondary-color);
    transition: color 0.3s ease;
  }

  /* Footer styles to prevent FOUC */
  footer {
    background-color: var(--paper-color) !important;
    padding: 48px 0 !important;
    border-top: 3px solid #9c27b0 !important;
    transition: background-color 0.3s ease !important;
    
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
    color: #1565c0;
    text-decoration: underline;
    text-decoration-color: currentColor;
    text-decoration-thickness: 1px;
    text-underline-offset: 2px;
    cursor: pointer;
    transition: color 0.3s ease, text-decoration-color 0.3s ease;

    &:hover {
      color: #0d47a1;
    }

    &:visited {
      color: #7b1fa2;
    }

    @media (prefers-color-scheme: dark) {
      color: #90caf9;

      &:hover {
        color: #64b5f6;
      }

      &:visited {
        color: #ce93d8;
      }
    }
  }

`;

export default GlobalStyles;
