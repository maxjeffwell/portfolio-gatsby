import React from 'react';
import PropTypes from 'prop-types';
import { useStaticQuery, graphql } from 'gatsby';
import {
  Typography,
  Link,
  IconButton,
  useTheme as useMuiTheme,
  GlobalStyles,
  NoSsr,
} from '@mui/material';
import { GitHub, Phone, Language } from '@mui/icons-material';
import styled from '@emotion/styled';

import Header from './header';
import ThirdPartyScripts from './ThirdPartyScripts';
import CustomGlobalStyles from './GlobalStyles';

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

const StyledBox = styled.div.withConfig({
  shouldForwardProp: (prop) => !['display', 'flexDirection', 'gap', 'justifyContent', 'mb', 'mt', 'p', 'pl', 'pr', 'pt', 'pb'].includes(prop),
})`
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
  const muiTheme = useMuiTheme();
  return (
    <>
      <NoSsr>
        <ThirdPartyScripts />
      </NoSsr>
      <CustomGlobalStyles />
      <GlobalStyles
        styles={{
          '*': {
            fontDisplay: 'swap',
          },
          body: {
            overflowX: 'hidden',
          },
          '[data-gatsby-image-wrapper]': {
            willChange: 'auto',
          },
          '.gatsby-image-wrapper': {
            willChange: 'auto',
          },
        }}
      />
      <Header />
      <StyledContainer
        component="main"
        style={{
          marginTop: '64px',
          marginBottom: '32px',
        }}
      >
        {children}
      </StyledContainer>
      <StyledFooter component="footer">
        <StyledContainer>
          <Typography variant="h4" component="h2" gutterBottom>
            Jeff Maxwell
          </Typography>
          <Link
            href="mailto:maxjeffwell@gmail.com"
            underline="always"
            sx={{
              fontSize: '1.5rem',
              color: muiTheme.palette.secondary.main,
              display: 'block',
              mb: 3,
              textDecorationColor: muiTheme.palette.secondary.main,
              textDecorationThickness: '2px',
              textUnderlineOffset: '4px',
              '&:hover': {
                color: muiTheme.palette.primary.main,
                textDecorationColor: muiTheme.palette.primary.main,
              },
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
            <NoSsr>
              <SocialLink
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.github.com/maxjeffwell"
                aria-label="Visit Jeff Maxwell's GitHub profile"
                size="large"
              >
                <GitHub fontSize="large" />
              </SocialLink>
            </NoSsr>
            <NoSsr>
              <SocialLink
                target="_blank"
                rel="noopener noreferrer"
                href="https://angel.co/maxjeffwell"
                aria-label="Visit Jeff Maxwell's AngelList profile"
                size="large"
              >
                <Language fontSize="large" />
              </SocialLink>
            </NoSsr>
            <NoSsr>
              <SocialLink
                href="tel:+01-508-395-2008"
                aria-label="Call Jeff Maxwell at 508-395-2008"
                size="large"
              >
                <Phone fontSize="large" />
              </SocialLink>
            </NoSsr>
          </StyledBox>
          <Typography variant="body1" align="center" sx={{ mt: 2 }}>
            Built by {data.site.siteMetadata.author}, created with{' '}
            <Link
              href="https://www.gatsbyjs.org"
              target="_blank"
              rel="noopener noreferrer"
              underline="always"
              sx={{
                color: muiTheme.palette.secondary.main,
                textDecorationColor: muiTheme.palette.secondary.main,
                textUnderlineOffset: '2px',
                '&:hover': {
                  textDecorationThickness: '2px',
                },
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
