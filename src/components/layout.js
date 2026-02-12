import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useStaticQuery, graphql } from 'gatsby';
import styled from 'styled-components';
import ClientOnlyIcon from './ClientOnlyIcon';
import ProtectedEmail from './ProtectedEmail';
// import Analytics from './Analytics'; // Disabled - using gatsby-plugin-google-gtag instead

import Header from './header';
// ThirdPartyScripts will be loaded client-side only
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

const Typography = styled.div`
  margin: 0;
  font-family: ${(props) => {
    if (props.variant?.startsWith('h')) {
      return "'HelveticaNeueLTStd-Bd', 'HelveticaNeueBdFallback', 'AvenirLTStd-Roman', 'AvenirFallback', sans-serif";
    }
    return "'AvenirLTStd-Roman', 'AvenirFallback', 'HelveticaNeueLTStd-Roman', 'HelveticaNeueRomanFallback', sans-serif";
  }};
  font-weight: ${(props) => {
    const weights = {
      h1: 700,
      h2: 700,
      h3: 600,
      h4: 600,
      h5: 500,
      h6: 500,
      subtitle1: 400,
      subtitle2: 500,
      body1: 400,
      body2: 400,
      caption: 400,
    };
    return weights[props.variant] || 400;
  }};
  font-size: ${(props) => {
    const sizes = {
      h1: 'clamp(3rem, 8vw, 6rem)',
      h2: 'clamp(2.5rem, 6vw, 3.75rem)',
      h3: 'clamp(2rem, 5vw, 3rem)',
      h4: 'clamp(1.5rem, 4vw, 2.125rem)',
      h5: 'clamp(1.25rem, 3vw, 1.5rem)',
      h6: 'clamp(1.125rem, 2.5vw, 1.25rem)',
      subtitle1: '1rem',
      subtitle2: '0.875rem',
      body1: '1rem',
      body2: '0.875rem',
      caption: '0.75rem',
    };
    return sizes[props.variant] || '1rem';
  }};
  line-height: ${(props) => {
    const lineHeights = {
      h1: 1.2,
      h2: 1.2,
      h3: 1.2,
      h4: 1.235,
      h5: 1.334,
      h6: 1.4,
      subtitle1: 1.6,
      subtitle2: 1.5,
      body1: 1.7,
      body2: 1.6,
      caption: 1.5,
    };
    return lineHeights[props.variant] || 1.6;
  }};
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
  margin-bottom: ${(props) => {
    if (props.gutterBottom) return '0.35em';
    if (props.paragraph) return '1rem';
    return '0';
  }};
  text-align: ${(props) => props.align || 'inherit'};
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;

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

  @media (max-width: 600px) {
    padding: 40px 0;
  }
`;

const SocialLink = styled(IconButton)`
  color: ${(props) =>
    props.theme?.mode === 'dark' ? '#ffffff !important' : 'rgba(0, 0, 0, 0.6) !important'};
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
  svg[data-icon='wellfound'] {
    color: ${(props) => (props.theme?.mode === 'dark' ? '#ffffff' : '#1a1a1a')} !important;
    fill: ${(props) => (props.theme?.mode === 'dark' ? '#ffffff' : '#1a1a1a')} !important;

    path[style*='rgba(252, 13, 33, 1)'] {
      fill: rgba(252, 13, 33, 1) !important;
    }
  }

  &:hover {
    color: #e91e63 !important;
    background: transparent !important;

    svg {
      color: #e91e63 !important;
      fill: #e91e63 !important;
    }
  }

  /* Special hover handling for wellfound icon - keep W same color as default, keep red dots */
  &[aria-label*='wellfound']:hover {
    svg {
      color: ${(props) => (props.theme?.mode === 'dark' ? '#ffffff' : '#1a1a1a')} !important;
      fill: ${(props) => (props.theme?.mode === 'dark' ? '#ffffff' : '#1a1a1a')} !important;

      path[style*='rgba(252, 13, 33, 1)'] {
        fill: rgba(252, 13, 33, 1) !important;
      }
    }
  }


  @media (max-width: 768px) {
    padding: 18px;
  }

  @media (max-width: 600px) {
    padding: 16px;

  }

  @media (max-width: 480px) {
    padding: 14px;
  }
`;

