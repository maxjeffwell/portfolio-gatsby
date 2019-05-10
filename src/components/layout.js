/* eslint-disable prettier/prettier */
import React from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import { Global, css } from '@emotion/core';

import Header from './header';

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

const Layout = ({ children }) => (
  // eslint-disable-next-line react/jsx-filename-extension
  <StaticQuery
    query={GET_SITE_METADATA}
    render={data => (
      <>
        <Global
          styles={css`
          * {
          box-sizing: border-box;
          margin: 0;
          }
          * + * {
          margin-top: 1rem;
          }
          html, body {
          margin: 0;
          color: #555;
          font-family: Roboto, Helvetica, sans-serif;
          font-size: 18px;
          line-height: 1.4;
          }
          /*remove margin for main div that Gatsby mounts into */
          > div {
          margin-top: 0;
          }
          h1, h2, h3, h4. h5, h6 {
           color: #222;
           line-height: 1.1;
           + * {
           margin-top: .5rem;
           }
          }
          strong {
          color: #222;
          }
        `}
        />
        <Header />
        <main
          css={css`
            margin: 2rem auto 4rem;
            max-width: 90vw;
            width: 550px;
           `}
        >
          {children}
        </main>
        <footer
          css={css`
            margin: 2rem auto 4rem;
            max-width: 90vw;
            width: 550px;
           `}
        >
            Built by
          {data.site.siteMetadata.author}
            , created
          {` `}
          {data.site.siteMetadata.createdAt}
          {` `}
          <a href="https://www.gatsbyjs.org">Gatsby</a>
        </footer>
      </>
    )}
  />
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
