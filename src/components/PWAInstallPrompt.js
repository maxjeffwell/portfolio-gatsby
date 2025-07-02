import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { useTheme } from '../context/ThemeContext';
import { FaDownload, FaTimes } from 'react-icons/fa';

const PromptContainer = styled.div`
  position: fixed;
  bottom: ${(props) => (props.show ? '1rem' : '-100px')};
  left: 1rem;
  right: 1rem;
  background: ${(props) => props.theme.gradients.primary};
  border: 2px solid ${(props) => props.theme.colors.accent};
  border-radius: 16px;
  padding: 1rem;
  box-shadow: ${(props) => props.theme.shadows.hover};
  z-index: 1000;
  transition: all ${(props) => props.theme.transitions.slow};
  opacity: ${(props) => (props.show ? 1 : 0)};
  transform: ${(props) => (props.show ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)')};
  
  @media (min-width: 768px) {
    left: auto;
    right: 2rem;
    max-width: 400px;
  }
`;

const PromptHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
`;

const PromptTitle = styled.h3`
  color: ${(props) => props.theme.colors.text};
  font-family: HelveticaNeueLTStd-Bd, sans-serif;
  font-size: 1.125rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  transition: all ${(props) => props.theme.transitions.fast};
  
  &:hover {
    background: ${(props) => props.theme.colors.accent}20;
    color: ${(props) => props.theme.colors.accent};
  }
  
  &:focus {
    outline: 2px solid ${(props) => props.theme.colors.accent};
    outline-offset: 2px;
  }
`;

const PromptText = styled.p`
  color: ${(props) => props.theme.colors.textSecondary};
  font-family: SabonLTStd-Roman, serif;
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 0 0 1rem 0;
`;

const PromptActions = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-family: SabonLTStd-Roman, serif;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all ${(props) => props.theme.transitions.normal};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left ${(props) => props.theme.transitions.normal};
  }
  
  &:hover::before {
    left: 100%;
  }
  
  &:focus {
    outline: 2px solid ${(props) => props.theme.colors.accentSecondary};
    outline-offset: 2px;
  }
`;

const InstallButton = styled(ActionButton)`
  background: ${(props) => props.theme.gradients.accent};
  color: ${(props) => props.theme.colors.textInverse};
  border: 2px solid transparent;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${(props) => props.theme.shadows.medium};
  }
`;

const LaterButton = styled(ActionButton)`
  background: transparent;
  color: ${(props) => props.theme.colors.textSecondary};
  border: 2px solid ${(props) => props.theme.colors.border};
  
  &:hover {
    background: ${(props) => props.theme.colors.surface}40;
    border-color: ${(props) => props.theme.colors.accent};
    color: ${(props) => props.theme.colors.accent};
  }
`;

const PWAInstallPrompt = () => {
  const { theme } = useTheme();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check for iOS standalone mode
    if (window.navigator && window.navigator.standalone === true) {
      setIsInstalled(true);
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show prompt after a delay to not be intrusive
      setTimeout(() => {
        setShowPrompt(true);
      }, 5000);
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
      
      setShowPrompt(false);
      setDeferredPrompt(null);
    } catch (error) {
      console.error('Error installing PWA:', error);
    }
  };

  const handleLater = () => {
    setShowPrompt(false);
    // Show again in 24 hours
    setTimeout(() => {
      if (!isInstalled && deferredPrompt) {
        setShowPrompt(true);
      }
    }, 24 * 60 * 60 * 1000);
  };

  const handleClose = () => {
    setShowPrompt(false);
  };

  if (isInstalled || !deferredPrompt) {
    return null;
  }

  return (
    <PromptContainer theme={theme} show={showPrompt}>
      <PromptHeader>
        <PromptTitle theme={theme}>
          <FaDownload />
          Install App
        </PromptTitle>
        <CloseButton theme={theme} onClick={handleClose} aria-label="Close install prompt">
          <FaTimes />
        </CloseButton>
      </PromptHeader>
      
      <PromptText theme={theme}>
        Install this portfolio for quick access and a better experience! 
        It works offline and loads faster.
      </PromptText>
      
      <PromptActions>
        <InstallButton theme={theme} onClick={handleInstall}>
          Install Now
        </InstallButton>
        <LaterButton theme={theme} onClick={handleLater}>
          Maybe Later
        </LaterButton>
      </PromptActions>
    </PromptContainer>
  );
};

export default PWAInstallPrompt;