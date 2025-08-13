import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const TypingContainer = styled.span`
  display: inline-block;
  position: relative;
`;

const TypingText = styled.span`
  font-family: inherit;
  color: inherit;
  font-weight: inherit;
  font-size: inherit;
  min-height: 1.2em;
  display: inline-block;
  background: inherit;
  background-clip: inherit;
  -webkit-background-clip: inherit;
  -webkit-text-fill-color: inherit;
  -moz-text-fill-color: inherit;
`;

const Cursor = styled.span`
  display: inline-block;
  background-color: #f7b733;
  width: 2px;
  height: 1em;
  margin-left: 2px;
  animation: ${(props) => (props.blink ? 'blink 1s infinite' : 'none')};
  vertical-align: text-top;

  @keyframes blink {
    0%,
    50% {
      opacity: 1;
    }
    51%,
    100% {
      opacity: 0;
    }
  }
`;

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
            const newText = currentText.slice(0, displayText.length + 1);
            setDisplayText(newText);
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
