import React from 'react';
import PropTypes from 'prop-types';

export default function HTML(props) {
  const {
    htmlAttributes,
    headComponents,
    bodyAttributes,
    preBodyComponents,
    body,
    postBodyComponents,
  } = props;

  return (
    <html {...htmlAttributes} lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="algolia-site-verification" content="620E7268392C7F85" />
        <title>Jeff Maxwell Developer Portfolio</title>
        {headComponents}
      </head>
      <body {...bodyAttributes}>
        {/* Hidden Netlify form for form detection during build - REQUIRED FOR NETLIFY */}
        <form name="contact" data-netlify="true" data-netlify-honeypot="bot-field" hidden>
          <input type="hidden" name="form-name" value="contact" />
          <input type="text" name="name" />
          <input type="email" name="email" />
          <textarea name="message" />
          <input type="text" name="bot-field" />
        </form>
        {preBodyComponents}
        {/* Alt attribute fix for placeholder images */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Fix missing alt attributes on placeholder images
              function fixPlaceholderAltAttributes() {
                const placeholderImages = document.querySelectorAll('img[src^="data:image/"]:not([alt])');
                placeholderImages.forEach(img => {
                  img.setAttribute('alt', 'Loading image...');
                  img.setAttribute('aria-hidden', 'true');
                });
              }
              
              // Run on DOM ready and periodically for dynamic content
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', fixPlaceholderAltAttributes);
              } else {
                fixPlaceholderAltAttributes();
              }
              
              // Monitor for new images being added
              if (typeof MutationObserver !== 'undefined') {
                const observer = new MutationObserver(function(mutations) {
                  mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList') {
                      fixPlaceholderAltAttributes();
                    }
                  });
                });
                observer.observe(document.body, { childList: true, subtree: true });
              }
            `,
          }}
        />
        {/* eslint-disable-next-line react/no-danger */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Enhanced React 18 ContextRegistry polyfill
              (function() {
                // Patch function
                function patchReact(reactObj) {
                  if (reactObj && reactObj.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) {
                    if (!reactObj.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ContextRegistry) {
                      reactObj.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ContextRegistry = {};
                      return true;
                    }
                  }
                  return false;
                }
                
                // Patch immediately if React is already available
                if (typeof window !== 'undefined') {
                  if (window.React) {
                    patchReact(window.React);
                  }
                  
                  // Monitor for React being loaded
                  var originalDefine = window.define;
                  var originalRequire = window.require;
                  
                  // Patch AMD/RequireJS modules
                  if (originalDefine) {
                    window.define = function() {
                      var result = originalDefine.apply(this, arguments);
                      if (window.React) patchReact(window.React);
                      return result;
                    };
                  }
                  
                  // Patch CommonJS requires
                  if (originalRequire) {
                    window.require = function() {
                      var result = originalRequire.apply(this, arguments);
                      if (window.React) patchReact(window.React);
                      return result;
                    };
                  }
                  
                  // Watch for React on window object
                  var attempts = 0;
                  var checkInterval = setInterval(function() {
                    if (window.React && patchReact(window.React)) {
                      clearInterval(checkInterval);
                    }
                    if (++attempts > 100) {
                      clearInterval(checkInterval);
                    }
                  }, 50);
                }
              })();
            `,
          }}
        />
        {/* eslint-disable-next-line react/no-danger */}
        <div key="body" id="___gatsby" dangerouslySetInnerHTML={{ __html: body }} />
        {postBodyComponents}
      </body>
    </html>
  );
}

HTML.propTypes = {
  htmlAttributes: PropTypes.object,
  headComponents: PropTypes.array,
  bodyAttributes: PropTypes.object,
  preBodyComponents: PropTypes.array,
  body: PropTypes.string,
  postBodyComponents: PropTypes.array,
};
