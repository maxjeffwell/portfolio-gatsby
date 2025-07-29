import React from 'react';
import PropTypes from 'prop-types';
import { useStaticQuery, graphql } from 'gatsby';
import ClientOnlyIcon from './ClientOnlyIcon';
import styled from 'styled-components';

import Header from './header';
import ThirdPartyScripts from './ThirdPartyScripts';
import GlobalStyles from './GlobalStyles';
import { useTheme } from '../context/ThemeContext';

const GET_SITE_METADATA = graphql`
  query {
    site {
      siteMetadata {
        title
        author
        createdAt
      }
    }
  }
`;

const StyledContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 24px;

  @media (max-width: 600px) {
    padding: 0 16px;
  }
`;

const StyledBox = styled.div`
  display: ${(props) => props.display || 'block'};
  flex-direction: ${(props) => props.flexDirection || 'row'};
  gap: ${(props) => (props.gap ? `${props.gap * 8}px` : '0')};
  justify-content: ${(props) => props.justifyContent || 'flex-start'};
  margin-bottom: ${(props) => (props.mb ? `${props.mb * 8}px` : '0')};
  margin-top: ${(props) => (props.mt ? `${props.mt * 8}px` : '0')};
  padding: ${(props) => (props.p ? `${props.p * 8}px` : '0')};
  padding-left: ${(props) => (props.pl ? `${props.pl * 8}px` : 'inherit')};
  padding-right: ${(props) => (props.pr ? `${props.pr * 8}px` : 'inherit')};
  padding-top: ${(props) => (props.pt ? `${props.pt * 8}px` : 'inherit')};
  padding-bottom: ${(props) => (props.pb ? `${props.pb * 8}px` : 'inherit')};
`;

// Styled components to replace MUI components
const Typography = styled.div`
  margin: 0;
  font-family: ${props => {
    if (props.variant?.startsWith('h')) {
      return "'HelveticaNeueLTStd-Bd', 'AvenirLTStd-Roman', sans-serif";
    }
    return "'AvenirLTStd-Roman', 'HelveticaNeueLTStd-Roman', sans-serif";
  }};
  font-weight: ${props => 
    props.variant === 'h1' ? 700 :
    props.variant === 'h2' ? 700 :
    props.variant === 'h3' ? 600 :
    props.variant === 'h4' ? 600 :
    props.variant === 'h5' ? 500 :
    props.variant === 'h6' ? 500 :
    props.variant === 'subtitle1' ? 400 :
    props.variant === 'subtitle2' ? 500 :
    props.variant === 'body1' ? 400 :
    props.variant === 'body2' ? 400 :
    props.variant === 'caption' ? 400 :
    400
  };
  font-size: ${props => 
    props.variant === 'h1' ? 'clamp(3rem, 8vw, 6rem)' :
    props.variant === 'h2' ? 'clamp(2.5rem, 6vw, 3.75rem)' :
    props.variant === 'h3' ? 'clamp(2rem, 5vw, 3rem)' :
    props.variant === 'h4' ? 'clamp(1.5rem, 4vw, 2.125rem)' :
    props.variant === 'h5' ? 'clamp(1.25rem, 3vw, 1.5rem)' :
    props.variant === 'h6' ? 'clamp(1.125rem, 2.5vw, 1.25rem)' :
    props.variant === 'subtitle1' ? '1rem' :
    props.variant === 'subtitle2' ? '0.875rem' :
    props.variant === 'body1' ? '1rem' :
    props.variant === 'body2' ? '0.875rem' :
    props.variant === 'caption' ? '0.75rem' :
    '1rem'
  };
  line-height: ${props => 
    props.variant === 'h1' ? 1.2 :
    props.variant === 'h2' ? 1.2 :
    props.variant === 'h3' ? 1.2 :
    props.variant === 'h4' ? 1.235 :
    props.variant === 'h5' ? 1.334 :
    props.variant === 'h6' ? 1.4 :
    props.variant === 'subtitle1' ? 1.6 :
    props.variant === 'subtitle2' ? 1.5 :
    props.variant === 'body1' ? 1.7 :
    props.variant === 'body2' ? 1.6 :
    props.variant === 'caption' ? 1.5 :
    1.6
  };
  letter-spacing: ${props => 
    props.variant?.startsWith('h') ? '-0.02em' : '0.01em'
  };
  color: ${props => {
    if (props.theme?.mode === 'dark') {
      if (props.color === 'text.secondary') return 'rgba(255, 255, 255, 0.7)';
      if (props.color === 'primary') return props.theme?.colors?.primary || '#90caf9';
      if (props.color === 'secondary') return props.theme?.colors?.secondary || '#f48fb1';
      return props.customColor || props.theme?.colors?.text || 'rgba(255, 255, 255, 0.87)';
    }
    if (props.color === 'text.secondary') return 'rgba(0, 0, 0, 0.6)';
    if (props.color === 'primary') return props.theme?.colors?.primary || '#1976d2';
    if (props.color === 'secondary') return props.theme?.colors?.secondary || '#dc004e';
    return props.customColor || props.theme?.colors?.text || 'rgba(0, 0, 0, 0.87)';
  }};
  margin-bottom: ${props => props.gutterBottom ? '0.35em' : props.paragraph ? '1rem' : '0'};
  text-align: ${props => props.align || 'inherit'};
  transition: color 0.3s ease;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;

