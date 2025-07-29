// TouchRipple fallback for SSR compatibility
const React = require('react');

// Simple TouchRipple replacement that does nothing during SSR
const TouchRipple = React.forwardRef((props, ref) => {
  // During SSR, return null or an empty div
  return null;
});

TouchRipple.displayName = 'TouchRipple';

module.exports = TouchRipple;
module.exports.default = TouchRipple;