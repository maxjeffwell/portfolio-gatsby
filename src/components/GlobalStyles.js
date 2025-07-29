import React from 'react';
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  /* Base reset and optimization */
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body {
    height: 100%;
    font-family: 'AvenirLTStd-Roman', 'Roboto', -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
    line-height: 1.5;
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    overflow-x: hidden;
    background-color: ${props => props.theme?.colors?.background || '#f5f5f5'};
    color: ${props => props.theme?.colors?.text || '#212121'};
    transition: background-color 0.3s ease, color 0.3s ease;
    
    /* Fallback for system preference when theme isn't available */
    @media (prefers-color-scheme: dark) {
      background-color: ${props => props.theme?.colors?.background || '#0a0a0a'};
      color: ${props => props.theme?.colors?.text || '#ffffff'};
    }
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
    background-color: ${props => props.theme?.colors?.paper || '#ffffff'} !important;
    border-radius: 16px !important;
    box-shadow: 0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12) !important;
    overflow: hidden !important;
    transition: opacity 0.3s ease-out, transform 0.3s ease-out, background-color 0.3s ease !important;
    
    /* Fallback for system preference when theme isn't available */
    @media (prefers-color-scheme: dark) {
      background-color: ${props => props.theme?.colors?.paper || '#1a1a1a'} !important;
    }
  }

  /* Optimize image loading */
  [data-gatsby-image-wrapper] {
    will-change: auto !important;
  }

  .gatsby-image-wrapper {
    will-change: auto !important;
  }

  /* Smooth font loading */
  @font-face {
    font-family: 'AvenirLTStd-Roman';
    font-display: swap;
  }
`;

export default GlobalStyles;