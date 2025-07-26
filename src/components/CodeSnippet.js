import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Paper, Box, Typography, IconButton, useTheme, Tooltip } from '@mui/material';
import { ContentCopy, Check } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledPre = styled('pre')(({ theme }) => ({
  margin: 0,
  padding: theme.spacing(2),
  fontFamily: 'Courier New, monospace',
  fontSize: '0.875rem',
  lineHeight: 1.5,
  overflowX: 'auto',
  whiteSpace: 'pre-wrap',
  wordWrap: 'break-word',
  backgroundColor:
    theme.palette.mode === 'dark'
      ? theme.palette.grey?.[900] || '#212121'
      : theme.palette.grey?.[50] || '#fafafa',
  color: theme.palette.text.primary,
  border: 'none',
}));

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
      <Paper sx={{ p: 2, bgcolor: 'error.main', color: 'error.contrastText' }}>
        <Typography>ERROR: No code provided to CodeSnippet</Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={2}
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        my: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1,
          bgcolor:
            theme.palette.mode === 'dark'
              ? theme.palette.grey?.[800] || '#424242'
              : theme.palette.grey?.[100] || '#f5f5f5',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontFamily: 'Courier New, monospace',
            fontWeight: 'bold',
          }}
        >
          {title}
        </Typography>
        {showCopyButton && (
          <Tooltip title={copied ? 'Copied!' : 'Copy code'}>
            <IconButton
              size="small"
              onClick={handleCopy}
              sx={{
                color: theme.palette.secondary.main,
                border: `1px solid ${theme.palette.secondary.main}`,
                borderRadius: 1,
                '&:hover': {
                  bgcolor: theme.palette.secondary.main,
                  color: theme.palette.secondary.contrastText,
                },
              }}
            >
              {copied ? <Check fontSize="small" /> : <ContentCopy fontSize="small" />}
            </IconButton>
          </Tooltip>
        )}
      </Box>
      <StyledPre>{displayedCode}</StyledPre>
    </Paper>
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
