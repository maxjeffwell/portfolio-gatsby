import React from 'react';
import { Link } from 'gatsby';

import Layout from '../components/layout';
import Image from '../components/image';
import SEO from '../components/seo';

const IndexPage = () => (
  // eslint-disable-next-line react/jsx-filename-extension
  <Layout>
    <SEO title="Home" keywords={['gatsby', 'application', 'react']} />
    {/* eslint-disable-next-line react/no-unescaped-entities */}
    <h3>My name's Jeff. I'm a full stack web developer working with Node and React.</h3>
    <p>
      I commit early and often, implement content-driven design strategies, and value readable,
      shareable code.
    </p>
    {/* eslint-disable-next-line react/no-unescaped-entities */}
    <p>Right now, I'm making myself familiar with GraphQL, React Hooks, and Gatsby.</p>
    <Link to="/projects/">Click here for a brief list my most recent projects</Link>
    <Image />
    <p>I have a fondness for small dogs and old-school internet (namely the immortal Usenet).</p>
    <Link to="/about/">
      {/* eslint-disable-next-line react/no-unescaped-entities */}
      Check out an artist's rendering of my two sidekicks and coding companions
    </Link>
  </Layout>
);

export default IndexPage;
