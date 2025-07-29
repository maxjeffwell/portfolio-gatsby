import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { useStaticQuery, graphql } from 'gatsby';

function SEO({ description, lang, meta, keywords, title, image, slug }) {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          description
          author
          siteUrl
        }
      }
      social: file(name: { eq: "jeffmaxwell-social" }) {
        publicURL
      }
      favicon: file(name: { eq: "favicon" }) {
        publicURL
      }
    }
  `);

  const metaDescription =
    description ||
    (data.site && data.site.siteMetadata
      ? data.site.siteMetadata.description
      : 'Jeff Maxwell - Full Stack Developer');

  // Create longer, more SEO-optimized titles based on page
  const createOptimizedTitle = (pageTitle) => {
    const baseBrand = 'Jeff Maxwell';
    const primarySkills = 'Full Stack React & Node.js Developer';
    const location = 'Central Florida & Tampa Bay Area';
    const year = '2025';

    if (!pageTitle) {
      return `${baseBrand} - ${primarySkills} | ${location} Portfolio ${year}`;
    }

    const titleMap = {
      Home: `${baseBrand} - ${primarySkills} | Modern Web Development ${location} ${year}`,
      Projects: `${pageTitle} - React & Node.js Portfolio | Full Stack Web Development by ${baseBrand} | ${location}`,
      About: `${pageTitle} ${baseBrand} - ${primarySkills} | Professional Developer Bio | ${location}`,
      Contact: `${pageTitle} ${baseBrand} - Hire ${primarySkills} | Freelance Web Development | ${location}`,
    };

    return titleMap[pageTitle] || `${pageTitle} | ${baseBrand} - ${primarySkills} | ${location}`;
  };

  const metaTitle = createOptimizedTitle(title);
  const siteUrl =
    data.site && data.site.siteMetadata ? data.site.siteMetadata.siteUrl : 'https://el-jefe.me';
  const siteTitle =
    data.site && data.site.siteMetadata ? data.site.siteMetadata.title : 'Jeff Maxwell - Portfolio';
  const siteDescription =
    data.site && data.site.siteMetadata
      ? data.site.siteMetadata.description
      : 'Full Stack Developer Portfolio';
  const metaImage = image ? `${siteUrl}${image}` : `${siteUrl}/icons/icon-512x512.png`;

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={metaTitle}
      meta={[
        {
          name: `google_site_verification`,
          content: `uswhTGfqJrK0VsQwtyZFriGk6lW4wUMB`,
        },
        {
          name: `description`,
          content: metaDescription,
        },
        {
          name: `author`,
          content:
            data.site && data.site.siteMetadata ? data.site.siteMetadata.author : 'Jeff Maxwell',
        },
        {
          name: `viewport`,
          content: `width=device-width, initial-scale=1`,
        },
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
          name: `color-scheme`,
          content: `light dark`,
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
          content: siteTitle,
        },
        {
          name: `mobile-web-app-capable`,
          content: `yes`,
        },
        {
          name: `application-name`,
          content: siteTitle,
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
          name: `geo.region`,
          content: `US-FL`,
        },
        {
          name: `geo.placename`,
          content: `Central Florida, Tampa Bay Area, Florida, United States`,
        },
        {
          name: `geo.position`,
          content: `27.7663;-82.6404`,
        },
        {
          name: `ICBM`,
          content: `27.7663, -82.6404`,
        },
        {
          name: `geo.country`,
          content: `US`,
        },
        {
          name: `geo.region`,
          content: `Florida`,
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
          href: `${data.site.siteMetadata.siteUrl}${slug}`,
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
          specialization: ['React Development', 'Node.js Development', 'JavaScript Programming'],
          url: siteUrl,
          email: 'maxjeffwell@gmail.com',
          address: {
            '@type': 'PostalAddress',
            addressRegion: 'FL',
            addressCountry: 'US',
            addressLocality: 'Central Florida',
            addressArea: 'Tampa Bay Area',
          },
          workLocation: {
            '@type': 'Place',
            name: 'Central Florida, Tampa Bay Area',
            description: 'Full Stack Developer serving Central Florida and Tampa Bay Area',
            geo: {
              '@type': 'GeoCoordinates',
              latitude: 27.7663,
              longitude: -82.6404,
            },
            containedInPlace: {
              '@type': 'State',
              name: 'Florida',
              containedInPlace: {
                '@type': 'Country',
                name: 'United States',
              },
            },
          },
          knowsAbout: [
            'JavaScript Programming',
            'React Development',
            'Node.js Development',
            'Full Stack Web Development',
            'Frontend Development',
            'Backend Development',
            'GraphQL APIs',
            'MERN Stack',
            'Modern Web Development',
            'Responsive Web Design',
            'API Development',
            'Database Design',
            'Web Application Development',
            'Central Florida Web Development',
            'Tampa Bay Area Developer',
            'Florida React Developer',
            'Local Web Developer Services',
          ],
          hasOccupation: {
            '@type': 'Occupation',
            '@name': 'Full Stack Developer',
            '@skills': ['React', 'Node.js', 'GraphQL', 'JavaScript', 'MongoDB', 'Express.js'],
          },
          sameAs: ['https://github.com/maxjeffwell', 'https://angel.co/maxjeffwell'],
        })}
      </script>

      {/* Structured Data - WebSite Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: siteTitle,
          description: siteDescription,
          url: siteUrl,
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
  slug: ``,
};

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  keywords: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string.isRequired,
  image: PropTypes.string,
  slug: PropTypes.string,
};

// Search Console verification meta tag component
export const SearchConsoleVerification = ({ verificationCode }) => (
  // eslint-disable-next-line react/jsx-no-useless-fragment
  <>{verificationCode && <meta name="google-site-verification" content={verificationCode} />}</>
);

SearchConsoleVerification.propTypes = {
  verificationCode: PropTypes.string,
};

SearchConsoleVerification.defaultProps = {
  verificationCode: null,
};

// Bing Webmaster Tools verification
export const BingVerification = ({ verificationCode }) => (
  // eslint-disable-next-line react/jsx-no-useless-fragment
  <>{verificationCode && <meta name="msvalidate.01" content={verificationCode} />}</>
);

BingVerification.propTypes = {
  verificationCode: PropTypes.string,
};

BingVerification.defaultProps = {
  verificationCode: null,
};

// Yandex Webmaster verification
export const YandexVerification = ({ verificationCode }) => (
  // eslint-disable-next-line react/jsx-no-useless-fragment
  <>{verificationCode && <meta name="yandex-verification" content={verificationCode} />}</>
);

YandexVerification.propTypes = {
  verificationCode: PropTypes.string,
};

YandexVerification.defaultProps = {
  verificationCode: null,
};

export default SEO;
