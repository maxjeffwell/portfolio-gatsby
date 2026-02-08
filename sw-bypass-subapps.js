// sw-bypass-subapps.js
// Appended to the Gatsby service worker by gatsby-plugin-offline.
//
// Problem: The SW's NavigationRoute intercepts navigations to /storybook/
// and /docs/, then proxies them via fetch(). Even though the correct HTML
// is ultimately served, the SW remains active for all subsequent requests
// on those pages — interfering with Storybook Composition's cross-origin
// ref fetches and Docusaurus asset loading.
//
// Fix: Patch the NavigationRoute's blacklist so the SW completely ignores
// navigations to these sub-app paths. The browser handles them directly.

(() => {
  var denyPatterns = [/\/storybook(\/|$)/, /\/docs(\/|$)/];

  // Workbox 4.x stores registered routes in router._routes (a Map keyed
  // by HTTP method).  NavigationRoute instances have _blacklist/_whitelist
  // (renamed to _denylist/_allowlist in Workbox 5+).
  try {
    var router = workbox.routing;
    var routesMap = router._routes;
    if (routesMap) {
      routesMap.forEach(function(routes) {
        routes.forEach(function(route) {
          // Workbox 4: _blacklist / _whitelist
          if (route._blacklist !== undefined) {
            route._blacklist = route._blacklist.concat(denyPatterns);
          }
          // Workbox 5+: _denylist / _allowlist
          if (route._denylist !== undefined) {
            route._denylist = route._denylist.concat(denyPatterns);
          }
        });
      });
    }
  } catch (e) {
    // Silent — if Workbox internals changed, the SW continues to work
    // normally; sub-app navigations just won't be excluded.
  }
})();
