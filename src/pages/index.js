import React from 'react';
import { Link } from 'gatsby';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

import Layout from '../components/layout';
import SEO from '../components/seo';

const StyledLink = styled(Link)`
  color: #fc4a1a;
  text-decoration: none;
`;

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
    <p
      css={css`
        color: #ffffff;
      `}
    >
      I commit early and often, implement content-driven design strategies, and value readable,
      maintainable code.
    </p>
    {/* eslint-disable-next-line react/no-unescaped-entities */}
    <p
      css={css`
        color: #ffffff;
      `}
    >
      {/* eslint-disable-next-line react/no-unescaped-entities */}
      Right now, I'm familiarizing myself with GraphQL, React Hooks, and Gatsby.
    </p>
    <StyledLink to="/projects/">Click here for a brief list my most recent projects.</StyledLink>
    <p
      css={css`
        color: #ffffff;
      `}
    >
      {/* eslint-disable-next-line react/no-unescaped-entities */}
      When I'm not inceptioning myself in the dev tool's component tree or attempting to bend CSS
      Grid to my will, I can be found either skillfully arbitrating the dinner menu selection with
      my two dogs or scouring Usenet in remembrance of Internet things past.
    </p>
    <StyledLink to="/about/">
      {/* eslint-disable-next-line react/no-unescaped-entities */}
      Click here to check out a rendering of my two sidekicks and the mascot that make up my
      development team.
    </StyledLink>
  </Layout>
);

export default IndexPage;
