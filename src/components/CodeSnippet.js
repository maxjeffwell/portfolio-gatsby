import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Typography, IconButton, useTheme, Tooltip, NoSsr } from '@mui/material';
import { ContentCopy, Check } from '@mui/icons-material';
import styled from '@emotion/styled';

const StyledPre = styled.pre`
  margin: 0;
  padding: 16px;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
  background-color: #fafafa;
  color: #1976d2;
  border: none;
  
  @media (prefers-color-scheme: dark) {
    background-color: #212121;
    color: white;
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
  const theme = useTheme();
  const [displayedCode, setDisplayedCode] = useState(animated ? '' : code);
  const [copied, setCopied] = useState(false);
  const [, setAnimationComplete] = useState(!animated);

  useEffect(() => {
    if (!animated) {
      return undefined;
    }

    let index = 0;
    const timer = setInterval(() => {
      if (index <= code.length) {
        setDisplayedCode(code.slice(0, index));
        index += 1;
      } else {
        setAnimationComplete(true);
        clearInterval(timer);
      }
    }, animationSpeed);

    return () => {
      clearInterval(timer);
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
        <Typography>ERROR: No code provided to CodeSnippet</Typography>
      </StyledPaper>
    );
  }

  return (
    <StyledPaper>
      <StyledHeader>
        <Typography
          variant="caption"
          style={{
            fontFamily: 'Courier New, monospace',
            fontWeight: 'bold',
          }}
        >
          {title}
        </Typography>
        {showCopyButton && (
          <NoSsr>
            <Tooltip title={copied ? 'Copied!' : 'Copy code'}>
              <IconButton
                size="small"
                onClick={handleCopy}
                style={{
                  color: theme.palette.secondary.main,
                  border: `1px solid ${theme.palette.secondary.main}`,
                  borderRadius: 8,
                }}
                css={`
                  &:hover {
                    background-color: ${theme.palette.secondary.main};
                    color: ${theme.palette.secondary.contrastText};
                  }
                `}
              >
                {copied ? <Check fontSize="small" /> : <ContentCopy fontSize="small" />}
              </IconButton>
            </Tooltip>
          </NoSsr>
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
