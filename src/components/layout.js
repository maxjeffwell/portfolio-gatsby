import React from 'react';
import PropTypes from 'prop-types';
import { useStaticQuery, graphql } from 'gatsby';
import styled from 'styled-components';
import AnimatedCursor from 'react-animated-cursor';
import ClientOnlyIcon from './ClientOnlyIcon';

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
  width: 100%;
  margin: 0 auto;
  padding: 0 24px;
  box-sizing: border-box;

  @media (max-width: 600px) {
    padding: 0 16px;
  }

  @media (max-width: 360px) {
    padding: 0 12px;
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
  font-family: ${(props) => {
    if (props.variant?.startsWith('h')) {
      return "'HelveticaNeueLTStd-Bd', 'AvenirLTStd-Roman', sans-serif";
    }
    return "'AvenirLTStd-Roman', 'HelveticaNeueLTStd-Roman', sans-serif";
  }};
  font-weight: ${(props) =>
    props.variant === 'h1'
      ? 700
      : props.variant === 'h2'
        ? 700
        : props.variant === 'h3'
          ? 600
          : props.variant === 'h4'
            ? 600
            : props.variant === 'h5'
              ? 500
              : props.variant === 'h6'
                ? 500
                : props.variant === 'subtitle1'
                  ? 400
                  : props.variant === 'subtitle2'
                    ? 500
                    : props.variant === 'body1'
                      ? 400
                      : props.variant === 'body2'
                        ? 400
                        : props.variant === 'caption'
                          ? 400
                          : 400};
  font-size: ${(props) =>
    props.variant === 'h1'
      ? 'clamp(3rem, 8vw, 6rem)'
      : props.variant === 'h2'
        ? 'clamp(2.5rem, 6vw, 3.75rem)'
        : props.variant === 'h3'
          ? 'clamp(2rem, 5vw, 3rem)'
          : props.variant === 'h4'
            ? 'clamp(1.5rem, 4vw, 2.125rem)'
            : props.variant === 'h5'
              ? 'clamp(1.25rem, 3vw, 1.5rem)'
              : props.variant === 'h6'
                ? 'clamp(1.125rem, 2.5vw, 1.25rem)'
                : props.variant === 'subtitle1'
                  ? '1rem'
                  : props.variant === 'subtitle2'
                    ? '0.875rem'
                    : props.variant === 'body1'
                      ? '1rem'
                      : props.variant === 'body2'
                        ? '0.875rem'
                        : props.variant === 'caption'
                          ? '0.75rem'
                          : '1rem'};
  line-height: ${(props) =>
    props.variant === 'h1'
      ? 1.2
      : props.variant === 'h2'
        ? 1.2
        : props.variant === 'h3'
          ? 1.2
          : props.variant === 'h4'
            ? 1.235
            : props.variant === 'h5'
              ? 1.334
              : props.variant === 'h6'
                ? 1.4
                : props.variant === 'subtitle1'
                  ? 1.6
                  : props.variant === 'subtitle2'
                    ? 1.5
                    : props.variant === 'body1'
                      ? 1.7
                      : props.variant === 'body2'
                        ? 1.6
                        : props.variant === 'caption'
                          ? 1.5
                          : 1.6};
  letter-spacing: ${(props) => (props.variant?.startsWith('h') ? '-0.02em' : '0.01em')};
  color: ${(props) => {
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
  margin-bottom: ${(props) => (props.gutterBottom ? '0.35em' : props.paragraph ? '1rem' : '0')};
  text-align: ${(props) => props.align || 'inherit'};
  transition: color 0.3s ease;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;

const Link = styled.a`
  color: ${(props) =>
    props.theme?.colors?.primary || (props.theme?.mode === 'dark' ? '#90caf9' : '#1976d2')};
  text-decoration: underline;
  text-decoration-color: ${(props) =>
    props.theme?.mode === 'dark' ? 'rgba(144, 202, 249, 0.4)' : 'rgba(25, 118, 210, 0.4)'};
  text-underline-offset: 0.125em;
  transition:
    color 0.3s ease,
    text-decoration-color 0.3s ease;

  &:hover {
    text-decoration-color: ${(props) =>
      props.theme?.colors?.primary || (props.theme?.mode === 'dark' ? '#90caf9' : '#1976d2')};
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
  color: ${(props) =>
    props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.54)'};
  transition:
    background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    color 0.3s ease;

  &:hover {
    background-color: ${(props) =>
      props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'};
  }

  &:focus-visible {
    outline: 2px solid ${(props) => props.theme?.colors?.primary || '#1976d2'};
    outline-offset: 2px;
  }
`;

const StyledFooter = styled.footer`
  margin-top: 0;
  padding: 48px 0;
  background-color: ${(props) => (props.theme?.mode === 'dark' ? '#0a0a0a' : '#fafafa')};
  border-top: 3px solid #9c27b0;
  transition: background-color 0.3s ease;

  @media (max-width: 600px) {
    padding: 40px 0;
  }
`;

const SocialLink = styled(IconButton)`
  color: ${(props) =>
    props.theme?.mode === 'dark' ? '#ffffff !important' : 'rgba(0, 0, 0, 0.6) !important'};
  transition:
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    color 0.3s ease;
  will-change: transform, color;
  padding: 20px;
  background: transparent !important;
  border: none !important;

  /* Ensure icons inherit the color and are visible */
  svg {
    color: ${(props) =>
      props.theme?.mode === 'dark' ? '#ffffff !important' : 'rgba(0, 0, 0, 0.6) !important'};
    fill: ${(props) =>
      props.theme?.mode === 'dark' ? '#ffffff !important' : 'rgba(0, 0, 0, 0.6) !important'};
    opacity: 1 !important;
  }

  /* Special handling for wellfound icon - W should be same color as "Jeff Maxwell" */
  svg[data-icon="wellfound"] {
    color: ${(props) => (props.theme?.mode === 'dark' ? '#ffffff' : '#1a1a1a')} !important;
    fill: ${(props) => (props.theme?.mode === 'dark' ? '#ffffff' : '#1a1a1a')} !important;
    
    path[style*="rgba(252, 13, 33, 1)"] {
      fill: rgba(252, 13, 33, 1) !important;
    }
  }

  &:hover {
    transform: translateY(-4px) scale(1.15);
    color: #e91e63 !important;
    background: transparent !important;

    svg {
      color: #e91e63 !important;
      fill: #e91e63 !important;
    }
  }

  /* Special hover handling for wellfound icon - keep W same color as default, keep red dots */
  &[aria-label*="wellfound"]:hover {
    svg {
      color: ${(props) => (props.theme?.mode === 'dark' ? '#ffffff' : '#1a1a1a')} !important;
      fill: ${(props) => (props.theme?.mode === 'dark' ? '#ffffff' : '#1a1a1a')} !important;
      
      path[style*="rgba(252, 13, 33, 1)"] {
        fill: rgba(252, 13, 33, 1) !important;
      }
    }
  }

  &:active {
    transform: translateY(-2px) scale(1.1);
  }

  @media (max-width: 768px) {
    padding: 18px;
  }

  @media (max-width: 600px) {
    padding: 16px;

    &:hover {
      transform: translateY(-2px) scale(1.1);
    }
  }

  @media (max-width: 480px) {
    padding: 14px;
  }
`;

// Themed Layout Component
function ThemedLayout({ children, data }) {
  const { theme } = useTheme();

  return (
    <>
      <GlobalStyles theme={theme} />
      <ThirdPartyScripts />
      <AnimatedCursor
        innerSize={8}
        outerSize={35}
        color={theme?.mode === 'dark' ? '50, 255, 130' : '21, 101, 192'}
        outerAlpha={0.2}
        innerScale={0.7}
        outerScale={5}
        trailingSpeed={4}
        showSystemCursor={false}
        clickables={[
          'a',
          'input[type="text"]',
          'input[type="email"]', 
          'input[type="number"]',
          'input[type="submit"]',
          'input[type="image"]',
          'label[for]',
          'select',
          'textarea',
          'button',
          '.link',
          {
            target: '.custom',
            options: {
              innerSize: 12,
              outerSize: 12,
              color: '255, 255, 255',
            }
          }
        ]}
      />
      <Header />
      <main
        suppressHydrationWarning
        style={{
          margin: 0,
          padding: 0,
          paddingTop: '80px',
          minHeight: 'calc(100vh - 80px)',
          backgroundColor: theme?.colors?.background || 'var(--bg-color)',
          color: theme?.colors?.text || 'var(--text-color)',
          transition: 'background-color 0.3s ease, color 0.3s ease',
        }}
      >
        {children}
      </main>
      <StyledFooter as="footer" theme={theme}>
        <StyledContainer style={{ textAlign: 'center' }}>
          <Typography
            as="h2"
            variant="h4"
            style={{
              fontSize: 'clamp(1.75rem, 4vw, 2rem)',
              fontWeight: 400,
              marginBottom: '12px',
              color: theme?.mode === 'dark' ? '#ffffff' : '#1a1a1a',
            }}
          >
            Jeff Maxwell
          </Typography>
          <Link
            href="mailto:maxjeffwell@gmail.com"
            underline="always"
            theme={theme}
            style={{
              fontSize: 'clamp(1.125rem, 3vw, 1.25rem)',
              background: theme?.mode === 'dark' 
                ? 'linear-gradient(135deg, #ff4081 0%, #e91e63 100%)'
                : 'linear-gradient(135deg, #e91e63 0%, #ad1457 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: theme?.mode === 'dark' ? '#ff4081' : '#e91e63', // Fallback color for browsers that don't support background-clip
              display: 'inline-block',
              marginBottom: '32px',
              textDecoration: 'none',
              fontWeight: 600,
              letterSpacing: '0.5px',
              transition: 'all 0.3s ease',
              position: 'relative',
              padding: '8px 16px',
              borderRadius: '8px',
              border: `2px solid ${theme?.mode === 'dark' ? '#ff4081' : '#e91e63'}`,
              backgroundColor: 'transparent',
            }}
            aria-label="Send email to maxjeffwell@gmail.com"
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = theme?.mode === 'dark' 
                ? '0 8px 25px rgba(255, 64, 129, 0.3)' 
                : '0 8px 25px rgba(233, 30, 99, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
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
              as="a"
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.github.com/maxjeffwell"
              aria-label="Visit Jeff Maxwell's GitHub profile"
              size="large"
              theme={theme}
            >
              <ClientOnlyIcon
                iconName="GitHub"
                fontSize="clamp(2.5rem, 5vw, 3rem)"
              />
            </SocialLink>
            <SocialLink
              as="a"
              target="_blank"
              rel="noopener noreferrer"
              href="https://https://wellfound.com/u/maxjeffwell"
              aria-label="Visit Jeff Maxwell's wellfound profile"
              size="large"
              theme={theme}
            >
              <ClientOnlyIcon
                iconName="wellfound"
                fontSize="clamp(2.5rem, 5vw, 3rem)"
              />
            </SocialLink>
            <SocialLink
              as="a"
              href="tel:+01-508-395-2008"
              aria-label="Call Jeff Maxwell at 508-395-2008"
              size="large"
              theme={theme}
            >
              <ClientOnlyIcon
                iconName="Phone"
                fontSize="clamp(2.5rem, 5vw, 3rem)"
                style={{ color: '#eb2b00' }}
              />
            </SocialLink>
          </StyledBox>
          <StyledBox display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={1}>
            <Typography
              as="div"
              variant="body2"
              theme={theme}
              style={{
                fontSize: 'clamp(1.125rem, 2.8vw, 1.25rem)',
                fontWeight: 400,
                color: theme?.mode === 'dark' ? '#ffffff !important' : '#666 !important',
                textAlign: 'center',
                marginBottom: '16px',
              }}
            >
              Built by Jeff Maxwell, created with Gatsby
            </Typography>
            <Link
              href="https://www.gatsbyjs.org"
              target="_blank"
              rel="noopener noreferrer"
              theme={theme}
              style={{
                display: 'flex',
                justifyContent: 'center',
                textDecoration: 'none',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
              aria-label="Built with Gatsby"
            >
              <ClientOnlyIcon
                iconName="Gatsby"
                fontSize="clamp(3.5rem, 8vw, 4.5rem)"
                style={{
                  color: theme?.mode === 'dark' ? '#ff4081' : '#e91e63',
                }}
              />
            </Link>
          </StyledBox>
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
