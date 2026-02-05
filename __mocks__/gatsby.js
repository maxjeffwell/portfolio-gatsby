const React = require('react');

// Mock Gatsby's Link component
const Link = React.forwardRef(({ to, activeClassName, partiallyActive, ...props }, ref) =>
  React.createElement('a', {
    ...props,
    href: to,
    ref,
  })
);
Link.displayName = 'Link';

// Mock useStaticQuery hook
const useStaticQuery = jest.fn().mockReturnValue({
  site: {
    siteMetadata: {
      title: 'Jeff Maxwell Developer Portfolio',
      description: 'Full Stack Developer specializing in React & Node.js',
      author: 'Jeff Maxwell',
      siteUrl: 'https://el-jefe.me',
      createdAt: '2019-2025',
    },
  },
  social: {
    publicURL: '/images/jeffmaxwell-social.png',
  },
  favicon: {
    publicURL: '/favicon.png',
  },
});

// Mock graphql tagged template literal
const graphql = jest.fn((query) => query);

// Mock StaticQuery component
const StaticQuery = ({ render, children }) => {
  const data = useStaticQuery();
  if (render) return render(data);
  if (children) return children(data);
  return null;
};

// Mock navigate function
const navigate = jest.fn();

// Mock withPrefix
const withPrefix = jest.fn((path) => path);

// Mock GatsbyImage components
const GatsbyImage = jest.fn(({ image, alt, ...props }) =>
  React.createElement('img', {
    ...props,
    alt,
    src: image?.images?.fallback?.src || 'mock-image.jpg',
    'data-testid': 'gatsby-image',
  })
);

const StaticImage = jest.fn(({ src, alt, ...props }) =>
  React.createElement('img', {
    ...props,
    alt,
    src,
    'data-testid': 'static-image',
  })
);

module.exports = {
  Link,
  graphql,
  useStaticQuery,
  StaticQuery,
  navigate,
  withPrefix,
  GatsbyImage,
  StaticImage,
};