const Link = styled.a`
  color: ${props => props.theme?.colors?.primary || (props.theme?.mode === 'dark' ? '#90caf9' : '#1976d2')};
  text-decoration: underline;
  text-decoration-color: ${props => props.theme?.mode === 'dark' ? 'rgba(144, 202, 249, 0.4)' : 'rgba(25, 118, 210, 0.4)'};
  text-underline-offset: 0.125em;
  transition: color 0.3s ease, text-decoration-color 0.3s ease;
  
  &:hover {
    text-decoration-color: ${props => props.theme?.colors?.primary || (props.theme?.mode === 'dark' ? '#90caf9' : '#1976d2')};
  }
`;

const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-sizing: border-box;
  background-color: transparent;
  outline: 0;
  border: 0;
  margin: 0;
  border-radius: 50%;
  padding: 8px;
  cursor: pointer;
  user-select: none;
  vertical-align: middle;
  text-decoration: none;
  color: ${props => props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.54)'};
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, color 0.3s ease;
  
  &:hover {
    background-color: ${props => props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'};
  }
  
  &:focus-visible {
    outline: 2px solid ${props => props.theme?.colors?.primary || '#1976d2'};
    outline-offset: 2px;
  }
`;

const StyledFooter = styled.footer`
  margin-top: 0;
  padding: 32px 0;
  background-color: ${props => props.theme?.mode === 'dark' ? '#1a1a1a' : '#fafafa'};
  border-top: 3px solid #9c27b0;
  transition: background-color 0.3s ease;
`;

const SocialLink = styled(IconButton)`
  color: ${props => props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : '#333'};
  transition:
    transform 0.2s ease-in-out,
    color 0.2s ease-in-out,
    background-color 0.2s ease-in-out;
  will-change: transform, color;
  padding: 12px;

  &:hover {
    transform: scale(1.1);
    color: #9c27b0;
    background-color: rgba(156, 39, 176, 0.08);
  }
`;

// Themed Layout Component  
function ThemedLayout({ children, data }) {
  const { theme } = useTheme();
  
  return (
    <>
      <GlobalStyles theme={theme} />
      <Header />
      <main style={{ 
        margin: 0, 
        padding: 0, 
        paddingTop: '80px',
        backgroundColor: theme?.colors?.background || 'var(--bg-color)',
        color: theme?.colors?.text || 'var(--text-color)',
        transition: 'background-color 0.3s ease, color 0.3s ease'
      }}>
        {children}
      </main>
      <StyledFooter as="footer">
        <StyledContainer style={{ textAlign: 'center' }}>
          <Typography 
            as="h2" 
            variant="h4" 
            style={{ 
              fontSize: '1.5rem',
              fontWeight: 400,
              marginBottom: '8px'
            }}
            customColor={theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.87)' : '#1a1a1a'}
          >
            Jeff Maxwell
          </Typography>
          <Link
            href="mailto:maxjeffwell@gmail.com"
            underline="always"
            style={{
              fontSize: '1rem',
              color: '#e91e63',
              display: 'inline-block',
              marginBottom: '24px',
              textDecoration: 'underline',
              textDecorationColor: '#e91e63',
              textDecorationThickness: '1px',
              textUnderlineOffset: '3px'
            }}
            aria-label="Send email to maxjeffwell@gmail.com"
          >
            maxjeffwell@gmail.com
          </Link>
          <StyledBox
            as="nav"
            aria-label="Social media links"
            display="flex"
            gap={1}
            justifyContent="center"
            mb={3}
          >
            <SocialLink
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.github.com/maxjeffwell"
              aria-label="Visit Jeff Maxwell's GitHub profile"
              size="large"
            >
              <ClientOnlyIcon iconName="GitHub" style={{ fontSize: '1.5rem' }} />
            </SocialLink>
            <SocialLink
              target="_blank"
              rel="noopener noreferrer"
              href="https://angel.co/maxjeffwell"
              aria-label="Visit Jeff Maxwell's AngelList profile"
              size="large"
            >
              <ClientOnlyIcon iconName="Language" style={{ fontSize: '1.5rem' }} />
            </SocialLink>
            <SocialLink
              href="tel:+01-508-395-2008"
              aria-label="Call Jeff Maxwell at 508-395-2008"
              size="large"
            >
              <ClientOnlyIcon iconName="Phone" style={{ fontSize: '1.5rem' }} />
            </SocialLink>
          </StyledBox>
          <Typography 
            variant="body2" 
            style={{ 
              fontSize: '0.875rem', 
              fontWeight: 400
            }}
            customColor={theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : '#666'}
          >
            Built by Jeff Maxwell, created with{' '}
            <Link
              href="https://www.gatsbyjs.org"
              target="_blank"
              rel="noopener noreferrer"
              underline="always"
              style={{
                color: '#e91e63',
                textDecoration: 'underline',
                textDecorationColor: '#e91e63',
                textDecorationThickness: '1px',
                textUnderlineOffset: '2px'
              }}
            >
              Gatsby
            </Link>
          </Typography>
        </StyledContainer>
      </StyledFooter>
    </>
  );
}

ThemedLayout.propTypes = {
  children: PropTypes.node.isRequired,
  data: PropTypes.object.isRequired,
};

// Main Layout Component
function Layout({ children }) {
  const data = useStaticQuery(GET_SITE_METADATA);
  return <ThemedLayout data={data}>{children}</ThemedLayout>;
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
