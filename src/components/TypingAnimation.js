import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

const TypingContainer = styled('span')(() => ({
  display: 'inline-block',
  position: 'relative',
}));

const TypingText = styled('span')(() => ({
  fontFamily: 'inherit',
  color: 'inherit',
  fontWeight: 'bold',
  fontSize: 'inherit',
  minHeight: '1.2em',
  display: 'inline-block',
  width: '100%',
  textAlign: 'left',
  contain: 'layout',
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

const TypingAnimation = React.memo(
  ({
    texts,
    typeSpeed = 100,
    deleteSpeed = 50,
    delayBetweenTexts = 2000,
    loop = true,
    showCursor = true,
    cursorBlink = true,
    startDelay = 0,
  }) => {
    // Memoize configuration to prevent unnecessary re-renders
    const config = useMemo(
      () => ({
        typeSpeed,
        deleteSpeed,
        delayBetweenTexts,
        loop,
      }),
      [typeSpeed, deleteSpeed, delayBetweenTexts, loop]
    );
    const [displayText, setDisplayText] = useState('');
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(true);
    const [isStarted, setIsStarted] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Handle client-side mounting
    useEffect(() => {
      setIsMounted(true);
      return undefined;
    }, []);

    // Start animation after delay
    useEffect(() => {
      if (!isMounted) return undefined;

      const timer = setTimeout(() => {
        setIsStarted(true);
      }, startDelay);

      return () => clearTimeout(timer);
    }, [isMounted, startDelay]);

    // Main typing effect
    useEffect(() => {
      if (!isStarted || !texts.length || !isMounted) return undefined;

      const currentText = texts[currentTextIndex];
      let timeout;

      if (isTyping) {
        // Typing phase
        if (displayText.length < currentText.length) {
          timeout = setTimeout(() => {
            setDisplayText(currentText.slice(0, displayText.length + 1));
          }, config.typeSpeed);
        } else {
          // Finished typing, wait then start deleting
          timeout = setTimeout(() => {
            setIsTyping(false);
          }, config.delayBetweenTexts);
        }
      } else if (displayText.length > 0) {
        // Deleting phase
        timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, config.deleteSpeed);
      } else {
        // Finished deleting, move to next text
        const nextIndex = (currentTextIndex + 1) % texts.length;

        if (config.loop || nextIndex !== 0) {
          setCurrentTextIndex(nextIndex);
          setIsTyping(true);
        }
      }

      return () => clearTimeout(timeout);
    }, [displayText, currentTextIndex, isTyping, isStarted, isMounted, texts, config]);

    // Show fallback text during SSR or before animation starts
    if (!isMounted || !texts.length) {
      return (
        <TypingContainer>
          <TypingText>{texts[0] || 'React Specialist'}</TypingText>
          {showCursor && <Cursor blink={false} />}
        </TypingContainer>
      );
    }

    const currentDisplayText = isStarted ? displayText : '';

    return (
      <TypingContainer>
        <TypingText>{currentDisplayText}</TypingText>
        {showCursor && <Cursor blink={cursorBlink && isStarted} />}
      </TypingContainer>
    );
  }
);

TypingAnimation.displayName = 'TypingAnimation';

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
