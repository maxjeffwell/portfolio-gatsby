import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { FaExclamationTriangle, FaRedo, FaHome } from 'react-icons/fa';

const ErrorContainer = styled.div`
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  border-radius: 16px;
  border: 1px solid #404040;
  margin: 2rem 0;
`;

const ErrorIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6b47 0%, #ffc947 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  
  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.05);
      opacity: 0.8;
    }
  }
  
  svg {
    color: white;
    font-size: 2rem;
  }
`;

const ErrorTitle = styled.h1`
  font-family: 'HelveticaNeueLTStd-Bd', sans-serif;
  font-size: 2rem;
  color: #ffffff;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #ffc947 0%, #ff6b47 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const ErrorMessage = styled.p`
  font-family: 'HelveticaNeueLTStd-Roman', sans-serif;
  font-size: 1.125rem;
  color: #e0e0e0;
  line-height: 1.6;
  margin-bottom: 2rem;
  max-width: 600px;
`;

const ErrorDetails = styled.details`
  margin: 1rem 0 2rem;
  max-width: 800px;
  width: 100%;
  
  summary {
    color: #ffc947;
    cursor: pointer;
    font-family: 'HelveticaNeueLTStd-Roman', sans-serif;
    font-size: 0.9rem;
    padding: 0.5rem;
    border-radius: 4px;
    transition: background-color 0.2s ease;
    
    &:hover {
      background-color: rgba(255, 201, 71, 0.1);
    }
  }
  
  pre {
    background: #0a0a0a;
    color: #ff6b47;
    padding: 1rem;
    border-radius: 8px;
    font-size: 0.8rem;
    overflow-x: auto;
    margin-top: 0.5rem;
    border: 1px solid #404040;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: ${props => props.primary 
    ? 'linear-gradient(135deg, #ffc947 0%, #ff6b47 100%)' 
    : 'transparent'};
  color: ${props => props.primary ? '#000000' : '#ffffff'};
  border: 2px solid ${props => props.primary ? 'transparent' : '#404040'};
  border-radius: 8px;
  font-family: 'HelveticaNeueLTStd-Roman', sans-serif;
  font-size: 1rem;
  font-weight: ${props => props.primary ? 'bold' : 'normal'};
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    background: ${props => props.primary 
      ? 'linear-gradient(135deg, #ffdb6b 0%, #ff8a6b 100%)' 
      : 'rgba(255, 255, 255, 0.1)'};
  }
  
  &:focus {
    outline: 2px solid #ffc947;
    outline-offset: 2px;
  }
  
  svg {
    font-size: 1rem;
  }
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      eventId: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Store error details for display
    this.setState({
      error,
      errorInfo,
    });

    // Report error to monitoring service (e.g., Sentry)
    if (typeof window !== 'undefined' && window.Sentry) {
      const eventId = window.Sentry.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack,
          },
        },
      });
      this.setState({ eventId });
    }

    // Report to Google Analytics if available
    if (typeof gtag !== 'undefined') {
      gtag('event', 'exception', {
        description: error.toString(),
        fatal: true,
      });
    }
  }

  handleRefresh = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleReportFeedback = () => {
    if (this.state.eventId && window.Sentry) {
      window.Sentry.showReportDialog({ eventId: this.state.eventId });
    } else {
      // Fallback to email
      const subject = encodeURIComponent('Portfolio Error Report');
      const body = encodeURIComponent(`
        Error: ${this.state.error?.toString() || 'Unknown error'}
        
        Browser: ${navigator.userAgent}
        URL: ${window.location.href}
        Timestamp: ${new Date().toISOString()}
        
        Additional details:
        ${this.state.errorInfo?.componentStack || 'No component stack available'}
      `);
      window.open(`mailto:maxjeffwell@gmail.com?subject=${subject}&body=${body}`);
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorIcon>
            {typeof window !== 'undefined' && <FaExclamationTriangle />}
          </ErrorIcon>
          
          <ErrorTitle>
            Oops! Something went wrong
          </ErrorTitle>
          
          <ErrorMessage>
            I apologize for the inconvenience. An unexpected error has occurred while 
            loading this page. This has been automatically reported and I'll work on 
            fixing it as soon as possible.
          </ErrorMessage>

          {this.state.error && process.env.NODE_ENV === 'development' && (
            <ErrorDetails>
              <summary>View technical details</summary>
              <pre>
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </ErrorDetails>
          )}

          <ButtonGroup>
            <ActionButton primary onClick={this.handleRefresh}>
              {typeof window !== 'undefined' && <FaRedo />}
              Try Again
            </ActionButton>
            
            <ActionButton onClick={this.handleGoHome}>
              {typeof window !== 'undefined' && <FaHome />}
              Go Home
            </ActionButton>
            
            <ActionButton onClick={this.handleReportFeedback}>
              Report Issue
            </ActionButton>
          </ButtonGroup>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;