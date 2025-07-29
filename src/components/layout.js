import React from 'react';
import PropTypes from 'prop-types';
import { useStaticQuery, graphql } from 'gatsby';
import ClientOnlyIcon from './ClientOnlyIcon';
import styled from 'styled-components';

import Header from './header';
import ThirdPartyScripts from './ThirdPartyScripts';
import GlobalStyles from './GlobalStyles';

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
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;

  @media (max-width: 600px) {
    padding: 0 16px;
  }

  @media (max-width: 360px) {
    margin-top: 48px !important;
    margin-bottom: 24px !important;
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
  font-family: inherit;
  font-weight: ${props => 
    props.variant === 'h1' ? 300 :
    props.variant === 'h2' ? 300 :
    props.variant === 'h3' ? 400 :
    props.variant === 'h4' ? 400 :
    props.variant === 'h5' ? 400 :
    props.variant === 'h6' ? 500 :
    props.variant === 'subtitle1' ? 400 :
    props.variant === 'subtitle2' ? 500 :
    props.variant === 'body1' ? 400 :
    props.variant === 'body2' ? 400 :
    props.variant === 'caption' ? 400 :
    400
  };
  font-size: ${props => 
    props.variant === 'h1' ? '6rem' :
    props.variant === 'h2' ? '3.75rem' :
    props.variant === 'h3' ? '3rem' :
    props.variant === 'h4' ? '2.125rem' :
    props.variant === 'h5' ? '1.5rem' :
    props.variant === 'h6' ? '1.25rem' :
    props.variant === 'subtitle1' ? '1rem' :
    props.variant === 'subtitle2' ? '0.875rem' :
    props.variant === 'body1' ? '1rem' :
    props.variant === 'body2' ? '0.875rem' :
    props.variant === 'caption' ? '0.75rem' :
    '1rem'
  };
  line-height: ${props => 
    props.variant === 'h1' ? 1.167 :
    props.variant === 'h2' ? 1.2 :
    props.variant === 'h3' ? 1.167 :
    props.variant === 'h4' ? 1.235 :
    props.variant === 'h5' ? 1.334 :
    props.variant === 'h6' ? 1.6 :
    props.variant === 'subtitle1' ? 1.75 :
    props.variant === 'subtitle2' ? 1.57 :
    props.variant === 'body1' ? 1.5 :
    props.variant === 'body2' ? 1.43 :
    props.variant === 'caption' ? 1.66 :
    1.5
  };
  color: ${props => 
    props.color === 'text.secondary' ? 'rgba(0, 0, 0, 0.6)' :
    props.color === 'primary' ? '#1976d2' :
    'rgba(0, 0, 0, 0.87)'
  };
  margin-bottom: ${props => props.gutterBottom ? '0.35em' : '0'};
  text-align: ${props => props.align || 'inherit'};
  
  @media (prefers-color-scheme: dark) {
    color: ${props => 
      props.color === 'text.secondary' ? 'rgba(255, 255, 255, 0.7)' :
      props.color === 'primary' ? '#90caf9' :
      'rgba(255, 255, 255, 0.87)'
    };
  }
`;

const Link = styled.a`
  color: #1976d2;
  text-decoration: underline;
  text-decoration-color: rgba(25, 118, 210, 0.4);
  text-underline-offset: 0.125em;
  
  &:hover {
    text-decoration-color: #1976d2;
  }
  
  @media (prefers-color-scheme: dark) {
    color: #90caf9;
    text-decoration-color: rgba(144, 202, 249, 0.4);
    
    &:hover {
      text-decoration-color: #90caf9;
    }
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
  color: rgba(0, 0, 0, 0.54);
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
  
  @media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.7);
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.08);
    }
  }
`;

const StyledFooter = styled.footer`
  margin-top: 64px;
  padding-top: 32px;
  padding-bottom: 32px;
  border-top: 3px solid #f7b733;
  background-color: #f5f5f5;

  @media (prefers-color-scheme: dark) {
    background-color: #212121;
  }
`;

const SocialLink = styled(IconButton)`
  color: inherit;
  transition:
    transform 0.2s ease-in-out,
    color 0.2s ease-in-out;
  will-change: transform, color;

  &:hover {
    transform: scale(1.1);
    color: #fc4a1a;
  }
`;

// Themed Layout Component  
function ThemedLayout({ children, data }) {
  // Remove MUI theme dependency
  return (
    <>
      <GlobalStyles />
      <Header />
      <StyledContainer
        as="main"
        style={{
          marginTop: '64px',
          marginBottom: '32px',
        }}
      >
        {children}
      </StyledContainer>
      <StyledFooter as="footer">
        <StyledContainer>
          <Typography as="h2" variant="h4" gutterBottom>
            Jeff Maxwell
          </Typography>
          <Link
            href="mailto:maxjeffwell@gmail.com"
            underline="always"
            style={{
              fontSize: '1.5rem',
              color: '#052f5f',
              display: 'block',
              marginBottom: '24px',
              textDecorationColor: '#052f5f',
              textDecorationThickness: '2px',
              textUnderlineOffset: '4px',
            }}
            aria-label="Send email to maxjeffwell@gmail.com"
          >
            maxjeffwell@gmail.com
          </Link>
          <StyledBox
            as="nav"
            aria-label="Social media links"
            display="flex"
            gap={2}
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
              <ClientOnlyIcon iconName="GitHub" fontSize="large" />
            </SocialLink>
            <SocialLink
              target="_blank"
              rel="noopener noreferrer"
              href="https://angel.co/maxjeffwell"
              aria-label="Visit Jeff Maxwell's AngelList profile"
              size="large"
            >
              <ClientOnlyIcon iconName="Language" fontSize="large" />
            </SocialLink>
            <SocialLink
              href="tel:+01-508-395-2008"
              aria-label="Call Jeff Maxwell at 508-395-2008"
              size="large"
            >
              <ClientOnlyIcon iconName="Phone" fontSize="large" />
            </SocialLink>
          </StyledBox>
          <Typography variant="body1" align="center" sx={{ mt: 2 }}>
            Built by {data.site.siteMetadata.author}, created with{' '}
            <Link
              href="https://www.gatsbyjs.org"
              target="_blank"
              rel="noopener noreferrer"
              underline="always"
              style={{
                color: '#052f5f',
                textDecorationColor: '#052f5f',
                textUnderlineOffset: '2px',
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
