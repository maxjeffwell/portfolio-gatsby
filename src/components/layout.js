import React from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import {
  Box,
  Container,
  Typography,
  Link,
  IconButton,
  useTheme as useMuiTheme,
  GlobalStyles,
} from '@mui/material';
import { GitHub, Phone, Language } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

import Header from './header';
import ThirdPartyScripts from './ThirdPartyScripts';

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

const StyledFooter = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(8),
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  borderTop: `3px solid ${theme.palette.secondary.main}`,
  backgroundColor:
    theme.palette.mode === 'dark'
      ? theme.palette.grey?.[900] || '#212121'
      : theme.palette.grey?.[100] || '#f5f5f5',
}));

const SocialLink = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.primary,
  transition: 'transform 0.2s ease-in-out, color 0.2s ease-in-out',
  willChange: 'transform, color',
  '&:hover': {
    transform: 'scale(1.1)',
    color: theme.palette.primary.main,
  },
}));

// Themed Layout Component
function ThemedLayout({ children, data }) {
  const muiTheme = useMuiTheme();
  return (
    <>
      <ThirdPartyScripts />
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
      <Container
        maxWidth="lg"
        component="main"
        role="main"
        sx={{
          mt: 8,
          mb: 4,
          '@media (max-width: 360px)': {
            mt: 6,
            mb: 3,
            px: 1.5,
          },
        }}
      >
        {children}
      </Container>
      <StyledFooter component="footer" role="contentinfo">
        <Container maxWidth="lg">
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
          <Box
            component="nav"
            aria-label="Social media links"
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'center',
              mb: 3,
            }}
          >
            <SocialLink
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.github.com/maxjeffwell"
              aria-label="Visit Jeff Maxwell's GitHub profile"
              size="large"
            >
              <GitHub fontSize="large" />
            </SocialLink>
            <SocialLink
              target="_blank"
              rel="noopener noreferrer"
              href="https://angel.co/maxjeffwell"
              aria-label="Visit Jeff Maxwell's AngelList profile"
              size="large"
            >
              <Language fontSize="large" />
            </SocialLink>
            <SocialLink
              href="tel:+01-508-395-2008"
              aria-label="Call Jeff Maxwell at 508-395-2008"
              size="large"
            >
              <Phone fontSize="large" />
            </SocialLink>
          </Box>
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
        </Container>
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
  return (
    <StaticQuery
      query={GET_SITE_METADATA}
      render={(data) => <ThemedLayout data={data}>{children}</ThemedLayout>}
    />
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
