import React from 'react';
import { Link } from 'gatsby';

import Layout from '../components/layout';

export default () => (
  // eslint-disable-next-line react/jsx-filename-extension
  <Layout>
    <h1>Page 3</h1>
    <Link to="/page-2">Go to page 2</Link>
  </Layout>
);
