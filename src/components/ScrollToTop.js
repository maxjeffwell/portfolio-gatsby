import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { useTheme } from '../context/ThemeContext';
import { FaArrowUp } from 'react-icons/fa';

const ScrollButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid ${(props) => props.theme.colors.accent};
  background: ${(props) => props.theme.gradients.accent};
  color: ${(props) => props.theme.colors.textInverse};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  z-index: 998;
  opacity: ${(props) => (props.visible ? 1 : 0)};
  visibility: ${(props) => (props.visible ? 'visible' : 'hidden')};
  transform: ${(props) => (props.visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.8)')};
  transition: all ${(props) => props.theme.transitions.normal};
  box-shadow: ${(props) => props.theme.shadows.medium};

  &:hover {
    transform: ${(props) => (props.visible ? 'translateY(-5px) scale(1.1)' : 'translateY(20px) scale(0.8)')};
    box-shadow: ${(props) => props.theme.shadows.hover};
    background: ${(props) => props.theme.colors.accentSecondary};
  }

  &:active {
    transform: ${(props) => (props.visible ? 'translateY(-2px) scale(1.05)' : 'translateY(20px) scale(0.8)')};
  }

  &:focus {
    outline: 2px solid ${(props) => props.theme.colors.accentSecondary};
    outline-offset: 3px;
  }

  @media (max-width: 768px) {
    bottom: 1rem;
    right: 1rem;
    width: 45px;
    height: 45px;
    font-size: 1rem;
  }
`;

const ScrollProgress = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: ${(props) => props.theme.colors.surface}40;
  z-index: 999;
  transform: translateY(${(props) => (props.visible ? '0' : '-100%')});
  transition: transform ${(props) => props.theme.transitions.fast};

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: ${(props) => props.theme.gradients.accent};
    width: ${(props) => props.progress}%;
    transition: width ${(props) => props.theme.transitions.fast};
    box-shadow: 0 0 10px ${(props) => props.theme.colors.accent}60;
  }
`;

const ScrollToTop = () => {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (currentScrollY / documentHeight) * 100;

      setScrollProgress(progress);
      setIsVisible(currentScrollY > 400);
    };

    const throttledHandleScroll = throttle(handleScroll, 16); // ~60fps
    window.addEventListener('scroll', throttledHandleScroll);

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      <ScrollProgress
        theme={theme}
        visible={isVisible}
        progress={scrollProgress}
      />
      <ScrollButton
        theme={theme}
        visible={isVisible}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <FaArrowUp />
      </ScrollButton>
    </>
  );
};

// Throttle function for better performance
const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export default ScrollToTop;