// Themed Layout Component
// Client-side only animated cursor component (desktop only)
const ClientOnlyAnimatedCursor = ({ theme }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [AnimatedCursor, setAnimatedCursor] = useState(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Only load on desktop devices with mouse support
    const isDesktopDevice =
      window.innerWidth >= 1024 &&
      !window.matchMedia('(pointer: coarse)').matches;

    setIsDesktop(isDesktopDevice);

    // Only import the cursor on desktop devices
    if (isDesktopDevice) {
      import('react-animated-cursor').then((module) => {
        setAnimatedCursor(() => module.default);
      });
    }
  }, []);

  // Skip rendering on mobile/touch devices
  if (!isMounted || !isDesktop || !AnimatedCursor) {
    return null;
  }

  return (
    <AnimatedCursor
      innerSize={8}
      outerSize={35}
      color={theme?.mode === 'dark' ? '50, 255, 130' : '21, 101, 192'}
      outerAlpha={0.2}
      innerScale={0.7}
      outerScale={5}
      trailingSpeed={4}
      showSystemCursor={true}
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
        '.clickable',
        '.card-link',
        '.cta-button',
        'header',
        'nav',
        '[role="button"]',
        {
          target: '.custom',
          options: {
            innerSize: 12,
            outerSize: 12,
            color: '255, 255, 255',
          },
        },
      ]}
    />
  );
};

ClientOnlyAnimatedCursor.propTypes = {
  theme: PropTypes.object,
};

function ThemedLayout({ children, _data }) {
  const { theme } = useTheme();

  return (
    <>
      <GlobalStyles theme={theme} />
      {/* <Analytics /> - Disabled - using gatsby-plugin-google-gtag instead */}
      <ClientOnlyAnimatedCursor theme={theme} />
      <Header />
      <main
        suppressHydrationWarning
        style={{
          margin: 0,
          padding: 0,
          minHeight: 'calc(100vh - 116px)',
          backgroundColor: theme?.colors?.background || 'var(--bg-color)',
          color: theme?.colors?.text || 'var(--text-color)',
        }}
      >
        {children}
      </main>
      <StyledFooter as="footer" theme={theme} role="contentinfo">
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
          <ProtectedEmail
            title="Send email to Jeff Maxwell"
            style={{
              fontSize: 'clamp(1.125rem, 3vw, 1.25rem)',
              color: theme?.mode === 'dark' ? '#ff4081' : '#e91e63',
              display: 'inline-block',
              marginBottom: '32px',
              textDecoration: 'none',
              fontWeight: 600,
              letterSpacing: '0.5px',
              transition: 'box-shadow 0.3s ease',
              position: 'relative',
              padding: '8px 16px',
              borderRadius: '8px',
              border: `2px solid ${theme?.mode === 'dark' ? '#ff4081' : '#e91e63'}`,
              backgroundColor: 'transparent',
            }}
            aria-label="Send email to jeff@el-jefe.me"
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                theme?.mode === 'dark'
                  ? '0 8px 25px rgba(255, 64, 129, 0.3)'
                  : '0 8px 25px rgba(233, 30, 99, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            jeff@el-jefe.me
          </ProtectedEmail>
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
              href="https://github.com/maxjeffwell"
              title="Visit Jeff Maxwell's GitHub profile - View projects and code repositories"
              aria-label="Visit Jeff Maxwell's GitHub profile"
              size="large"
              theme={theme}
            >
              <ClientOnlyIcon iconName="GitHub" fontSize="clamp(2.5rem, 5vw, 3rem)" />
            </SocialLink>
            <SocialLink
              as="a"
              target="_blank"
              rel="noopener noreferrer"
              href="https://wellfound.com/u/maxjeffwell"
              title="Visit Jeff Maxwell's Wellfound profile - Startup and tech career opportunities"
              aria-label="Visit Jeff Maxwell's wellfound profile"
              size="large"
              theme={theme}
            >
              <ClientOnlyIcon iconName="wellfound" fontSize="clamp(2.5rem, 5vw, 3rem)" />
            </SocialLink>
            <SocialLink
              as="a"
              href="tel:+01-508-395-2008"
              title="Call Jeff Maxwell at 508-395-2008 - Direct phone contact"
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
          <StyledBox
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap={0.5}
          >
            <Typography
              as="div"
              variant="body2"
              theme={theme}
              style={{
                fontSize: 'clamp(1.125rem, 2.8vw, 1.25rem)',
                fontWeight: 400,
                color: theme?.mode === 'dark' ? '#ffffff !important' : '#666 !important',
                textAlign: 'center',
                marginBottom: '8px',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: '4px',
              }}
            >
              <span>Built by Jeff Maxwell, created with</span>
              <ClientOnlyIcon
                iconName="Gatsby"
                fontSize="84px"
                style={{
                  flexShrink: 0,
                  color: theme?.mode === 'dark' ? '#ffffff' : 'rgba(0, 0, 0, 0.6)',
                }}
              />
            </Typography>
          </StyledBox>
        </StyledContainer>
      </StyledFooter>
    </>
  );
}

ThemedLayout.propTypes = {
  children: PropTypes.node.isRequired,
  _data: PropTypes.object.isRequired,
};

// Main Layout Component
function Layout({ children }) {
  const data = useStaticQuery(GET_SITE_METADATA);
  return <ThemedLayout _data={data}>{children}</ThemedLayout>;
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
