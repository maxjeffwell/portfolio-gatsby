/* eslint-disable prettier/prettier */

import React from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import { Global, css } from '@emotion/core';

import Header from './header';
import SEO from "./seo"

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
        <SEO
          title="Jeff Maxwell Full Stack Developer"
          keywords={[
            `gatsby`,
            `application`,
            `react`,
            `portfolio Site`,
            `API calling`,
            `Axios`,
            `Fetch`,
            `Javascript`,
            `Frontend Developer`,
            `Backend Developer`,
            `Full Stack Developer`
          ]}
        />
        <Global
          styles={css`
          * {
          box-sizing: border-box;
          margin: 0;
          }
          * + * {
          margin-top: 1rem;
          }
          @font-face {
            font-family: LetterGothicStd-Bold;
            font-style: normal;
            font-weight: bold;
            src: url('../../public/fonts/LetterGothicStd-Bold.otf') format('opentype');
          }
          @font-face {
            font-family: LetterGothicStd;
            font-style: normal;
            font-weight: normal;
            src: url('../../public/fonts/LetterGothicStd.otf') format('opentype');
          }
          html, body {
          margin: 0;
          color: #555;
          font-size: 18px;
          line-height: 1.4;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
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
            width: 960px;
           `}
        >
          {children}
        </main>
        <footer
          css={css`
            margin: 2rem auto 4rem;
            max-width: 90vw;
            width: 960px;
           `}
        >
            Built by
          {` `}
          {data.site.siteMetadata.author}
            , created
          {` `}
          {data.site.siteMetadata.createdAt}
          {` `}
          with
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
