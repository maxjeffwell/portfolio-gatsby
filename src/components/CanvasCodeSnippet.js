import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';

// Simple icon components using text/Unicode
const CopyIcon = styled.span`
  font-size: 20px;
  &::before {
    content: '📋';
  }
`;

const CheckIcon = styled.span`
  font-size: 20px;
  &::before {
    content: '✓';
  }
`;

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background-color: #f5f5f5;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);

  @media (prefers-color-scheme: dark) {
    background-color: #424242;
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  }
`;

const StyledTypography = styled.div`
  margin: 0;
  font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
  font-weight: ${(props) => props.fontWeight || 400};
  font-size: ${(props) => {
    switch (props.variant) {
      case 'h1':
        return '2.125rem';
      case 'h2':
        return '1.5rem';
      case 'h3':
        return '1.25rem';
      case 'h4':
        return '1.125rem';
      case 'h5':
        return '1rem';
      case 'h6':
        return '0.875rem';
      case 'subtitle1':
        return '1rem';
      case 'subtitle2':
        return '0.875rem';
      case 'body1':
        return '1rem';
      case 'body2':
        return '0.875rem';
      case 'caption':
        return '0.75rem';
      default:
        return '1rem';
    }
  }};
  line-height: ${(props) => {
    switch (props.variant) {
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        return '1.2';
      default:
        return '1.43';
    }
  }};
  color: ${(props) => {
    if (props.color === 'primary') return '#1976d2';
    if (props.color === 'secondary') return '#dc004e';
    if (props.color === 'text.secondary') return 'rgba(0, 0, 0, 0.6)';
    return 'inherit';
  }};
  margin-bottom: ${(props) => (props.gutterBottom ? '0.35em' : '0')};

  @media (prefers-color-scheme: dark) {
    color: ${(props) => {
      if (props.color === 'primary') return '#90caf9';
      if (props.color === 'secondary') return '#f48fb1';
      if (props.color === 'text.secondary') return 'rgba(255, 255, 255, 0.7)';
      return 'inherit';
    }};
  }
`;

const StyledIconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-sizing: border-box;
  background-color: transparent;
  outline: 0;
  border: 0;
  margin: 0;
  border-radius: 8px;
  padding: ${(props) => (props.size === 'small' ? '4px' : '8px')};
  cursor: pointer;
  user-select: none;
  vertical-align: middle;
  text-decoration: none;
  color: rgba(0, 0, 0, 0.54);
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  border: 1px solid;

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }

  @media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.7);

    &:hover {
      background-color: rgba(255, 255, 255, 0.08);
    }
  }
`;

const StyledTooltip = styled.div`
  position: relative;
  display: inline-block;
`;

const StyledPaper = styled.div`
  border-radius: 16px;
  overflow: hidden;
  margin: 16px 0;
  background-color: #ffffff;
  color: rgba(0, 0, 0, 0.87);
  transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  box-shadow:
    0px 2px 1px -1px rgba(0, 0, 0, 0.2),
    0px 1px 1px 0px rgba(0, 0, 0, 0.14),
    0px 1px 3px 0px rgba(0, 0, 0, 0.12);

  @media (prefers-color-scheme: dark) {
    background-color: #424242;
    color: rgba(255, 255, 255, 0.87);
  }
`;

const CanvasContainer = styled.div`
  padding: 16px;
  background-color: #f8f9fa;
  color: #2d3748;
`;

const StyledCanvas = styled.canvas`
  display: block;
  background: transparent;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'Courier New', monospace;
`;

const FallbackPre = styled.pre`
  margin: 0;
  padding: 16px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'Courier New', monospace;
  font-size: 0.875rem;
  line-height: 1.6;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
  background-color: #f8f9fa;
  color: #2d3748;
  border: none;
`;

