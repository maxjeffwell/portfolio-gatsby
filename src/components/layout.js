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
              font-family: HelveticaNeueLTStd-Bd;
              font-style: normal;
              font-weight: bold;
              src: url('../../public/fonts/HelveticaNeueLTStd-Bd.otf') format('opentype');
            }
            @font-face {
              font-family: HelveticaNeueLTStd-Roman;
              font-style: normal;
              font-weight: normal;
              src: url('../../public/fonts/HelveticaNeueLTStd-Roman.otf') format('opentype');
            }
            @font-face {
              font-family: AvenirLTStd-Roman;
              font-style: normal;
              font-weight: normal;
              src: url('../../public/fonts/AvenirLTStd-Roman.otf') format('opentype');
            }
            @font-face {
              font-family: SabonLTStd-Roman;
              font-style: normal;
              font-weight: normal;
              src: url('../../public/fonts/SabonLTStd-Roman.otf') format('opentype');
            }
            html,
            body {
              margin: 0;
              color: #fc4a1a;
              background-color: #052f5f;
              font-size: 18px;
              line-height: 1.4;
              font-kerning: normal;
              font-feature-settings: 'kern', 'liga', 'clig', 'calt';
              -moz-font-feature-settings: 'kern', 'liga', 'clig', 'calt';
              -ms-font-feature-settings: 'kern', 'liga', 'clig', 'calt';
              -webkit-font-feature-settings: 'kern', 'liga', 'clig', 'calt';
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
              -ms-text-size-adjust: 100%;
              -webkit-text-size-adjust: 100%;
            }
            /*remove margin for main div that Gatsby mounts into */
            > div {
              margin-top: 0;
            }
            h1,
            h2,
            h3,
            h4. h5,
            h6 {
              line-height: 1.1;
              + * {
                margin-top: 0.5rem;
              }
            }
            a {
              background-color: transparent;
              -webkit-text-decoration-skip: objects;
            }
            a:active,
            a:hover {
              outline-width: 0;
            }
            img {
              border-style: none;
              &:nth-of-type(2) {
                margin-top: 0;
              }
            }
            button {
              background-color: #f7b733;
              height: fit-content;
              width: fit-content;
              border: 2px solid #363636;
              border-radius: 5px;
              color: #393939;
              cursor: pointer;
              &:hover {
                box-shadow: 0 12px 16px 0 rgba(0, 0, 0, 0.25), 0 17px 50px 0 rgba(0, 0, 0, 0.19);
              }
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
            grid-template-columns: 1fr;
            grid-template-rows: 0.1fr 0.1fr auto;
            padding: 0.5rem calc((100vw - 960px - 0.5rem) / 2);
            background-color: #121619;
            font-family: AvenirLTStd-Roman, sans-serif;
            font-size: 1.25rem;
            color: #f5f5f5;
            height: 100%;
          `}
        >
          <h3>Jeff Maxwell</h3>
          <a
            css={css`
              color: #f7b733;
              grid-column: 1 / 2;
              text-decoration: none;
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
            <a
              css={css`
                text-decoration: none;
              `}
              href="https://www.gatsbyjs.org"
            >
              <span
                css={css`
                  color: #f7b733;
                `}
              >
                Gatsby.
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
