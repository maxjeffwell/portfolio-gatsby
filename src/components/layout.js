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
            font-kerning: normal;
            -moz-font-feature-settings: "kern", "liga", "clig", "calt";
           -ms-font-feature-settings: "kern", "liga", "clig", "calt";
            -webkit-font-feature-settings: "kern", "liga", "clig", "calt";
            font-feature-settings: "kern", "liga", "clig", "calt";
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            -ms-text-size-adjust: 100%;
            -webkit-text-size-adjust: 100%;
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
          a {
           background-color: transparent;
           -webkit-text-decoration-skip: objects;
          }
          a:active, a:hover {
           outline-width: 0;
          }
          img {
           border-style: none;
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
           display: grid;
           grid-template-columns: 1fr 1fr;
           grid-template-rows: 1fr;
           padding: 0.5rem calc((100vw - 960px - 0.5rem) / 2);
           background-color: #000;
           color: #fff;
          `}
        >
          <h3>Jeff Maxwell</h3>
          <a
            css={css`
             color: blueviolet;
             grid-column: 1 / 2;
            `}
            href="mailto:maxjeffwell@gmail.com"
          >
            maxjeffwell@gmail.com
          </a>
          <p
            css={css`
             grid-column: 1 / 2;
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
            <a href="https://www.gatsbyjs.org">
              <span
                css={css`
                 color: blueviolet;
                `}
              >
              Gatsby
              </span>
            </a>
          </p>
        </footer>
      </>
    )}
  />
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
