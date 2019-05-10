import React from 'react';
import { Link } from 'gatsby';

import Layout from '../components/layout';
import Image from '../components/image';
import SEO from '../components/seo';

const IndexPage = () => (
  // eslint-disable-next-line react/jsx-filename-extension
  <Layout>
    <SEO title="Home" keywords={['gatsby', 'application', 'react']} />
    <Image />
    <Link to="/page-2/">Go to page 2</Link>
  </Layout>
);

export default IndexPage;
