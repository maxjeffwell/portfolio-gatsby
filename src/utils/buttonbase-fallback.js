// ButtonBase fallback for SSR compatibility
const React = require('react');

// Simple ButtonBase replacement for SSR that avoids all MUI dependencies
const ButtonBase = React.forwardRef((props, ref) => {
  const { 
    children, 
    onClick, 
    component = 'button', 
    disabled = false,
    disableRipple = true, // Always disable ripple for SSR
    focusRipple = false,
    touchRipple = false,
    centerRipple = false,
    disableTouchRipple = true,
    tabIndex,
    type,
    ...restProps 
  } = props;
  
  // Filter out MUI-specific props
  const {
    focusVisibleClassName,
    LinkComponent,
    TouchRippleProps,
    action,
    onFocusVisible,
    ...cleanProps
  } = restProps;
  
  return React.createElement(component, {
    ref,
    onClick: disabled ? undefined : onClick,
    type: component === 'button' ? (type || 'button') : undefined,
    disabled: component === 'button' ? disabled : undefined,
    tabIndex: disabled ? -1 : tabIndex,
    style: {
      border: 'none',
      background: 'transparent',
      cursor: disabled ? 'default' : 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      textDecoration: 'none',
      color: 'inherit',
      padding: '8px',
      borderRadius: '4px',
      outline: 'none',
      userSelect: 'none',
      verticalAlign: 'middle',
      appearance: 'none',
      WebkitTapHighlightColor: 'transparent',
      ...(disabled && { opacity: 0.6, pointerEvents: 'none' }),
    },
    ...cleanProps
  }, children);
});

ButtonBase.displayName = 'ButtonBase';

module.exports = ButtonBase;
module.exports.default = ButtonBase;