import React from 'react';
import { Link } from 'gatsby';
import { Container, Typography, Button, Box } from '@mui/material';
import { Home } from '@mui/icons-material';

import Layout from '../components/layout';
import SEO from '../components/seo';

function NotFoundPage() {
  return (
    <Layout>
      <SEO title="404: Not found" />
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h1" component="h1" gutterBottom>
            404: Page Not Found
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            paragraph
            sx={{ fontSize: '1.125rem' }}
          >
            This route doesn&apos;t exist. Head back to the home page to start over.
          </Typography>
          <Button
            component={Link}
            to="/"
            variant="contained"
            color="primary"
            startIcon={<Home />}
            sx={{ mt: 2 }}
          >
            Go Home
          </Button>
        </Box>
      </Container>
    </Layout>
  );
}

export default NotFoundPage;
