/* eslint-disable prettier/prettier */
import React from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import { Global, css } from '@emotion/react';
import { HelmetProvider } from 'react-helmet-async';
import { FaGithubAlt, FaAngellist, FaLinkedin, FaPhone } from 'react-icons/fa';
import WebPPreloader from './webpPreloader';
import { ThemeProvider, useTheme } from '../context/ThemeContext';

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

// Themed Layout Component
const ThemedLayout = ({ children, data }) => {
  const { theme } = useTheme();

  return (
    <>
      <WebPPreloader />
      <Global
        styles={css`
          * {
            box-sizing: border-box;
            margin: 0;
          }
          html,
          body {
            margin: 0;
            color: ${theme.colors.accent};
            background-color: ${theme.colors.primary};
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
            transition:
              background-color ${theme.transitions.normal},
              color ${theme.transitions.normal};
            @media (max-width: 480px) {
              overflow-x: hidden;
            }
          }
          /*remove margin for main div that Gatsby mounts into */
          > div {
            margin-top: 0;
          }
          h1,
          h2,
          h3,
          h4,
          h5,
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
            border-radius: 5px;
            &:nth-of-type(2) {
              margin-top: 0;
            }
            &:-moz-loading {
              visibility: hidden;
            }
          }
          /* Progressive loading and performance optimizations */
          [data-gatsby-image-wrapper] {
            /* Ensure smooth transitions for all Gatsby images */
            transition: opacity 0.3s ease-in-out;
          }
          /* Preload critical images */
          .critical-image {
            loading: eager !important;
          }
          /* Lazy load non-critical images */
          .lazy-image {
            loading: lazy !important;
          }
          /* Screen reader only content */
          .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
          }
          button {
            background-color: ${theme.colors.accentSecondary};
            height: fit-content;
            width: fit-content;
            border: 2px solid ${theme.colors.border};
            border-radius: 5px;
            color: ${theme.colors.textInverse};
            cursor: pointer;
            transition: all ${theme.transitions.normal};
            &:hover {
              box-shadow: ${theme.shadows.hover};
              transform: translateY(-2px);
            }
            &:focus {
              outline: 2px solid ${theme.colors.accentSecondary};
              outline-offset: 2px;
            }
          }
        `}
      />
      <Header />
      <main
        css={css`
          margin: 2rem auto 2rem;
          max-width: 90vw;
          width: 960px;
        `}
      >
        {children}
      </main>
      <footer
        role="contentinfo"
        css={css`
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          grid-template-rows: 0.1fr 0.1fr 0.15fr 0.1fr;
          grid-column-gap: 1rem;
          grid-row-gap: 2rem;
          padding: 0.5rem calc((100vw - 960px - 0.5rem) / 2);
          font-family: AvenirLTStd-Roman, sans-serif;
          font-size: 1.25rem;
          color: ${theme.colors.textSecondary};
          margin-top: 4rem;
          border-top: 3px solid ${theme.colors.accentSecondary};
          background-color: ${theme.colors.tertiary};
          @media (max-width: 1000px) {
            padding-left: 1rem;
            padding-right: 1rem;
          }
        `}
      >
        <h2
          css={css`
            grid-column: 1 / 5;
            grid-row: 1 / 2;
            margin-top: 1rem;
            font-size: 2.25rem;
            align-self: end;
          `}
        >
          Jeff Maxwell
        </h2>
        <a
          css={css`
            color: ${theme.colors.accentSecondary};
            font-size: 2rem;
            grid-column: 1 / -1;
            grid-row: 2 / 3;
            text-decoration: none;
            transition: color ${theme.transitions.normal};
            &:hover {
              color: ${theme.colors.text};
            }
            &:focus {
              outline: 2px solid ${theme.colors.accentSecondary};
              outline-offset: 2px;
            }
            @media (max-width: 480px) {
              font-size: 1.75rem;
            }
            @media (max-width: 360px) {
              font-size: 1.5rem;
            }
          `}
          href="mailto:maxjeffwell@gmail.com"
          aria-label="Send email to maxjeffwell@gmail.com"
        >
          maxjeffwell@gmail.com
        </a>
        <nav
          aria-label="Social media links"
          css={css`
            grid-row: 3 / 4;
            grid-column: 1 / 5;
            display: contents;
          `}
        >
          <a
            css={css`
              grid-row: 3 / 4;
              grid-column: 1 / 2;
              justify-self: center;
              &:focus {
                outline: 2px solid ${theme.colors.accentSecondary};
                outline-offset: 2px;
                border-radius: 4px;
              }
            `}
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.github.com/maxjeffwell"
            aria-label="Visit Jeff Maxwell's GitHub profile"
          >
            <FaGithubAlt
              css={css`
                color: ${theme.colors.accent};
                font-size: 3.5rem;
                transition: transform 0.2s ease-in-out;
                &:hover {
                  transform: scale(1.1);
                }
                @media (max-width: 480px) {
                  font-size: 3rem;
                }
              `}
              aria-hidden="true"
            />
          </a>
          <a
            css={css`
              grid-row: 3 / 4;
              grid-column: 2 / 3;
              justify-self: center;
              &:focus {
                outline: 2px solid ${theme.colors.accentSecondary};
                outline-offset: 2px;
                border-radius: 4px;
              }
            `}
            target="_blank"
            rel="noopener noreferrer"
            href="https://angel.co/maxjeffwell"
            aria-label="Visit Jeff Maxwell's AngelList profile"
          >
            <FaAngellist
              css={css`
                color: ${theme.colors.accent};
                font-size: 3.5rem;
                transition: transform 0.2s ease-in-out;
                &:hover {
                  transform: scale(1.1);
                }
                @media (max-width: 480px) {
                  font-size: 3rem;
                }
              `}
              aria-hidden="true"
            />
          </a>
          <a
            css={css`
              grid-row: 3 / 4;
              grid-column: 3 / 4;
              justify-self: center;
              &:focus {
                outline: 2px solid ${theme.colors.accentSecondary};
                outline-offset: 2px;
                border-radius: 4px;
              }
            `}
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.linkedin.com/in/jeffrey-maxwell-553176172"
            aria-label="Visit Jeff Maxwell's LinkedIn profile"
          >
            <FaLinkedin
              css={css`
                color: ${theme.colors.accent};
                font-size: 3.5rem;
                transition: transform 0.2s ease-in-out;
                &:hover {
                  transform: scale(1.1);
                }
                @media (max-width: 480px) {
                  font-size: 3rem;
                }
              `}
              aria-hidden="true"
            />
          </a>
          <a
            css={css`
              grid-row: 3 / 4;
              grid-column: 4 / 5;
              justify-self: center;
              &:focus {
                outline: 2px solid ${theme.colors.accentSecondary};
                outline-offset: 2px;
                border-radius: 4px;
              }
            `}
            href="tel:+01-508-395-2008"
            aria-label="Call Jeff Maxwell at 508-395-2008"
          >
            <FaPhone
              css={css`
                color: ${theme.colors.accent};
                font-size: 3.5rem;
                transition: transform 0.2s ease-in-out;
                &:hover {
                  transform: scale(1.1);
                }
                @media (max-width: 480px) {
                  font-size: 3rem;
                }
              `}
              aria-hidden="true"
            />
          </a>
        </nav>
        <p
          css={css`
            grid-column: 1 / -1;
            grid-row: 4 / 5;
            margin-bottom: 1rem;
            font-size: 1.5rem;
          `}
        >
          Built by
          {` `}
          {data.site.siteMetadata.author}, created
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
            target="_blank"
            rel="noopener noreferrer"
          >
            <span
              css={css`
                color: ${theme.colors.accentSecondary};
              `}
            >
              Gatsby
            </span>
          </a>
          .
        </p>
      </footer>
    </>
  );
};

ThemedLayout.propTypes = {
  children: PropTypes.node.isRequired,
  data: PropTypes.object.isRequired,
};

// Main Layout Component with Theme Provider
const Layout = ({ children }) => (
  <ThemeProvider>
    <HelmetProvider>
      <StaticQuery
        query={GET_SITE_METADATA}
        render={(data) => <ThemedLayout data={data}>{children}</ThemedLayout>}
      />
    </HelmetProvider>
  </ThemeProvider>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
