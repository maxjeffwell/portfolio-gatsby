import React from 'react';

import Layout from '../components/layout';
import SEO from '../components/seo';

const NotFoundPage = () => (
  // eslint-disable-next-line react/jsx-filename-extension
  <Layout>
    <SEO title="404: Not found" />
    <h1>NOT FOUND</h1>
    {/* eslint-disable-next-line react/no-unescaped-entities */}
    <p>This route doesn't exist. Head back to the home page to start over.</p>
  </Layout>
);

export default NotFoundPage;