const CanvasCodeSnippetInner = React.memo(
  ({
    code,
    title = 'Code Example',
    animated = false,
    animationSpeed = 30,
    showCopyButton = true,
    fontSize = 14,
    lineHeight = 1.6,
  }) => {
    const { theme } = useTheme();
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const animationRef = useRef(null);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

    // Always show animation without intersection observer
    const isInView = true;
    const [copied, setCopied] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Animation state
    const stateRef = useRef({
      displayedCode: '',
      charIndex: 0,
    });

    // Handle client-side mounting
    useEffect(() => {
      setIsMounted(true);
    }, []);

    // Calculate canvas size based on code content
    useEffect(() => {
      if (!isMounted || !code || typeof window === 'undefined') return;

      // Create temporary canvas to measure text
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      tempCtx.font = `${fontSize}px Monaco, Menlo, 'Ubuntu Mono', Consolas, 'Courier New', monospace`;

      // Split code into lines and measure
      const lines = code.split('\n');
      let maxWidth = 0;

      lines.forEach((line) => {
        const metrics = tempCtx.measureText(line || ' '); // Use space for empty lines
        maxWidth = Math.max(maxWidth, metrics.width);
      });

      // Calculate dimensions with padding
      const padding = 16;
      const width = Math.ceil(maxWidth + padding * 2);
      const height = Math.ceil(lines.length * fontSize * lineHeight + padding * 2);

      setCanvasSize({ width, height });
    }, [code, fontSize, lineHeight, isMounted]);

    // Handle copy functionality
    const handleCopy = async () => {
      if (typeof window === 'undefined') return;

      try {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Failed to copy code:', err);
        }
      }
    };

    // Main animation loop
    useEffect(() => {
      if (!isMounted || !canvasSize.width || !code || typeof window === 'undefined') return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      const state = stateRef.current;

      // Set canvas properties
      canvas.width = canvasSize.width;
      canvas.height = canvasSize.height;

      // Configure text rendering
      ctx.font = `${fontSize}px Monaco, Menlo, 'Ubuntu Mono', Consolas, 'Courier New', monospace`;
      ctx.textBaseline = 'top';
      ctx.textAlign = 'left';

      // Use theme context for dark mode detection
      const isDark = theme?.mode === 'dark';
      ctx.fillStyle = isDark ? '#e2e8f0' : '#2d3748';

      // Animation state tracking
      let startTime = null;
      let animationComplete = false;

      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!animated) {
          // Show full code immediately if not animated
          state.displayedCode = code;
          animationComplete = true;
        } else if (isInView) {
          // Calculate how many characters to show based on time elapsed
          const elapsed = currentTime - startTime;
          const charactersToShow = Math.floor(elapsed / animationSpeed);
          const newCharIndex = Math.min(charactersToShow, code.length);

          // Only update if we have more characters to show
          if (newCharIndex > state.charIndex) {
            state.charIndex = newCharIndex;
            state.displayedCode = code.slice(0, state.charIndex);
          }

          // Mark as complete when we've shown all characters
          if (state.charIndex >= code.length) {
            animationComplete = true;
          }
        }

        // Render text line by line
        const lines = state.displayedCode.split('\n');
        const padding = 16;

        lines.forEach((line, index) => {
          const y = padding + index * fontSize * lineHeight;
          ctx.fillText(line, padding, y);
        });

        // Continue animation if needed
        if (animated && !animationComplete && isInView) {
          animationRef.current = requestAnimationFrame(animate);
        } else if (!animated || animationComplete) {
          // Render final state once more to ensure everything is shown
          state.displayedCode = code;
          const finalLines = state.displayedCode.split('\n');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          finalLines.forEach((line, index) => {
            const y = padding + index * fontSize * lineHeight;
            ctx.fillText(line, padding, y);
          });
        }
      };

      // Reset animation state when starting
      if (animated) {
        state.charIndex = 0;
        state.displayedCode = '';
        startTime = null;
        animationComplete = false;
      } else {
        // If not animated, show everything immediately
        state.displayedCode = code;
        animationComplete = true;
      }

      // Start animation
      animationRef.current = requestAnimationFrame(animate);

      // Cleanup
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, [
      code,
      animated,
      animationSpeed,
      fontSize,
      lineHeight,
      canvasSize,
      isMounted,
      isInView,
      theme,
    ]);

    // Restart animation when component comes into view
    useEffect(() => {
      if (animated && isInView && isMounted && canvasSize.width) {
        // Reset animation state to restart
        const state = stateRef.current;
        state.charIndex = 0;
        state.displayedCode = '';
      }
    }, [isInView, animated, isMounted, canvasSize.width]);

    if (!code) {
      return (
        <StyledPaper style={{ padding: 16, backgroundColor: '#d32f2f', color: 'white' }}>
          <StyledTypography>ERROR: No code provided to CodeSnippet</StyledTypography>
        </StyledPaper>
      );
    }

    // Show fallback during SSR or before canvas is ready
    if (!isMounted || !canvasSize.width || typeof window === 'undefined') {
      return (
        <StyledPaper>
          <StyledHeader>
            <StyledTypography
              variant="caption"
              style={{
                fontFamily: 'Courier New, monospace',
                fontWeight: 'bold',
              }}
            >
              {title}
            </StyledTypography>
            {showCopyButton && typeof window !== 'undefined' && (
              <StyledTooltip title={copied ? 'Copied!' : 'Copy code'}>
                <StyledIconButton
                  size="small"
                  onClick={handleCopy}
                  aria-label={copied ? 'Code copied to clipboard' : 'Copy code to clipboard'}
                  style={{
                    color: '#dc004e',
                    borderColor: '#dc004e',
                  }}
                >
                  {copied ? <CheckIcon /> : <CopyIcon />}
                </StyledIconButton>
              </StyledTooltip>
            )}
          </StyledHeader>
          <FallbackPre
            style={{
              backgroundColor: theme?.mode === 'dark' ? '#1a202c' : '#f8f9fa',
              color: theme?.mode === 'dark' ? '#ffffff' : '#2d3748',
            }}
          >
            {code}
          </FallbackPre>
        </StyledPaper>
      );
    }

    return (
      <StyledPaper ref={containerRef}>
        <StyledHeader>
          <StyledTypography
            variant="caption"
            style={{
              fontFamily: 'Courier New, monospace',
              fontWeight: 'bold',
            }}
          >
            {title}
          </StyledTypography>
          {showCopyButton && (
            <StyledTooltip title={copied ? 'Copied!' : 'Copy code'}>
              <StyledIconButton
                size="small"
                onClick={handleCopy}
                aria-label={copied ? 'Code copied to clipboard' : 'Copy code to clipboard'}
                style={{
                  color: '#dc004e',
                  borderColor: '#dc004e',
                }}
              >
                {copied ? <CheckIcon /> : <CopyIcon />}
              </StyledIconButton>
            </StyledTooltip>
          )}
        </StyledHeader>
        <CanvasContainer
          style={{
            backgroundColor: theme?.mode === 'dark' ? '#1a202c' : '#f8f9fa',
            color: theme?.mode === 'dark' ? '#ffffff' : '#2d3748',
          }}
        >
          <StyledCanvas
            ref={canvasRef}
            style={{
              width: `${canvasSize.width}px`,
              height: `${canvasSize.height}px`,
            }}
          />
        </CanvasContainer>
      </StyledPaper>
    );
  }
);

