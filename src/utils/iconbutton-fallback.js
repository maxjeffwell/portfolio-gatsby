// IconButton fallback for SSR compatibility
const React = require('react');

// Simple IconButton replacement for SSR
const IconButton = React.forwardRef((props, ref) => {
  const { children, onClick, ...restProps } = props;
  
  return React.createElement('button', {
    ref,
    onClick,
    type: 'button',
    style: {
      border: 'none',
      background: 'transparent',
      padding: '8px',
      borderRadius: '50%',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    ...restProps
  }, children);
});

IconButton.displayName = 'IconButton';

module.exports = IconButton;
module.exports.default = IconButton;