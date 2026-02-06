import React from 'react';

// Mock GatsbyImage — renders a plain <img> with the image src
const GatsbyImage = ({ image, alt, className, style, ...rest }) => {
  const src = image?.images?.fallback?.src || image?.src || '';
  return (
    <img
      src={src}
      alt={alt || ''}
      className={className}
      style={{ objectFit: 'cover', ...style }}
      {...rest}
    />
  );
};

// Mock StaticImage — renders a plain <img>
const StaticImage = ({ src, alt, className, style, ...rest }) => (
  <img
    src={src}
    alt={alt || ''}
    className={className}
    style={{ objectFit: 'cover', ...style }}
    {...rest}
  />
);

// Mock getImage — mirrors Gatsby's real behaviour: returns undefined for
// null/undefined input so components can branch on the result.
const getImage = (imageData) => imageData || undefined;

// Mock getSrc
const getSrc = (imageData) => imageData?.images?.fallback?.src || '';

// Mock withArtDirection
const withArtDirection = (image) => image;

export { GatsbyImage, StaticImage, getImage, getSrc, withArtDirection };
