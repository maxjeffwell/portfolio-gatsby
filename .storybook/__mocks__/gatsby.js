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

// Mock useStaticQuery — returns empty data by default
const useStaticQuery = () => ({
  site: {
    siteMetadata: {
      title: 'Jeff Maxwell — Developer Portfolio',
      description: 'Full-stack developer portfolio',
      author: 'Jeff Maxwell',
    },
  },
});

// Mock StaticQuery component
const StaticQuery = ({ render }) =>
  render({
    site: {
      siteMetadata: {
        title: 'Jeff Maxwell — Developer Portfolio',
        description: 'Full-stack developer portfolio',
        author: 'Jeff Maxwell',
      },
    },
  });

export { Link, navigate, graphql, useStaticQuery, StaticQuery };
export default { Link, navigate, graphql, useStaticQuery, StaticQuery };
