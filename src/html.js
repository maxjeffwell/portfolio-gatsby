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
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <title>Jeff Maxwell Developer Portfolio</title>
        <meta
          name="description"
          content="Jeff Maxwell - Full Stack Web Developer specializing in React, Node.js, and modern web development. Explore my portfolio of innovative projects and development solutions."
        />
        {headComponents}
      </head>
      <body {...bodyAttributes}>
        {preBodyComponents}
        {/* eslint-disable-next-line react/no-danger */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // React 18 ContextRegistry polyfill
              (function() {
                var attempts = 0;
                var maxAttempts = 50;
                
                function checkAndPatchReact() {
                  if (typeof window !== 'undefined' && window.React && window.React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) {
                    if (!window.React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ContextRegistry) {
                      window.React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ContextRegistry = {};
                      console.log('React ContextRegistry polyfill applied');
                    }
                    return true;
                  }
                  return false;
                }
                
                // Try immediately
                if (!checkAndPatchReact()) {
                  // If React isn't available yet, keep trying
                  var interval = setInterval(function() {
                    attempts++;
                    if (checkAndPatchReact() || attempts >= maxAttempts) {
                      clearInterval(interval);
                    }
                  }, 10);
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
