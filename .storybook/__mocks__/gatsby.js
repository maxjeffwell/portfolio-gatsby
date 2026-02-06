import React from 'react';

// Mock Gatsby's Link component — renders a standard <a> tag
const Link = React.forwardRef(({ to, activeClassName, activeStyle, partiallyActive, ...rest }, ref) => (
  <a href={to} ref={ref} {...rest} />
));
Link.displayName = 'GatsbyLink';

// Mock navigate function
const navigate = (to) => {
  window.location.hash = to;
};

// Mock graphql tagged template literal — returns the query string as-is
const graphql = (strings, ...args) =>
  strings.reduce((result, str, i) => result + str + (args[i] || ''), '');

// Placeholder publicURL used for all file queries (SVGs, images, etc.)
const PLACEHOLDER = 'https://via.placeholder.com/60';

// Superset of every data shape that any useStaticQuery caller expects.
// Each component destructures only the fields it needs:
//   myLogo.js        → data.file.publicURL
//   seo.js           → data.social.publicURL, data.favicon.publicURL
//   image.js         → data.teamImage / teamImage2 / teamImage3
//   ClientOnlyIcon   → data.github, data.burger, data.darkModeToggle, etc.
//   layout.js        → data.site.siteMetadata
const staticQueryData = {
  site: {
    siteMetadata: {
      title: 'Jeff Maxwell — Developer Portfolio',
      description: 'Full-stack developer portfolio',
      author: 'Jeff Maxwell',
      siteUrl: 'https://jeffmaxwell.dev',
    },
  },
  // myLogo.js — file(relativePath: "elephant_noun_project.png")
  file: { publicURL: PLACEHOLDER },
  // seo.js
  social: { publicURL: PLACEHOLDER },
  favicon: { publicURL: PLACEHOLDER },
  // image.js — GatsbyImage data
  teamImage: { childImageSharp: { gatsbyImageData: { images: { fallback: { src: PLACEHOLDER } }, width: 800, height: 800, layout: 'constrained' } } },
  teamImage2: { childImageSharp: { gatsbyImageData: { images: { fallback: { src: PLACEHOLDER } }, width: 800, height: 800, layout: 'constrained' } } },
  teamImage3: { childImageSharp: { gatsbyImageData: { images: { fallback: { src: PLACEHOLDER } }, width: 800, height: 800, layout: 'constrained' } } },
  // ClientOnlyIconInternal.js — all SVG icon queries
  github: { publicURL: PLACEHOLDER },
  wellfound: { publicURL: PLACEHOLDER },
  phone: { publicURL: PLACEHOLDER },
  gatsby: { publicURL: PLACEHOLDER },
  arrowForward: { publicURL: PLACEHOLDER },
  computer: { publicURL: PLACEHOLDER },
  checkCircle: { publicURL: PLACEHOLDER },
  paws: { publicURL: PLACEHOLDER },
  codeTerminal: { publicURL: PLACEHOLDER },
  coffee: { publicURL: PLACEHOLDER },
  dog: { publicURL: PLACEHOLDER },
  darkModeToggle: { publicURL: PLACEHOLDER },
  email: { publicURL: PLACEHOLDER },
  githubCharacter: { publicURL: PLACEHOLDER },
  telephone: { publicURL: PLACEHOLDER },
  burger: { publicURL: PLACEHOLDER },
  sourceCode: { publicURL: PLACEHOLDER },
  twitter: { publicURL: PLACEHOLDER },
  linkedin: { publicURL: PLACEHOLDER },
  facebook: { publicURL: PLACEHOLDER },
  reddit: { publicURL: PLACEHOLDER },
  send: { publicURL: PLACEHOLDER },
  done: { publicURL: PLACEHOLDER },
  react: { publicURL: PLACEHOLDER },
  nodejs: { publicURL: PLACEHOLDER },
};

// Mock useStaticQuery — returns superset of all component data shapes
const useStaticQuery = () => staticQueryData;

// Mock StaticQuery component
const StaticQuery = ({ render }) => render(staticQueryData);

export { Link, navigate, graphql, useStaticQuery, StaticQuery };
export default { Link, navigate, graphql, useStaticQuery, StaticQuery };
