import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { useStaticQuery, graphql } from 'gatsby';

function SEO({ description, lang, meta, keywords, title, image, pathname, article }) {
  const { site } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          description
          author
          siteUrl
        }
      }
    }
  `);

  const metaDescription = description || site.siteMetadata.description;
  const metaTitle = title ? `${title} | ${site.siteMetadata.title}` : site.siteMetadata.title;
  const metaImage = image
    ? `${site.siteMetadata.siteUrl}${image}`
    : `${site.siteMetadata.siteUrl}/icons/icon-512x512.png`;
  const metaUrl = `${site.siteMetadata.siteUrl}${pathname || ''}`;
  const canonical = `${site.siteMetadata.siteUrl}${pathname || ''}`;

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={metaTitle}
      meta={[
        // Basic meta tags
        {
          name: `description`,
          content: metaDescription,
        },
        {
          name: `author`,
          content: site.siteMetadata.author,
        },
        {
          name: `viewport`,
          content: `width=device-width, initial-scale=1`,
        },

        // Open Graph
        {
          property: `og:title`,
          content: metaTitle,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: article ? `article` : `website`,
        },
        {
          property: `og:url`,
          content: metaUrl,
        },
        {
          property: `og:site_name`,
          content: site.siteMetadata.title,
        },

        // Twitter Card
        {
          name: `twitter:card`,
          content: metaImage ? `summary_large_image` : `summary`,
        },
        {
          name: `twitter:creator`,
          content: site.siteMetadata.author,
        },
        {
          name: `twitter:title`,
          content: metaTitle,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },

        // Additional SEO
        {
          name: `robots`,
          content: `index, follow`,
        },
        {
          name: `googlebot`,
          content: `index, follow`,
        },
        {
          name: `theme-color`,
          content: `#4A4A4A`,
        },
        {
          name: `msapplication-TileColor`,
          content: `#4A4A4A`,
        },
        {
          name: `apple-mobile-web-app-capable`,
          content: `yes`,
        },
        {
          name: `apple-mobile-web-app-status-bar-style`,
          content: `black-translucent`,
        },
        {
          name: `apple-mobile-web-app-title`,
          content: site.siteMetadata.title,
        },
        {
          name: `mobile-web-app-capable`,
          content: `yes`,
        },
        {
          name: `application-name`,
          content: site.siteMetadata.title,
        },
        {
          name: `msapplication-tooltip`,
          content: metaDescription,
        },
        {
          name: `msapplication-starturl`,
          content: `/`,
        },
        {
          name: `format-detection`,
          content: `telephone=no`,
        },
        {
          name: `HandheldFriendly`,
          content: `True`,
        },
        {
          name: `MobileOptimized`,
          content: `320`,
        },
        {
          name: `referrer`,
          content: `no-referrer-when-downgrade`,
        },
        {
          property: `og:locale`,
          content: `en_US`,
        },
        {
          property: `og:image:width`,
          content: `1200`,
        },
        {
          property: `og:image:height`,
          content: `630`,
        },
        {
          property: `og:image:alt`,
          content: metaTitle,
        },
        {
          name: `twitter:site`,
          content: `@maxjeffwell`,
        },
        {
          name: `twitter:image:alt`,
          content: metaTitle,
        },
      ]
        .concat(
          metaImage
            ? [
                {
                  property: `og:image`,
                  content: metaImage,
                },
                {
                  name: `twitter:image`,
                  content: metaImage,
                },
              ]
            : []
        )
        .concat(
          keywords.length > 0
            ? {
                name: `keywords`,
                content: keywords.join(`, `),
              }
            : []
        )
        .concat(meta)}
      link={[
        {
          rel: 'canonical',
          href: canonical,
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossOrigin: 'anonymous',
        },
        {
          rel: 'dns-prefetch',
          href: 'https://www.google-analytics.com',
        },
        {
          rel: 'manifest',
          href: '/manifest.webmanifest',
        },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/icons/apple-touch-icon.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: '/icons/favicon-32x32.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          href: '/icons/favicon-16x16.png',
        },
        {
          rel: 'mask-icon',
          href: '/icons/safari-pinned-tab.svg',
          color: '#4A4A4A',
        },
      ]}
    >
      {/* Structured Data - Person Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: 'Jeff Maxwell',
          jobTitle: 'Full Stack Web Developer',
          url: site.siteMetadata.siteUrl,
          email: 'maxjeffwell@gmail.com',
          knowsAbout: ['JavaScript', 'React', 'Node.js', 'Full Stack Development'],
          sameAs: ['https://github.com/maxjeffwell', 'https://angel.co/maxjeffwell'],
        })}
      </script>

      {/* Structured Data - WebSite Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: site.siteMetadata.title,
          description: site.siteMetadata.description,
          url: site.siteMetadata.siteUrl,
          author: {
            '@type': 'Person',
            name: 'Jeff Maxwell',
          },
        })}
      </script>
    </Helmet>
  );
}

SEO.defaultProps = {
  lang: `en`,
  meta: [],
  keywords: [],
  pathname: ``,
  article: false,
};

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  keywords: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string.isRequired,
  image: PropTypes.string,
  pathname: PropTypes.string,
  article: PropTypes.bool,
};

export default SEO;
