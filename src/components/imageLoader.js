import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { css, keyframes } from '@emotion/react';
import { GatsbyImage } from 'gatsby-plugin-image';
import { supportsWebP, supportsAVIF } from '../utils/imageSupport';

const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`;

const SkeletonLoader = ({ width = '100%', height = '200px' }) => (
  <div
    css={css`
      width: ${width};
      height: ${height};
      background: linear-gradient(90deg, #2d3047 25%, #3d4266 50%, #2d3047 75%);
      background-size: 400% 100%;
      animation: ${shimmer} 1.2s ease-in-out infinite;
      border-radius: 5px;
      border: 2px solid #363636;
    `}
  />
);

const ProgressiveImage = ({
  image,
  alt,
  loading = 'lazy',
  className,
  style,
  onLoad,
  skeletonHeight = '200px',
  enableWebP = true,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [formatSupport, setFormatSupport] = useState({
    webp: false,
    avif: false,
  });

  useEffect(() => {
    if (enableWebP && typeof window !== 'undefined') {
      setFormatSupport({
        webp: supportsWebP(),
        avif: supportsAVIF(),
      });
    }
  }, [enableWebP]);

  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    setHasError(true);
  };

  if (hasError) {
    return (
      <div
        css={css`
          width: 100%;
          height: ${skeletonHeight};
          background-color: #2d3047;
          border: 2px solid #363636;
          border-radius: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #4a4a4a;
          font-family: HelveticaNeueLTStd-Roman, sans-serif;
          font-size: 0.9rem;
        `}
      >
        Image failed to load
      </div>
    );
  }

  return (
    <div
      css={css`
        position: relative;
        width: 100%;
      `}
    >
      {!isLoaded && (
        <div
          css={css`
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 1;
          `}
        >
          <SkeletonLoader height={skeletonHeight} />
        </div>
      )}
      <GatsbyImage
        image={image}
        alt={alt}
        loading={loading}
        className={className}
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
          ...style,
        }}
        onLoad={handleLoad}
        onError={handleError}
        formats={enableWebP ? ['auto', 'webp', 'avif'] : ['auto']}
        {...props}
      />
      {/* Format support indicator for debugging */}
      {process.env.NODE_ENV === 'development' && formatSupport && (
        <div
          css={css`
            position: absolute;
            top: 5px;
            right: 5px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 2px 6px;
            font-size: 10px;
            border-radius: 3px;
            z-index: 1000;
          `}
        >
          {formatSupport.avif ? 'AVIF' : formatSupport.webp ? 'WebP' : 'Legacy'}
        </div>
      )}
    </div>
  );
};

ProgressiveImage.propTypes = {
  image: PropTypes.object.isRequired,
  alt: PropTypes.string.isRequired,
  loading: PropTypes.oneOf(['lazy', 'eager']),
  className: PropTypes.string,
  style: PropTypes.object,
  onLoad: PropTypes.func,
  skeletonHeight: PropTypes.string,
  enableWebP: PropTypes.bool,
};

SkeletonLoader.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
};

export default ProgressiveImage;
export { SkeletonLoader };