CanvasCodeSnippetInner.displayName = 'CanvasCodeSnippetInner';

// Client-side only wrapper to handle SSR properly
const CanvasCodeSnippet = (props) => {
  const { theme } = useTheme();
  const [isClient, setIsClient] = React.useState(false);
  const [useCanvas, setUseCanvas] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);

    // Test canvas support
    try {
      const testCanvas = document.createElement('canvas');
      const testCtx = testCanvas.getContext('2d');
      if (testCtx && typeof testCtx.fillText === 'function') {
        setUseCanvas(true);
      }
    } catch (error) {
      console.warn('Canvas not supported, using fallback:', error);
      setUseCanvas(false);
    }
  }, []);

  // Always render the fallback during SSR or if canvas isn't supported
  if (!isClient || !useCanvas) {
    return (
      <StyledPaper>
        <StyledHeader>
          <StyledTypography
            variant="caption"
            style={{
              fontFamily: 'Courier New, monospace',
              fontWeight: 'bold',
            }}
          >
            {props.title || 'Code Example'}
          </StyledTypography>
          {props.showCopyButton !== false && isClient && (
            <StyledTooltip>
              <StyledIconButton
                size="small"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(props.code);
                  } catch (err) {
                    console.warn('Copy failed:', err);
                  }
                }}
                aria-label="Copy code to clipboard"
                style={{
                  color: '#dc004e',
                  borderColor: '#dc004e',
                }}
              >
                <CopyIcon />
              </StyledIconButton>
            </StyledTooltip>
          )}
        </StyledHeader>
        <FallbackPre
          style={{
            backgroundColor: theme?.mode === 'dark' ? '#1a202c' : '#f8f9fa',
            color: theme?.mode === 'dark' ? '#ffffff' : '#2d3748',
          }}
        >
          {props.code}
        </FallbackPre>
      </StyledPaper>
    );
  }

  return <CanvasCodeSnippetInner {...props} />;
};

CanvasCodeSnippet.displayName = 'CanvasCodeSnippet';

CanvasCodeSnippet.propTypes = {
  code: PropTypes.string.isRequired,
  title: PropTypes.string,
  animated: PropTypes.bool,
  animationSpeed: PropTypes.number,
  showCopyButton: PropTypes.bool,
  fontSize: PropTypes.number,
  lineHeight: PropTypes.number,
};

export default CanvasCodeSnippet;
