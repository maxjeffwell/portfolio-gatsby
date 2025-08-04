import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import ClientOnlyIcon from './ClientOnlyIcon';

const ShareContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 0;
  border-top: 1px solid ${props => props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  margin-top: 32px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

const ShareLabel = styled.span`
  font-weight: 500;
  color: ${props => props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)'};
  font-size: 1.5rem;
  margin-right: 8px;

  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 4px;
  }
`;

const ShareButtons = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const ShareButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 18px;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 500;
  font-size: 1.375rem;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  background: transparent;
  
  &:hover {
    transform: translateY(-2px);
    background: ${props => props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
  }

  &.twitter {
    color: #1da1f2;
    
    &:hover {
      color: #0d8bd9;
    }
  }

  &.linkedin {
    color: #0077b5;
    
    &:hover {
      color: #005885;
    }
  }

  &.facebook {
    color: #1877f2;
    
    &:hover {
      color: #166fe5;
    }
  }

  &.reddit {
    color: #ff4500;
    
    &:hover {
      color: #e03d00;
    }
  }

  &.email {
    color: ${props => props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : '#6c757d'};
    
    &:hover {
      color: ${props => props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : '#5a6268'};
    }
  }

  @media (max-width: 480px) {
    padding: 8px 12px;
    font-size: 1.125rem;
    gap: 6px;
  }
`;

const ShareIcon = styled.span`
  font-size: 1.25rem;
  line-height: 1;
`;

function SocialShare({ url, title, description }) {
  const { theme } = useTheme();
  
  // Encode URL and text for sharing
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  const shareText = encodeURIComponent(`${title} - ${description}`);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${shareText}&via=maxjeffwell`,
    linkedin: `https://linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${shareText}`,
    reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=${shareText}%0A%0A${encodedUrl}`
  };

  return (
    <ShareContainer theme={theme}>
      <ShareLabel theme={theme}>Share this page:</ShareLabel>
      <ShareButtons>
        <ShareButton 
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="twitter"
          title="Share on Twitter"
          aria-label="Share on Twitter"
        >
          <ClientOnlyIcon iconName="twitter" fontSize="28px" />
          Twitter
        </ShareButton>
        
        <ShareButton 
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="linkedin"
          title="Share on LinkedIn"
          aria-label="Share on LinkedIn"
        >
          <ClientOnlyIcon iconName="linkedin" fontSize="28px" />
          LinkedIn
        </ShareButton>
        
        <ShareButton 
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="facebook"
          title="Share on Facebook"
          aria-label="Share on Facebook"
        >
          <ClientOnlyIcon iconName="facebook" fontSize="28px" />
          Facebook
        </ShareButton>
        
        <ShareButton 
          href={shareLinks.reddit}
          target="_blank"
          rel="noopener noreferrer"
          className="reddit"
          title="Share on Reddit"
          aria-label="Share on Reddit"
        >
          <ClientOnlyIcon iconName="reddit" fontSize="28px" />
          Reddit
        </ShareButton>
        
        <ShareButton 
          href={shareLinks.email}
          className="email"
          title="Share via Email"
          aria-label="Share via Email"
          theme={theme}
        >
          <ClientOnlyIcon iconName="send" fontSize="28px" />
          Email
        </ShareButton>
      </ShareButtons>
    </ShareContainer>
  );
}

export default SocialShare;