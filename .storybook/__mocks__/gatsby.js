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

// SVG icons are served from staticDirs: src/images → /images
const ICON = (name) => `/images/svg-icons/${name}`;

// Placeholder for raster images (logo, social, favicon, team photos)
const IMG_PLACEHOLDER = 'https://via.placeholder.com/600x400';

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
  file: { publicURL: '/images/elephant_noun_project.png' },
  // seo.js
  social: { publicURL: IMG_PLACEHOLDER },
  favicon: { publicURL: '/favicon.ico' },
  // image.js — GatsbyImage data
  teamImage: { childImageSharp: { gatsbyImageData: { images: { fallback: { src: IMG_PLACEHOLDER } }, width: 800, height: 800, layout: 'constrained' } } },
  teamImage2: { childImageSharp: { gatsbyImageData: { images: { fallback: { src: IMG_PLACEHOLDER } }, width: 800, height: 800, layout: 'constrained' } } },
  teamImage3: { childImageSharp: { gatsbyImageData: { images: { fallback: { src: IMG_PLACEHOLDER } }, width: 800, height: 800, layout: 'constrained' } } },
  // ClientOnlyIconInternal.js — all SVG icon queries
  github: { publicURL: ICON('github.svg') },
  wellfound: { publicURL: ICON('wellfound.svg') },
  phone: { publicURL: ICON('phone.svg') },
  gatsby: { publicURL: ICON('gatsby_logo.svg') },
  arrowForward: { publicURL: ICON('arrow_forward.svg') },
  computer: { publicURL: ICON('computer.svg') },
  checkCircle: { publicURL: ICON('check-circle.svg') },
  paws: { publicURL: ICON('paws.svg') },
  codeTerminal: { publicURL: ICON('code-terminal.svg') },
  coffee: { publicURL: ICON('coffee.svg') },
  dog: { publicURL: ICON('dog.svg') },
  darkModeToggle: { publicURL: ICON('dark_mode_toggle.svg') },
  email: { publicURL: ICON('email.svg') },
  githubCharacter: { publicURL: ICON('github_character.svg') },
  telephone: { publicURL: ICON('telephone.svg') },
  burger: { publicURL: ICON('burger.svg') },
  sourceCode: { publicURL: ICON('source_code.svg') },
  twitter: { publicURL: ICON('twitter.svg') },
  linkedin: { publicURL: ICON('linkedin.svg') },
  facebook: { publicURL: ICON('facebook.svg') },
  reddit: { publicURL: ICON('reddit.svg') },
  send: { publicURL: ICON('send.svg') },
  done: { publicURL: ICON('done.svg') },
  react: { publicURL: ICON('react.svg') },
  nodejs: { publicURL: ICON('nodejs.svg') },
};

// Mock useStaticQuery — returns superset of all component data shapes
const useStaticQuery = () => staticQueryData;

// Mock StaticQuery component
const StaticQuery = ({ render }) => render(staticQueryData);

export { Link, navigate, graphql, useStaticQuery, StaticQuery };
export default { Link, navigate, graphql, useStaticQuery, StaticQuery };
