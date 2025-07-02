import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { supportsWebP, supportsAVIF } from '../utils/imageSupport';

const WebPPreloader = ({ criticalImages = [] }) => {
  useEffect(() => {
    if (typeof window === 'undefined' || criticalImages.length === 0) return;

    const preloadImages = async () => {
      const webpSupported = supportsWebP();
      const avifSupported = await supportsAVIF();

      criticalImages.forEach((imageData) => {
        if (!imageData?.images?.sources) return;

        // Preload the best format available
        let urlToPreload = null;
        let imageType = null;

        if (avifSupported && imageData.images.sources.avif) {
          urlToPreload = imageData.images.sources.avif.src;
          imageType = 'image/avif';
        } else if (webpSupported && imageData.images.sources.webp) {
          urlToPreload = imageData.images.sources.webp.src;
          imageType = 'image/webp';
        } else if (imageData.images.fallback) {
          urlToPreload = imageData.images.fallback.src;
          imageType = 'image/jpeg'; // Default fallback type
        }

        if (urlToPreload) {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = urlToPreload;
          if (imageType) link.type = imageType;

          // Add responsive preloading
          if (imageData.images.sources?.webp?.srcSet) {
            link.imageSrcset = imageData.images.sources.webp.srcSet;
          }

          document.head.appendChild(link);
        }
      });
    };

    preloadImages();
  }, [criticalImages]);

  // Also add preload hints in the document head
  return (
    <Helmet>
      {criticalImages.map((imageData, index) => {
        if (!imageData?.images?.sources) return null;

        const webpSrc = imageData.images.sources.webp?.src;
        const avifSrc = imageData.images.sources.avif?.src;

        return (
          <React.Fragment key={`preload-${index}`}>
            {avifSrc && <link rel="preload" as="image" href={avifSrc} type="image/avif" />}
            {webpSrc && !avifSrc && (
              <link rel="preload" as="image" href={webpSrc} type="image/webp" />
            )}
          </React.Fragment>
        );
      })}

      {/* Add format support hints for browsers */}
      <meta name="format-detection" content="webp=yes" />
      <meta name="format-detection" content="avif=yes" />
    </Helmet>
  );
};

export default WebPPreloader;
