import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaCopy, FaCheck } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

function CodeSnippet({
  code,
  title = 'Code Example',
  animated = false,
  animationSpeed = 30,
  showCopyButton = true,
}) {
  const { theme } = useTheme();
  
  // Simple fallback to ensure something renders
  if (!code) {
    return <div style={{backgroundColor: '#ff0000', color: '#00ff00', padding: '20px', fontSize: '20px'}}>
      ERROR: No code provided to CodeSnippet
    </div>;
  }

  try {
    const [displayedCode, setDisplayedCode] = useState(animated ? '' : code);
    const [copied, setCopied] = useState(false);
    const [animationComplete, setAnimationComplete] = useState(!animated);

  useEffect(() => {
    if (!animated) return;

    let index = 0;
    const timer = setInterval(() => {
      if (index <= code.length) {
        setDisplayedCode(code.slice(0, index));
        index++;
      } else {
        setAnimationComplete(true);
        clearInterval(timer);
      }
    }, animationSpeed);

    // eslint-disable-next-line consistent-return
    return () => clearInterval(timer);
  }, [code, animated, animationSpeed]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const containerStyle = {
    position: 'relative',
    background: theme.name === 'light' ? '#ffffff' : theme.colors.secondary,
    border: `1px solid ${theme.name === 'light' ? '#e2e8f0' : theme.colors.border}`,
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: theme.shadows.medium,
    margin: '1.5rem 0',
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.75rem 1rem',
    background: theme.name === 'light' ? '#f1f5f9' : theme.colors.tertiary,
    borderBottom: `1px solid ${theme.name === 'light' ? '#e2e8f0' : theme.colors.border}`,
  };

  const titleStyle = {
    color: theme.colors.text,
    fontFamily: 'Courier New, monospace',
    fontSize: '0.875rem',
    fontWeight: 'bold',
  };

  const buttonStyle = {
    background: 'none',
    border: `1px solid ${theme.colors.accentSecondary}`,
    color: theme.colors.accentSecondary,
    padding: '0.25rem 0.5rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  };

  const codeStyle = {
    margin: 0,
    padding: '1rem',
    fontFamily: 'Courier New, monospace',
    fontSize: '0.875rem',
    lineHeight: '1.5',
    overflowX: 'auto',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    backgroundColor: theme.name === 'light' ? '#f8f9fa' : theme.colors.tertiary,
    color: theme.name === 'light' ? '#2d3748' : theme.colors.text,
    border: 'none',
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={titleStyle}>{title}</div>
        {showCopyButton && (
          <button style={buttonStyle} onClick={handleCopy}>
            {typeof window !== 'undefined' && (copied ? <FaCheck /> : <FaCopy />)}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        )}
      </div>
      <pre style={codeStyle}>
        {displayedCode}
      </pre>
    </div>
  );
  } catch (error) {
    console.error('CodeSnippet error:', error);
    return <div style={{backgroundColor: '#ff0000', color: '#00ff00', padding: '20px', fontSize: '20px'}}>
      ERROR: CodeSnippet failed to render: {error.message}
    </div>;
  }
}

CodeSnippet.propTypes = {
  code: PropTypes.string.isRequired,
  // eslint-disable-next-line react/require-default-props
  title: PropTypes.string,
  animated: PropTypes.bool,
  // eslint-disable-next-line react/require-default-props
  animationSpeed: PropTypes.number,
  showCopyButton: PropTypes.bool,
};

export default CodeSnippet;
