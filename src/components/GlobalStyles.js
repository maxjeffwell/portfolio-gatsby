import React from 'react';
import { Global } from '@emotion/react';

const GlobalStyles = () => (
  <Global
    styles={{
      // Base reset and optimization
      '*': {
        boxSizing: 'border-box',
        margin: 0,
        padding: 0,
      },
      'html, body': {
        height: '100%',
        fontFamily: 'AvenirLTStd-Roman, Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
        lineHeight: 1.5,
        fontSize: '16px',
        scrollBehavior: 'smooth',
      },
      body: {
        overflowX: 'hidden',
        backgroundColor: '#f5f5f5',
        color: '#212121',
        '@media (prefers-color-scheme: dark)': {
          backgroundColor: '#0a0a0a',
          color: '#ffffff',
        },
      },
      // Prevent FOUC for gradients
      '[class*="GradientText"], .gradient-text': {
        background: 'linear-gradient(45deg, #fc4a1a, #f7b733) !important',
        backgroundClip: 'text !important',
        WebkitBackgroundClip: 'text !important',
        WebkitTextFillColor: 'transparent !important',
        MozTextFillColor: 'transparent !important',
        color: '#fc4a1a !important', // Fallback color
        '@supports (background-clip: text) or (-webkit-background-clip: text)': {
          color: 'transparent !important',
        },
      },
      // Ensure button styles work consistently
      '[class*="StyledButton"], .styled-button': {
        borderRadius: '30px !important',
        padding: '12px 32px !important',
        fontSize: '1.1rem !important',
        textTransform: 'none !important',
        background: '#7c4dff !important',
        backgroundImage: 'linear-gradient(135deg, #7c4dff 0%, #b388ff 100%) !important',
        color: 'white !important',
        border: 'none !important',
        cursor: 'pointer !important',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important',
        boxShadow: '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12) !important',
        '&:hover': {
          transform: 'translateY(-2px) !important',
          background: '#651fff !important',
          backgroundImage: 'linear-gradient(135deg, #651fff 0%, #9c64ff 100%) !important',
          boxShadow: '0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12) !important',
        },
      },
      // Ensure hero section styles work
      '[class*="HeroSection"], .hero-section': {
        background: 'linear-gradient(135deg, #f3e5f5 0%, #e8eaf6 100%) !important',
        borderRadius: '24px !important',
        padding: '48px 32px !important',
        textAlign: 'center !important',
        position: 'relative !important',
        overflow: 'hidden !important',
        marginBottom: '32px !important',
        boxShadow: '0px 3px 3px -2px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12) !important',
        '@media (max-width: 600px)': {
          padding: '32px 16px !important',
        },
        '@media (max-width: 360px)': {
          padding: '24px 12px !important',
          marginBottom: '24px !important',
          borderRadius: '16px !important',
        },
      },
      // Ensure typing text wrapper styles work
      '[class*="TypingTextWrapper"], .typing-text-wrapper': {
        '& span': {
          background: 'linear-gradient(45deg, #1565c0, #42a5f5) !important',
          backgroundClip: 'text !important',
          WebkitBackgroundClip: 'text !important',
          WebkitTextFillColor: 'transparent !important',
          MozTextFillColor: 'transparent !important',
          color: '#1565c0 !important', // Fallback color
          '@supports (background-clip: text) or (-webkit-background-clip: text)': {
            color: 'transparent !important',
          },
        },
      },
      // Card styles
      '[class*="StyledCard"], .styled-card': {
        backgroundColor: '#ffffff !important',
        borderRadius: '16px !important',
        boxShadow: '0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12) !important',
        overflow: 'hidden !important',
        transition: 'opacity 0.3s ease-out, transform 0.3s ease-out !important',
        '@media (prefers-color-scheme: dark)': {
          backgroundColor: '#1a1a1a !important',
        },
      },
      // Optimize image loading
      '[data-gatsby-image-wrapper]': {
        willChange: 'auto !important',
      },
      '.gatsby-image-wrapper': {
        willChange: 'auto !important',
      },
      // Smooth font loading
      '@font-face': {
        fontFamily: 'AvenirLTStd-Roman',
        fontDisplay: 'swap',
      },
    }}
  />
);

export default GlobalStyles;