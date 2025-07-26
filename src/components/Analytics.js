import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { trackOrganicLanding } from '../utils/keywordTracker';

// Google Analytics 4 configuration for keyword tracking
const Analytics = () => {
  useEffect(() => {
    // Initialize Google Analytics 4 (replace with your GA4 tracking ID)
    if (typeof window !== 'undefined') {
      // Load Google Analytics script
      window.dataLayer = window.dataLayer || [];
      // eslint-disable-next-line no-inner-declarations
      function gtag(...args) {
        // eslint-disable-next-line no-undef
        dataLayer.push(args);
      }
      window.gtag = gtag;
      gtag('js', new Date());

      // Configure GA4 with enhanced SEO tracking
      gtag('config', 'G-NL37L9SVQ0', {
        // Enhanced measurement for SEO
        enhanced_measurement: true,
        // Page view tracking
        page_title: document.title,
        page_location: window.location.href,
        // Custom dimensions for SEO tracking
        custom_map: {
          custom_parameter_1: 'page_type',
          custom_parameter_2: 'keyword_position',
          custom_parameter_3: 'traffic_source',
        },
      });

      // Track organic landing page
      const { referrer } = document;
      const currentPage = window.location.pathname;
      trackOrganicLanding(currentPage, referrer);

      // Track scroll depth for SEO insights
      let maxScroll = 0;
      const trackScrollDepth = () => {
        const scrollPercent = Math.round(
          (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
        );

        if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
          maxScroll = scrollPercent;
          gtag('event', 'scroll_depth', {
            event_category: 'SEO',
            event_label: `${scrollPercent}%`,
            value: scrollPercent,
            non_interaction: true,
          });
        }
      };

      window.addEventListener('scroll', trackScrollDepth);

      return () => {
        window.removeEventListener('scroll', trackScrollDepth);
      };
    }

    return undefined;
  }, []);

  return null; // This component doesn't render anything
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

export default Analytics;
