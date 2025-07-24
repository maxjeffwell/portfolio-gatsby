import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';

const TypingContainer = styled('span')(() => ({
  display: 'inline-block',
  position: 'relative',
}));

const TypingText = styled('span')(({ theme }) => ({
  fontFamily: 'inherit',
  color: theme.palette.primary.main,
  fontWeight: 'bold',
  fontSize: 'inherit',
}));

const Cursor = styled('span')(({ theme, blink }) => ({
  display: 'inline-block',
  backgroundColor: theme.palette.secondary.main,
  width: 2,
  height: '1em',
  marginLeft: 2,
  animation: blink ? 'blink 1s infinite' : 'none',
  verticalAlign: 'text-top',
  '@keyframes blink': {
    '0%, 50%': {
      opacity: 1,
    },
    '51%, 100%': {
      opacity: 0,
    },
  },
}));

function TypingAnimation({
  texts,
  typeSpeed = 100,
  deleteSpeed = 50,
  delayBetweenTexts = 2000,
  loop = true,
  showCursor = true,
  cursorBlink = true,
  startDelay = 0,
}) {
  const theme = useTheme();
  const [displayText, setDisplayText] = useState('');
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [isStarted, setIsStarted] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Start animation after delay
  useEffect(() => {
    if (!isMounted) return;

    const timer = setTimeout(() => {
      setIsStarted(true);
    }, startDelay);

    return () => clearTimeout(timer);
  }, [isMounted, startDelay]);

  // Main typing effect
  useEffect(() => {
    if (!isStarted || !texts.length || !isMounted) return;

    const currentText = texts[currentTextIndex];
    let timeout;

    if (isTyping) {
      // Typing phase
      if (displayText.length < currentText.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        }, typeSpeed);
      } else {
        // Finished typing, wait then start deleting
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, delayBetweenTexts);
      }
    } else {
      // Deleting phase
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, deleteSpeed);
      } else {
        // Finished deleting, move to next text
        const nextIndex = (currentTextIndex + 1) % texts.length;

        if (loop || nextIndex !== 0) {
          setCurrentTextIndex(nextIndex);
          setIsTyping(true);
        }
      }
    }

    return () => clearTimeout(timeout);
  }, [
    displayText,
    currentTextIndex,
    isTyping,
    isStarted,
    isMounted,
    texts,
    typeSpeed,
    deleteSpeed,
    delayBetweenTexts,
    loop,
  ]);

  // Show fallback text during SSR or before animation starts
  if (!isMounted) {
    return <TypingText>full stack web developer</TypingText>;
  }

  if (!texts.length) return null;

  return (
    <TypingContainer>
      <TypingText>{displayText || (isStarted ? '' : 'full stack web developer')}</TypingText>
      {showCursor && <Cursor blink={cursorBlink} />}
    </TypingContainer>
  );
}

TypingAnimation.propTypes = {
  texts: PropTypes.arrayOf(PropTypes.string).isRequired,
  typeSpeed: PropTypes.number,
  deleteSpeed: PropTypes.number,
  delayBetweenTexts: PropTypes.number,
  loop: PropTypes.bool,
  showCursor: PropTypes.bool,
  cursorBlink: PropTypes.bool,
  startDelay: PropTypes.number,
};

export default TypingAnimation;
