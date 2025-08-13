import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const SimpleTypingAnimation = ({
  texts,
  typeSpeed = 100,
  deleteSpeed = 50,
  delayBetweenTexts = 2000,
  loop = true,
  startDelay = 0,
  style = {},
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (!texts.length) return;

    const startTimeout = setTimeout(() => {
      setHasStarted(true);
    }, startDelay);

    return () => clearTimeout(startTimeout);
  }, [startDelay, texts.length]);

  useEffect(() => {
    if (!hasStarted || !texts.length) return;

    const currentText = texts[currentIndex];
    let timeout;

    if (isTyping) {
      if (displayText.length < currentText.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        }, typeSpeed);
      } else {
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, delayBetweenTexts);
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, deleteSpeed);
      } else {
        const nextIndex = (currentIndex + 1) % texts.length;
        if (loop || nextIndex !== 0) {
          setCurrentIndex(nextIndex);
          setIsTyping(true);
        }
      }
    }

    return () => clearTimeout(timeout);
  }, [
    displayText,
    currentIndex,
    isTyping,
    hasStarted,
    texts,
    typeSpeed,
    deleteSpeed,
    delayBetweenTexts,
    loop,
  ]);

  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 400);

    return () => clearInterval(cursorInterval);
  }, []);

  if (!hasStarted) {
    return <span style={style}>{texts[0] || ''}</span>;
  }

  return (
    <span style={style}>
      {displayText}
      {hasStarted && <span style={{ opacity: showCursor ? 1 : 0 }}>|</span>}
    </span>
  );
};

SimpleTypingAnimation.propTypes = {
  texts: PropTypes.arrayOf(PropTypes.string).isRequired,
  typeSpeed: PropTypes.number,
  deleteSpeed: PropTypes.number,
  delayBetweenTexts: PropTypes.number,
  loop: PropTypes.bool,
  startDelay: PropTypes.number,
  style: PropTypes.object,
};

export default SimpleTypingAnimation;
