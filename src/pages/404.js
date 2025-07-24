import React from 'react';

import Layout from '../components/layout';
import SEO from '../components/seo';

function NotFoundPage() {
  return (
    <Layout>
      <SEO title="404: Not found" />
      <h1>NOT FOUND</h1>
      <p>This route doesn&apos;t exist. Head back to the home page to start over.</p>
    </Layout>
  );
}

export default NotFoundPage;
