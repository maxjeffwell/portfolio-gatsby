import React from 'react';
import { Link } from 'gatsby';

import Layout from '../components/layout';
import SEO from '../components/seo';

const IndexPage = () => (
  // eslint-disable-next-line react/jsx-filename-extension
  <Layout>
    <SEO
      title="Jeff Maxwell Full Stack Developer"
      keywords={[
        `gatsby`,
        `application`,
        `react`,
        `portfolio Site`,
        `Javascript`,
        `Frontend Developer`,
        `Backend Developer`,
        `Full Stack Developer`,
      ]}
    />
    {/* eslint-disable-next-line react/no-unescaped-entities */}
    <h1>My name's Jeff. I'm a full stack web developer working with Node and React.</h1>
    <p>
      I commit early and often, implement content-driven design strategies, and value the tenacity
      required to produce readable, maintainable code.
    </p>
    {/* eslint-disable-next-line react/no-unescaped-entities */}
    <p>Right now, I'm making myself familiar with GraphQL, React Hooks, and Gatsby.</p>
    <Link to="/projects/">Click here for a brief list my most recent projects</Link>
    <p>I have a fondness for small dogs and old-school internet (namely the immortal Usenet).</p>
    <Link to="/about/">
      {/* eslint-disable-next-line react/no-unescaped-entities */}
      Check out an artist's rendering of my two sidekicks and coding companions
    </Link>
  </Layout>
);

export default IndexPage;
