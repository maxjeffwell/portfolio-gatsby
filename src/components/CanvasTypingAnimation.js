import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import useMobileInView from '../hooks/useMobileInView';

const CanvasContainer = styled.div`
  display: inline-block;
  position: relative;
`;

const StyledCanvas = styled.canvas`
  display: block;
  background: transparent;
`;

const CanvasTypingAnimationInner = React.memo(({
  texts,
  typeSpeed = 100,
  deleteSpeed = 50,
  delayBetweenTexts = 2000,
  loop = true,
  showCursor = true,
  cursorBlink = true,
  startDelay = 0,
  fontSize = 64,
  fontFamily = 'inherit',
  color = '#2196f3',
  cursorColor = '#f7b733',
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [isMounted, setIsMounted] = useState(false);
  
  // Track visibility to pause/resume animation - mobile-friendly
  const isInView = useMobileInView(containerRef);

  // Animation state
  const stateRef = useRef({
    displayText: '',
    currentTextIndex: 0,
    isTyping: true,
    isStarted: false,
    cursorVisible: true,
    lastTime: 0,
    nextActionTime: 0,
    cursorBlinkTime: 0,
    pausedTime: 0,
    isPaused: false,
  });

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Calculate canvas size based on longest text
  useEffect(() => {
    if (!isMounted || !texts.length || typeof window === 'undefined') return;

    // Create temporary canvas to measure text
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.font = `${fontSize}px ${fontFamily}`;
    
    // Find the longest text width
    let maxWidth = 0;
    texts.forEach(text => {
      const metrics = tempCtx.measureText(text);
      maxWidth = Math.max(maxWidth, metrics.width);
    });

    // Add padding for cursor
    const width = Math.ceil(maxWidth + fontSize * 0.5);
    const height = Math.ceil(fontSize * 1.4);

    setCanvasSize({ width, height });
  }, [texts, fontSize, fontFamily, isMounted]);

  // Main animation loop
  useEffect(() => {
    if (!isMounted || !canvasSize.width || !texts.length || typeof window === 'undefined') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const state = stateRef.current;
    
    // Set canvas properties
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;
    
    // Configure text rendering
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';

    const animate = (currentTime) => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Handle pause/resume based on visibility
      if (!isInView) {
        if (!state.isPaused) {
          state.isPaused = true;
          state.pausedTime = currentTime;
        }
        // Render current state but don't advance animation
        ctx.fillStyle = color;
        ctx.fillText(state.displayText, 0, 0);
        
        if (showCursor && state.cursorVisible) {
          const textMetrics = ctx.measureText(state.displayText);
          const cursorX = textMetrics.width + 2;
          const cursorWidth = 2;
          const cursorHeight = fontSize * 0.8;
          
          ctx.fillStyle = cursorColor;
          ctx.fillRect(cursorX, fontSize * 0.1, cursorWidth, cursorHeight);
        }
        
        animationRef.current = requestAnimationFrame(animate);
        return;
      } else if (state.isPaused) {
        // Resume: adjust timers to account for paused time
        const pauseDuration = currentTime - state.pausedTime;
        state.nextActionTime += pauseDuration;
        state.cursorBlinkTime += pauseDuration;
        state.isPaused = false;
      }

      // Start delay
      if (!state.isStarted) {
        if (currentTime >= startDelay) {
          state.isStarted = true;
          state.nextActionTime = currentTime;
        } else {
          // Don't show anything during delay to avoid style mismatch
          animationRef.current = requestAnimationFrame(animate);
          return;
        }
      }

      const currentText = texts[state.currentTextIndex];

      // Handle typing/deleting logic
      if (currentTime >= state.nextActionTime) {
        if (state.isTyping) {
          // Typing phase
          if (state.displayText.length < currentText.length) {
            state.displayText = currentText.slice(0, state.displayText.length + 1);
            state.nextActionTime = currentTime + typeSpeed;
          } else {
            // Finished typing, wait then start deleting
            state.isTyping = false;
            state.nextActionTime = currentTime + delayBetweenTexts;
          }
        } else if (state.displayText.length > 0) {
          // Deleting phase
          state.displayText = state.displayText.slice(0, -1);
          state.nextActionTime = currentTime + deleteSpeed;
        } else {
          // Finished deleting, move to next text
          const nextIndex = (state.currentTextIndex + 1) % texts.length;
          
          if (loop || nextIndex !== 0) {
            state.currentTextIndex = nextIndex;
            state.isTyping = true;
            state.nextActionTime = currentTime;
          }
        }
      }

      // Handle cursor blinking
      if (cursorBlink && currentTime - state.cursorBlinkTime >= 500) {
        state.cursorVisible = !state.cursorVisible;
        state.cursorBlinkTime = currentTime;
      }

      // Render text
      ctx.fillStyle = color;
      ctx.fillText(state.displayText, 0, 0);

      // Render cursor
      if (showCursor && state.cursorVisible) {
        const textMetrics = ctx.measureText(state.displayText);
        const cursorX = textMetrics.width + 2;
        const cursorWidth = 2;
        const cursorHeight = fontSize * 0.8;
        
        ctx.fillStyle = cursorColor;
        ctx.fillRect(cursorX, fontSize * 0.1, cursorWidth, cursorHeight);
      }

      // Continue animation
      if (loop || state.currentTextIndex < texts.length - 1 || state.displayText.length > 0 || state.isTyping) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    // Start animation
    animationRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [
    texts,
    typeSpeed,
    deleteSpeed,
    delayBetweenTexts,
    loop,
    showCursor,
    cursorBlink,
    startDelay,
    fontSize,
    fontFamily,
    color,
    cursorColor,
    canvasSize,
    isMounted,
    isInView,
  ]);

  // Show fallback during SSR or before canvas is ready
  if (!isMounted || !canvasSize.width) {
    return (
      <span style={{ 
        display: 'inline-block',
        fontSize: `${fontSize}px`,
        fontFamily,
        color,
        minHeight: `${fontSize * 1.4}px`,
        background: 'inherit',
        backgroundClip: 'inherit',
        WebkitBackgroundClip: 'inherit',
        WebkitTextFillColor: 'inherit',
      }}>
        {texts[0] || 'React Specialist'}
      </span>
    );
  }

  return (
    <CanvasContainer ref={containerRef}>
      <StyledCanvas
        ref={canvasRef}
        style={{
          width: `${canvasSize.width}px`,
          height: `${canvasSize.height}px`,
        }}
      />
    </CanvasContainer>
  );
});

CanvasTypingAnimationInner.displayName = 'CanvasTypingAnimationInner';

// Client-side only wrapper to handle SSR properly
const CanvasTypingAnimation = (props) => {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // Always render the fallback during SSR
  if (!isClient) {
    return (
      <span style={{ 
        display: 'inline-block',
        fontSize: `${props.fontSize || 64}px`,
        fontFamily: props.fontFamily || 'inherit',
        color: props.color || '#2196f3',
        minHeight: `${(props.fontSize || 64) * 1.4}px`,
        background: 'inherit',
        backgroundClip: 'inherit',
        WebkitBackgroundClip: 'inherit',
        WebkitTextFillColor: 'inherit',
      }}>
        {props.texts?.[0] || 'React Specialist'}
      </span>
    );
  }

  return <CanvasTypingAnimationInner {...props} />;
};

CanvasTypingAnimation.displayName = 'CanvasTypingAnimation';

CanvasTypingAnimation.propTypes = {
  texts: PropTypes.arrayOf(PropTypes.string).isRequired,
  typeSpeed: PropTypes.number,
  deleteSpeed: PropTypes.number,
  delayBetweenTexts: PropTypes.number,
  loop: PropTypes.bool,
  showCursor: PropTypes.bool,
  cursorBlink: PropTypes.bool,
  startDelay: PropTypes.number,
  fontSize: PropTypes.number,
  fontFamily: PropTypes.string,
  color: PropTypes.string,
  cursorColor: PropTypes.string,
};

export default CanvasTypingAnimation;