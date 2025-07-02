import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { useTheme } from '../context/ThemeContext';
import { FaSync, FaTimes, FaCheckCircle } from 'react-icons/fa';

const NotificationContainer = styled.div`
  position: fixed;
  top: ${(props) => (props.show ? '1rem' : '-100px')};
  left: 1rem;
  right: 1rem;
  background: ${(props) => props.theme.colors.secondary};
  border: 2px solid ${(props) => props.theme.colors.accent};
  border-radius: 12px;
  padding: 1rem;
  box-shadow: ${(props) => props.theme.shadows.hover};
  z-index: 1001;
  transition: all ${(props) => props.theme.transitions.slow};
  opacity: ${(props) => (props.show ? 1 : 0)};
  transform: ${(props) => (props.show ? 'translateY(0)' : 'translateY(-20px)')};
  
  @media (min-width: 768px) {
    left: auto;
    right: 2rem;
    max-width: 350px;
  }
`;

const NotificationHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const NotificationTitle = styled.h4`
  color: ${(props) => props.theme.colors.text};
  font-family: HelveticaNeueLTStd-Bd, sans-serif;
  font-size: 1rem;
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
`;

const NotificationMessage = styled.p`
  color: ${(props) => props.theme.colors.textSecondary};
  font-family: SabonLTStd-Roman, serif;
  font-size: 0.875rem;
  line-height: 1.4;
  margin: 0 0 0.75rem 0;
`;

const UpdateButton = styled.button`
  background: ${(props) => props.theme.gradients.accent};
  color: ${(props) => props.theme.colors.textInverse};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-family: SabonLTStd-Roman, serif;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all ${(props) => props.theme.transitions.normal};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${(props) => props.theme.shadows.medium};
  }
  
  &:focus {
    outline: 2px solid ${(props) => props.theme.colors.accentSecondary};
    outline-offset: 2px;
  }
`;

const ServiceWorkerNotification = () => {
  const { theme } = useTheme();
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState('update'); // 'update', 'success', 'offline'

  useEffect(() => {
    // Listen for service worker updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setNotificationType('success');
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      });

      // Check for updates periodically
      const checkForUpdates = () => {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          registrations.forEach((registration) => {
            registration.update();
          });
        });
      };

      // Check for updates every 30 minutes
      const updateInterval = setInterval(checkForUpdates, 30 * 60 * 1000);

      return () => clearInterval(updateInterval);
    }

    // Listen for online/offline events
    const handleOnline = () => {
      setNotificationType('success');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000);
    };

    const handleOffline = () => {
      setNotificationType('offline');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleUpdate = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          if (registration.waiting) {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          }
        });
      });
    }
    setShowNotification(false);
    window.location.reload();
  };

  const handleClose = () => {
    setShowNotification(false);
  };

  const getNotificationContent = () => {
    switch (notificationType) {
      case 'update':
        return {
          icon: <FaSync />,
          title: 'Update Available',
          message: 'A new version of the portfolio is available. Update for the latest features!',
          showButton: true,
        };
      case 'success':
        return {
          icon: <FaCheckCircle />,
          title: navigator.onLine ? 'Connected' : 'Updated',
          message: navigator.onLine 
            ? 'You\'re back online! All features are available.' 
            : 'Portfolio updated successfully!',
          showButton: false,
        };
      case 'offline':
        return {
          icon: <FaSync />,
          title: 'Offline Mode',
          message: 'You\'re offline, but the portfolio still works! Some features may be limited.',
          showButton: false,
        };
      default:
        return null;
    }
  };

  const content = getNotificationContent();
  if (!content) return null;

  return (
    <NotificationContainer theme={theme} show={showNotification}>
      <NotificationHeader>
        <NotificationTitle theme={theme}>
          {content.icon}
          {content.title}
        </NotificationTitle>
        <CloseButton theme={theme} onClick={handleClose} aria-label="Close notification">
          <FaTimes />
        </CloseButton>
      </NotificationHeader>
      
      <NotificationMessage theme={theme}>
        {content.message}
      </NotificationMessage>
      
      {content.showButton && (
        <UpdateButton theme={theme} onClick={handleUpdate}>
          Update Now
        </UpdateButton>
      )}
    </NotificationContainer>
  );
};

export default ServiceWorkerNotification;