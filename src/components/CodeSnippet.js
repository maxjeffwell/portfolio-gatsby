import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ClientOnlyIcon from './ClientOnlyIcon';

// Simple icon components using text/Unicode

const CheckIcon = styled.span`
  font-size: 20px;
  &::before {
    content: '✓';
  }
`;

const StyledPre = styled.pre`
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
  
  @media (prefers-color-scheme: dark) {
    background-color: #2d3748;
    color: #e2e8f0;
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
  font-weight: ${props => props.fontWeight || 400};
  font-size: ${props => {
    switch(props.variant) {
      case 'h1': return '2.125rem';
      case 'h2': return '1.5rem';
      case 'h3': return '1.25rem';
      case 'h4': return '1.125rem';
      case 'h5': return '1rem';
      case 'h6': return '0.875rem';
      case 'subtitle1': return '1rem';
      case 'subtitle2': return '0.875rem';
      case 'body1': return '1rem';
      case 'body2': return '0.875rem';
      case 'caption': return '0.75rem';
      default: return '1rem';
    }
  }};
  line-height: ${props => {
    switch(props.variant) {
      case 'h1': 
      case 'h2': 
      case 'h3': 
      case 'h4': 
      case 'h5': 
      case 'h6': return '1.2';
      default: return '1.43';
    }
  }};
  color: ${props => {
    if (props.color === 'primary') return '#1976d2';
    if (props.color === 'secondary') return '#dc004e';
    if (props.color === 'text.secondary') return 'rgba(0, 0, 0, 0.6)';
    return 'inherit';
  }};
  margin-bottom: ${props => props.gutterBottom ? '0.35em' : '0'};
  
  @media (prefers-color-scheme: dark) {
    color: ${props => {
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
  padding: ${props => props.size === 'small' ? '4px' : '8px'};
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
  box-shadow: 0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12);
  
  @media (prefers-color-scheme: dark) {
    background-color: #424242;
    color: rgba(255, 255, 255, 0.87);
  }
`;

function CodeSnippet({
  code,
  title = 'Code Example',
  animated = false,
  animationSpeed = 30,
  showCopyButton = true,
}) {
  const [displayedCode, setDisplayedCode] = useState(animated ? '' : code);
  const [copied, setCopied] = useState(false);
  const [, setAnimationComplete] = useState(!animated);

  useEffect(() => {
    if (!animated) {
      setDisplayedCode(code);
      setAnimationComplete(true);
      return undefined;
    }

    // Reset state when animation starts
    setDisplayedCode('');
    setAnimationComplete(false);
    
    let index = 0;
    let timeoutId;
    
    const animateText = () => {
      if (index < code.length) {
        setDisplayedCode(code.slice(0, index + 1));
        index += 1;
        timeoutId = setTimeout(animateText, animationSpeed);
      } else {
        setAnimationComplete(true);
      }
    };

    // Start animation after a brief delay to ensure component is mounted
    timeoutId = setTimeout(animateText, 100);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [code, animated, animationSpeed]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error('Failed to copy code:', err);
      }
    }
  };

  if (!code) {
    return (
      <StyledPaper style={{ padding: 16, backgroundColor: '#d32f2f', color: 'white' }}>
        <StyledTypography>ERROR: No code provided to CodeSnippet</StyledTypography>
      </StyledPaper>
    );
  }

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
              {copied ? <CheckIcon /> : <ClientOnlyIcon iconName="SourceCode" style={{ fontSize: '20px' }} />}
            </StyledIconButton>
          </StyledTooltip>
        )}
      </StyledHeader>
      <StyledPre>{displayedCode}</StyledPre>
    </StyledPaper>
  );
}

CodeSnippet.propTypes = {
  code: PropTypes.string.isRequired,
  title: PropTypes.string,
  animated: PropTypes.bool,
  animationSpeed: PropTypes.number,
  showCopyButton: PropTypes.bool,
};

CodeSnippet.defaultProps = {
  title: 'Code Example',
  animated: false,
  animationSpeed: 30,
  showCopyButton: true,
};

export default CodeSnippet;
