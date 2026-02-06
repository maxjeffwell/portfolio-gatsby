import React from 'react';

// Mock GatsbyImage — renders a plain <img> with the image src
const GatsbyImage = ({ image, alt, className, style, ...rest }) => {
  const src = image?.images?.fallback?.src || image?.src || 'https://via.placeholder.com/600x400';
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

// Mock getImage — returns the image data object as-is (or a fallback)
const getImage = (imageData) => imageData || {
  images: { fallback: { src: 'https://via.placeholder.com/600x400' } },
  width: 600,
  height: 400,
  layout: 'constrained',
};

// Mock getSrc
const getSrc = (imageData) => imageData?.images?.fallback?.src || 'https://via.placeholder.com/600x400';

// Mock withArtDirection
const withArtDirection = (image) => image;

export { GatsbyImage, StaticImage, getImage, getSrc, withArtDirection };
