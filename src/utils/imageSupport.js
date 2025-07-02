// WebP and AVIF format detection utilities

export const supportsWebP = () => {
  if (typeof window === 'undefined') return false;

  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;

  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
};

export const supportsAVIF = () => {
  if (typeof window === 'undefined') return false;

  return new Promise((resolve) => {
    const avif = new Image();
    avif.onload = () => resolve(true);
    avif.onerror = () => resolve(false);
    avif.src =
      'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
  });
};

export const getOptimalImageFormat = () => {
  if (typeof window === 'undefined') return 'auto';

  // Check for AVIF support first (best compression)
  if (supportsAVIF()) return 'avif';

  // Fall back to WebP (good compression, wide support)
  if (supportsWebP()) return 'webp';

  // Fall back to browser default (usually JPEG/PNG)
  return 'auto';
};

export const preloadCriticalImages = (imageUrls) => {
  if (typeof window === 'undefined') return;

  imageUrls.forEach((url) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;

    // Add WebP/AVIF type hints if supported
    if (url.includes('.webp')) {
      link.type = 'image/webp';
    } else if (url.includes('.avif')) {
      link.type = 'image/avif';
    }

    document.head.appendChild(link);
  });
};

export const createPictureElement = (sources, alt, className = '') => {
  if (typeof window === 'undefined') return null;

  const picture = document.createElement('picture');

  // Add AVIF source if available
  if (sources.avif) {
    const avifSource = document.createElement('source');
    avifSource.srcset = sources.avif;
    avifSource.type = 'image/avif';
    picture.appendChild(avifSource);
  }

  // Add WebP source if available
  if (sources.webp) {
    const webpSource = document.createElement('source');
    webpSource.srcset = sources.webp;
    webpSource.type = 'image/webp';
    picture.appendChild(webpSource);
  }

  // Add fallback img element
  const img = document.createElement('img');
  img.src = sources.fallback || sources.auto;
  img.alt = alt;
  img.className = className;
  picture.appendChild(img);

  return picture;
};
