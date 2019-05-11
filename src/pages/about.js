import React from 'react';

import Layout from '../components/layout';
import SEO from '../components/seo';

const SecondPage = () => (
  // eslint-disable-next-line react/jsx-filename-extension
  <Layout>
    <SEO title="Page two" />
    <p>Hi from the second page</p>
  </Layout>
);

export default SecondPage;
