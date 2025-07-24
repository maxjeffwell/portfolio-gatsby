import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { useTheme } from '../context/ThemeContext';

const TransitionContainer = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
`;

const PageWrapper = styled.div`
  width: 100%;
  transition: all ${(props) => props.theme.transitions.slow};
  transform: ${(props) => {
    switch (props.stage) {
      case 'entering':
        return 'translateX(100%)';
      case 'entered':
        return 'translateX(0)';
      case 'exiting':
        return 'translateX(-100%)';
      default:
        return 'translateX(0)';
    }
  }};
  opacity: ${(props) => (props.stage === 'entered' ? 1 : 0)};
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${(props) => props.theme.gradients.primary};
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  opacity: ${(props) => (props.show ? 1 : 0)};
  visibility: ${(props) => (props.show ? 'visible' : 'hidden')};
  transition: all ${(props) => props.theme.transitions.normal};
`;

const LoadingSpinner = styled.div`
  width: 60px;
  height: 60px;
  border: 4px solid ${(props) => props.theme.colors.accent}40;
  border-top: 4px solid ${(props) => props.theme.colors.accent};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.div`
  color: ${(props) => props.theme.colors.text};
  font-family: SabonLTStd-Roman, serif;
  font-size: 1.25rem;
  animation: pulse 1.5s ease-in-out infinite;

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

function PageTransition({ children, location }) {
  const { theme } = useTheme();
  const [transitionStage, setTransitionStage] = useState('entered');
  const [showLoading, setShowLoading] = useState(false);
  const [previousLocation, setPreviousLocation] = useState(location);

  useEffect(() => {
    if (location !== previousLocation) {
      // Start transition
      setTransitionStage('exiting');
      setShowLoading(true);

      // Simulate loading time
      const loadingTimer = setTimeout(() => {
        setTransitionStage('entering');
        setPreviousLocation(location);

        // Complete transition
        const enterTimer = setTimeout(() => {
          setTransitionStage('entered');
          setShowLoading(false);
        }, 100);

        return () => clearTimeout(enterTimer);
      }, 600);

      return () => clearTimeout(loadingTimer);
    }
  }, [location, previousLocation]);

  return (
    <>
      <LoadingOverlay theme={theme} show={showLoading}>
        <LoadingSpinner theme={theme} />
        <LoadingText theme={theme}>Loading...</LoadingText>
      </LoadingOverlay>

      <TransitionContainer>
        <PageWrapper theme={theme} stage={transitionStage}>
          {children}
        </PageWrapper>
      </TransitionContainer>
    </>
  );
}

PageTransition.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired,
};

export default PageTransition;
