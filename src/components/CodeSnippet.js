import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { useTheme } from '../context/ThemeContext';
import { FaCopy, FaCheck } from 'react-icons/fa';

const CodeContainer = styled.div`
  position: relative;
  background: ${(props) => props.theme.colors.secondary};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: ${(props) => props.theme.shadows.medium};
  margin: 1.5rem 0;
`;

const CodeHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: ${(props) => props.theme.colors.tertiary};
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
`;

const CodeTitle = styled.div`
  color: ${(props) => props.theme.colors.text};
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  font-weight: bold;
`;

const CopyButton = styled.button`
  background: none;
  border: 1px solid ${(props) => props.theme.colors.accent};
  color: ${(props) => props.theme.colors.accent};
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.75rem;
  transition: all ${(props) => props.theme.transitions.fast};
  display: flex;
  align-items: center;
  gap: 0.25rem;

  &:hover {
    background: ${(props) => props.theme.colors.accent};
    color: ${(props) => props.theme.colors.textInverse};
  }

  &:focus {
    outline: 2px solid ${(props) => props.theme.colors.accentSecondary};
    outline-offset: 2px;
  }
`;

const CodeContent = styled.pre`
  margin: 0;
  padding: 1rem;
  background: ${(props) => props.theme.colors.surface};
  color: ${(props) => props.theme.colors.textInverse};
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;

  /* Syntax highlighting colors */
  .keyword { color: #569cd6; }
  .string { color: #ce9178; }
  .comment { color: #6a9955; font-style: italic; }
  .function { color: #dcdcaa; }
  .variable { color: #9cdcfe; }
  .number { color: #b5cea8; }
  .operator { color: #d4d4d4; }
`;

const AnimatedChar = styled.span`
  opacity: ${(props) => (props.show ? 1 : 0)};
  transition: opacity 0.05s ease-out;
`;

const CodeSnippet = ({
  code,
  title = 'Code Example',
  animated = false,
  animationSpeed = 30,
  showCopyButton = true,
}) => {
  const { theme } = useTheme();
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

  const highlightSyntax = (text) => {
    return text
      .replace(/\b(const|let|var|function|return|if|else|for|while|class|import|export|from|default)\b/g, '<span class="keyword">$1</span>')
      .replace(/(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g, '<span class="string">$1$2$1</span>')
      .replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '<span class="comment">$&</span>')
      .replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g, '<span class="function">$1</span>')
      .replace(/\b\d+(\.\d+)?\b/g, '<span class="number">$&</span>')
      .replace(/[+\-*/%=<>!&|^~?:]/g, '<span class="operator">$&</span>');
  };

  return (
    <CodeContainer theme={theme}>
      <CodeHeader theme={theme}>
        <CodeTitle theme={theme}>{title}</CodeTitle>
        {showCopyButton && (
          <CopyButton theme={theme} onClick={handleCopy}>
            {copied ? <FaCheck /> : <FaCopy />}
            {copied ? 'Copied!' : 'Copy'}
          </CopyButton>
        )}
      </CodeHeader>
      <CodeContent
        theme={theme}
        dangerouslySetInnerHTML={{
          __html: highlightSyntax(displayedCode),
        }}
      />
    </CodeContainer>
  );
};

CodeSnippet.propTypes = {
  code: PropTypes.string.isRequired,
  title: PropTypes.string,
  animated: PropTypes.bool,
  animationSpeed: PropTypes.number,
  showCopyButton: PropTypes.bool,
};

export default CodeSnippet;