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
