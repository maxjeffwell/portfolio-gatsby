import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { useStaticQuery, graphql } from 'gatsby';

function SEO({ description, lang, meta, keywords, title, image, slug, pathname }) {
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

  // Utility function to enhance keywords based on page context
  const enhanceKeywordsForPage = (baseKeywords, pagePath, pageTitle) => {
    const enhancedKeywords = [...(baseKeywords || [])];
    
    // Add contextual keywords based on page path
    if (pagePath) {
      const pathSegments = pagePath.split('/').filter(Boolean);
      const pageType = pathSegments[0];
      
      switch (pageType) {
        case 'projects':
          enhancedKeywords.unshift('web developer portfolio', 'react projects', 'node.js portfolio');
          break;
        case 'about':
          enhancedKeywords.unshift('full stack developer bio', 'react developer experience');
          break;
        case 'contact':
          enhancedKeywords.unshift('hire developer', 'freelance web developer', 'react consultant');
          break;
        case 'blog':
          enhancedKeywords.unshift('web development blog', 'react tutorials', 'javascript articles');
          break;
        default:
          // Homepage - prioritize core skills
          enhancedKeywords.unshift('full stack developer', 'react developer', 'node.js developer');
      }
    }
    
    // Add keywords based on page title content
    if (pageTitle) {
      const titleLower = pageTitle.toLowerCase();
      if (titleLower.includes('react') && !enhancedKeywords.some(k => k.includes('react'))) {
        enhancedKeywords.unshift('react specialist');
      }
      if (titleLower.includes('node') && !enhancedKeywords.some(k => k.includes('node'))) {
        enhancedKeywords.unshift('node.js expert');
      }
      if (titleLower.includes('portfolio') && !enhancedKeywords.some(k => k.includes('portfolio'))) {
        enhancedKeywords.unshift('developer portfolio');
      }
    }
    
    // Remove duplicates and limit to most relevant
    return [...new Set(enhancedKeywords)].slice(0, 5);
  };

  // Dynamic SEO-optimized title generation (50-60 characters for optimal SEO)
  const createOptimizedTitle = (pageTitle, currentPathname, pageKeywords) => {
    const baseBrand = 'Jeff Maxwell';
    const primarySkill = 'React & Node.js Developer';
    const location = 'Orlando, FL';
    const experience = 'Full Stack';
    
    // Extract and enhance keywords for title optimization
    const baseKeywords = pageKeywords || keywords || [];
    const enhancedKeywords = enhanceKeywordsForPage(baseKeywords, currentPathname, pageTitle);
    const primaryKeywords = enhancedKeywords.slice(0, 3); // Use top 3 enhanced keywords
    
    // Determine page type from pathname
    const pathSegments = (currentPathname || pathname || '').split('/').filter(Boolean);
    const pageType = pathSegments[0] || 'home';
    
    // Dynamic title generation based on page context
    const generateContextualTitle = () => {
      switch (pageType) {
        case 'projects':
          // Check if it's a specific project page
          if (pathSegments.length > 1) {
            const projectName = pathSegments[1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            return `${projectName} | ${baseBrand} Portfolio`;
          }
          return `${experience} Developer Portfolio | ${baseBrand}`;
          
        case 'about':
          return `About ${baseBrand} | ${primarySkill}`;
          
        case 'contact':
          return `Hire ${baseBrand} | ${primarySkill}`;
          
        case 'blog':
          if (pathSegments.length > 1) {
            const postSlug = pathSegments[1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            return `${postSlug} | ${baseBrand} Blog`;
          }
          return `Development Blog | ${baseBrand}`;
          
        default:
          // Homepage or unknown page
          if (pageTitle && pageTitle !== 'Home') {
            // Custom page title provided
            const hasKeywords = primaryKeywords.some(keyword => 
              pageTitle.toLowerCase().includes(keyword.toLowerCase())
            );
            
            if (!hasKeywords && primaryKeywords.length > 0) {
              // Enhance title with relevant keywords
              const relevantKeyword = primaryKeywords.find(kw => 
                kw.toLowerCase().includes('developer') || 
                kw.toLowerCase().includes('react') ||
                kw.toLowerCase().includes('javascript')
              ) || primaryKeywords[0];
              
              return `${pageTitle} | ${baseBrand} ${relevantKeyword}`;
            }
            
            return `${pageTitle} | ${baseBrand}`;
          }
          
          return `${baseBrand} - ${primarySkill}, ${location}`;
      }
    };
    
    let generatedTitle = generateContextualTitle();
    
    // Ensure title is within optimal length (50-60 chars)
    if (generatedTitle.length > 60) {
      // Try shortening location
      if (generatedTitle.includes(location)) {
        generatedTitle = generatedTitle.replace(location, 'FL');
      }
      
      // If still too long, use more concise version
      if (generatedTitle.length > 60) {
        switch (pageType) {
          case 'projects':
            return `Portfolio | ${baseBrand} ${experience} Dev`;
          case 'about':
            return `About | ${baseBrand} Developer`;
          case 'contact':
            return `Contact | ${baseBrand} Developer`;
          default:
            return `${baseBrand} - ${primarySkill}`;
        }
      }
    }
    
    // Ensure minimum length (aim for 50+ chars when possible)
    if (generatedTitle.length < 50 && !generatedTitle.includes(location)) {
      const locationToAdd = generatedTitle.length < 45 ? `, ${location}` : ', FL';
      generatedTitle += locationToAdd;
    }
    
    return generatedTitle;
  };

  const metaTitle = createOptimizedTitle(title, pathname, keywords);
  const siteUrl =
    data.site && data.site.siteMetadata ? data.site.siteMetadata.siteUrl : 'https://www.el-jefe.me';
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
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, shrink-to-fit=no',
        },
        {
          charset: 'utf-8',
        },
        {
          name: `google_site_verification`,
          content: `uswhTGfqJrK0VsQwtyZFriGk6lW4wUMB`,
        },
        {
          name: `msvalidate.01`,
          content: `7F8A3B5C1D2E9F4A6B8C0E5D7F9A2B4C6E8F0A3B5C7D9E1F3A5B7C9E0F2A4B6C8E`,
        },
        {
          name: `yandex-verification`,
          content: `9f2a5b8c1e4d7a3b6c9e0f2a5b8c1e4d`,
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
          name: `article:author`,
          content:
            data.site && data.site.siteMetadata ? data.site.siteMetadata.author : 'Jeff Maxwell',
        },
        {
          name: `article:published_time`,
          content: `2019-01-01T00:00:00.000Z`,
        },
        {
          name: `article:modified_time`,
          content: new Date().toISOString(),
        },
        {
          property: `article:modified_time`,
          content: new Date().toISOString(),
        },
        {
          name: `robots`,
          content: `index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1`,
        },
        {
          name: `googlebot`,
          content: `index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1`,
        },
        {
          name: `bingbot`,
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
          content: `black`,
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
          content: `Jeff Maxwell Developer Portfolio`,
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
          name: `msapplication-config`,
          content: `/browserconfig.xml`,
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
          content: `strict-origin-when-cross-origin`,
        },
        {
          name: `geo.region`,
          content: `US-FL`,
        },
        {
          name: `geo.placename`,
          content: `Orlando, Central Florida, Tampa Bay Area, Florida, United States`,
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
          property: `og:title`,
          content: metaTitle,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          property: `og:url`,
          content: `${siteUrl}${pathname || slug || ''}`,
        },
        {
          property: `og:site_name`,
          content: siteTitle,
        },
        {
          property: `og:locale`,
          content: `en_US`,
        },
        {
          property: `og:updated_time`,
          content: new Date().toISOString(),
        },
        {
          property: `og:see_also`,
          content: `https://github.com/maxjeffwell`,
        },
        {
          property: `article:author`,
          content: `Jeff Maxwell`,
        },
        {
          property: `article:publisher`,
          content: `Jeff Maxwell Developer Portfolio`,
        },
        {
          property: `article:section`,
          content: `Web Development`,
        },
        {
          property: `article:tag`,
          content: `React, Node.js, JavaScript, Full Stack Development`,
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
          property: `og:image:type`,
          content: `image/png`,
        },
        {
          property: `og:image:secure_url`,
          content: metaImage,
        },
        {
          name: `twitter:card`,
          content: `summary_large_image`,
        },
        {
          name: `twitter:title`,
          content: metaTitle,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
        {
          name: `twitter:site`,
          content: `@maxjeffwell`,
        },
        {
          name: `twitter:creator`,
          content: `@maxjeffwell`,
        },
        {
          name: `twitter:domain`,
          content: `el-jefe.me`,
        },
        {
          name: `twitter:image:alt`,
          content: metaTitle,
        },
        {
          property: `fb:app_id`,
          content: ``,
        },
        {
          name: `pinterest-rich-pin`,
          content: `true`,
        },
        {
          name: `sitemap`,
          content: `${siteUrl}/sitemap-index.xml`,
        },
        {
          name: `last-modified`,
          content: new Date().toUTCString(),
        },
        {
          name: `date`,
          content: new Date().toISOString(),
        },
        {
          name: `build-date`,
          content: new Date().toISOString(),
        },
        {
          httpEquiv: `last-modified`,
          content: new Date().toUTCString(),
        },
        {
          httpEquiv: `expires`,
          content: new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString(), // 24 hours from now
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
          href: `${data.site.siteMetadata.siteUrl}${pathname || slug || ''}`,
        },
        {
          rel: 'preload',
          href: '/fonts/fonts.css',
          as: 'style',
          onload: "this.onload=null;this.rel='stylesheet'",
        },
        {
          rel: 'sitemap',
          type: 'application/xml',
          href: `${data.site.siteMetadata.siteUrl}/sitemap-index.xml`,
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
          rel: 'shortcut icon',
          href: '/favicon-32x32.png',
        },
        {
          rel: 'icon',
          href: '/favicon-32x32.png',
        },
        {
          rel: 'apple-touch-icon',
          sizes: '192x192',
          href: '/icons/icon-192x192.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: '/favicon-32x32.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '96x96',
          href: '/icons/icon-96x96.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '192x192',
          href: '/icons/icon-192x192.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '512x512',
          href: '/icons/icon-512x512.png',
        },
      ]}
    >
      {/* Inline critical CSS to prevent FOUC */}
      <style
        key="critical-theme-css"
        dangerouslySetInnerHTML={{
          __html: `
            :root {
              --bg-color: #f5f5f5;
              --text-color: #212121;
              --paper-color: #ffffff;
              --primary-color: #1976d2;
              --secondary-color: #dc004e;
              --text-secondary-color: rgba(0, 0, 0, 0.6);
            }
            
            .dark-mode {
              --bg-color: #0a0a0a;
              --text-color: #ffffff;
              --paper-color: #1a1a1a;
              --primary-color: #90caf9;
              --secondary-color: #f48fb1;
              --text-secondary-color: rgba(255, 255, 255, 0.7);
            }
            
            .light-mode {
              --bg-color: #f5f5f5;
              --text-color: #212121;
              --paper-color: #ffffff;
              --primary-color: #1976d2;
              --secondary-color: #dc004e;
              --text-secondary-color: rgba(0, 0, 0, 0.6);
            }
            
            @media (prefers-color-scheme: dark) {
              :root {
                --bg-color: #0a0a0a;
                --text-color: #ffffff;
                --paper-color: #1a1a1a;
                --primary-color: #90caf9;
                --secondary-color: #f48fb1;
                --text-secondary-color: rgba(255, 255, 255, 0.7);
              }
            }
            
            body {
              background-color: var(--bg-color) !important;
              color: var(--text-color) !important;
              transition: background-color 0.3s ease, color 0.3s ease;
            }
            
            h1, h2, h3, h4, h5, h6 {
              color: var(--text-color) !important;
            }
          `,
        }}
      />

      {/* Theme detection script to prevent FOUC */}
      <script
        key="theme-detection"
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                // Only run on client-side
                if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
                
                var theme = localStorage.getItem('portfolio-theme');
                var systemPreference = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                var initialTheme = theme || systemPreference;
                var root = document.documentElement;
                
                if (initialTheme === 'dark') {
                  root.classList.add('dark-mode');
                  root.classList.remove('light-mode');
                  document.body.style.backgroundColor = '#0a0a0a';
                  document.body.style.color = '#ffffff';
                } else {
                  root.classList.add('light-mode');
                  root.classList.remove('dark-mode');
                  document.body.style.backgroundColor = '#f5f5f5';
                  document.body.style.color = '#212121';
                }
              } catch (e) {
                // Fallback to light theme if any error occurs
                var root = document.documentElement;
                root.classList.add('light-mode');
                root.classList.remove('dark-mode');
                document.body.style.backgroundColor = '#f5f5f5';
                document.body.style.color = '#212121';
              }
            })();
          `,
        }}
      />

      {/* Structured Data - Person Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: 'Jeff Maxwell',
          jobTitle: 'Full Stack Web Developer',
          specialization: ['React Development', 'Node.js Development', 'JavaScript Programming'],
          url: siteUrl,
          email: (() => {
            const emailParts = { user: 'maxjeffwell', domain: 'gmail', tld: 'com' };
            return `${emailParts.user}@${emailParts.domain}.${emailParts.tld}`;
          })(),
          address: {
            '@type': 'PostalAddress',
            addressRegion: 'FL',
            addressCountry: 'US',
            addressLocality: 'Orlando, Central Florida',
            addressArea: 'Tampa Bay Area',
          },
          workLocation: {
            '@type': 'Place',
            name: 'Orlando, Central Florida, Tampa Bay Area',
            description: 'Full Stack Developer serving Orlando, Central Florida and Tampa Bay Area',
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
            'Orlando Web Development',
            'Central Florida Web Development', 
            'Tampa Bay Area Developer',
            'Florida React Developer',
            'Orlando React Developer',
            'Local Web Developer Services',
          ],
          hasOccupation: {
            '@type': 'Occupation',
            name: 'Full Stack Developer',
            skills: ['React', 'Node.js', 'GraphQL', 'JavaScript', 'MongoDB', 'Express.js'],
            occupationalCategory: 'Software Developer',
            description: 'Full Stack Web Developer specializing in React and Node.js applications',
          },
          telephone: '+1-508-395-2008',
          image: `${siteUrl}/icons/icon-512x512.png`,
          alumniOf: {
            '@type': 'Organization',
            name: 'Self-Taught Developer',
          },
          worksFor: {
            '@type': 'Organization',
            name: 'Jeff Maxwell Development',
          },
          memberOf: {
            '@type': 'Organization',
            name: 'Web Development Community',
          },
          sameAs: ['https://github.com/maxjeffwell', 'https://wellfound.com/u/maxjeffwell'],
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
          potentialAction: {
            '@type': 'SearchAction',
            target: `${siteUrl}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
          mainEntity: {
            '@type': 'Person',
            name: 'Jeff Maxwell',
          },
        })}
      </script>

      {/* Structured Data - Organization Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Jeff Maxwell Development',
          description: 'Full Stack Web Development Services specializing in React and Node.js',
          url: siteUrl,
          logo: `${siteUrl}/icons/icon-512x512.png`,
          image: `${siteUrl}/icons/icon-512x512.png`,
          founder: {
            '@type': 'Person',
            name: 'Jeff Maxwell',
          },
          foundingDate: '2019',
          address: {
            '@type': 'PostalAddress',
            addressRegion: 'FL',
            addressCountry: 'US',
            addressLocality: 'Orlando, Central Florida',
          },
          areaServed: {
            '@type': 'Place',
            name: 'Orlando, Central Florida, Tampa Bay Area, Florida, United States',
          },
          serviceType: [
            'Web Development',
            'React Development', 
            'Node.js Development',
            'Full Stack Development',
            'JavaScript Programming',
          ],
          sameAs: ['https://github.com/maxjeffwell', 'https://wellfound.com/u/maxjeffwell'],
        })}
      </script>

      {/* Structured Data - Professional Service Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ProfessionalService',
          name: 'Jeff Maxwell - Full Stack Web Developer',
          description: 'Professional web development services specializing in React, Node.js, and modern JavaScript applications',
          url: siteUrl,
          image: `${siteUrl}/icons/icon-512x512.png`,
          telephone: '+1-508-395-2008',
          email: (() => {
            const emailParts = { user: 'maxjeffwell', domain: 'gmail', tld: 'com' };
            return `${emailParts.user}@${emailParts.domain}.${emailParts.tld}`;
          })(),
          address: {
            '@type': 'PostalAddress',
            addressRegion: 'FL',
            addressCountry: 'US',
            addressLocality: 'Orlando, Central Florida',
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 27.7663,
            longitude: -82.6404,
          },
          areaServed: {
            '@type': 'Place',
            name: 'Orlando, Central Florida, Tampa Bay Area, Florida, United States',
          },
          serviceType: [
            'Web Development',
            'React Development',
            'Node.js Development', 
            'Full Stack Development',
            'JavaScript Programming',
            'Frontend Development',
            'Backend Development',
          ],
          provider: {
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
  pathname: ``,
};

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  keywords: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string.isRequired,
  image: PropTypes.string,
  slug: PropTypes.string,
  pathname: PropTypes.string,
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
