import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-sizing: border-box;
  background-color: transparent;
  outline: 0;
  border: 0;
  margin: 0;
  border-radius: 4px;
  padding: 6px 16px;
  cursor: pointer;
  user-select: none;
  vertical-align: middle;
  text-decoration: none;
  font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.75;
  letter-spacing: 0.02857em;
  text-transform: uppercase;
  min-width: 64px;
  transition:
    background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;

  &:focus-visible {
    outline: 2px solid ${(props) => getPrimaryColor(props)};
    outline-offset: 2px;
  }

  /* Size variants */
  ${(props) =>
    props.size === 'small' &&
    `
    padding: 4px 10px;
    font-size: 0.8125rem;
  `}

  ${(props) =>
    props.size === 'large' &&
    `
    padding: 8px 22px;
    font-size: 0.9375rem;
  `}
  
  /* Contained variant */
  ${(props) =>
    props.variant === 'contained' &&
    `
    color: #fff;
    background-color: ${getPrimaryColor(props)};
    box-shadow: 0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12);
    
    &:hover {
      background-color: ${getHoverColor(props, 'contained')};
      box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);
    }
  `}
  
  /* Outlined variant */
  ${(props) =>
    props.variant === 'outlined' &&
    `
    color: ${getPrimaryColor(props)};
    border: 1px solid ${props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)'};
    
    &:hover {
      background-color: ${getHoverColor(props, 'outlined')};
      border-color: ${getPrimaryColor(props)};
    }
  `}
  
  /* Text variant (default) */
  ${(props) =>
    (!props.variant || props.variant === 'text') &&
    `
    color: ${getPrimaryColor(props)};
    
    &:hover {
      background-color: ${getHoverColor(props, 'text')};
    }
  `}
`;

// Helper functions for color calculations
const getPrimaryColor = (props) => {
  if (props.color === 'secondary') {
    return props.theme?.mode === 'dark' ? '#f48fb1' : '#d32f2f';
  }
  return props.theme?.colors?.primary || (props.theme?.mode === 'dark' ? '#90caf9' : '#1976d2');
};

const getHoverColor = (props, variant) => {
  const isDark = props.theme?.mode === 'dark';
  const isSecondary = props.color === 'secondary';

  if (variant === 'contained') {
    if (isSecondary) {
      return isDark ? '#f06292' : '#c62828';
    }
    return isDark ? '#64b5f6' : '#1565c0';
  }

  if (variant === 'outlined' || variant === 'text') {
    if (isSecondary) {
      return isDark ? 'rgba(244, 143, 177, 0.08)' : 'rgba(211, 47, 47, 0.04)';
    }
    return isDark ? 'rgba(144, 202, 249, 0.08)' : 'rgba(25, 118, 210, 0.04)';
  }

  return 'transparent';
};

const ClientOnlyButton = ({
  children,
  component: Component = 'button',
  variant = 'text',
  color = 'primary',
  size = 'medium',
  endIcon,
  startIcon,
  ...props
}) => {
  // If a component prop is provided (like Link), render as that component with styled props
  if (Component !== 'button') {
    return (
      <StyledButton as={Component} {...props} variant={variant} color={color} size={size}>
        {startIcon && <span style={{ marginRight: '8px' }}>{startIcon}</span>}
        {children}
        {endIcon && <span style={{ marginLeft: '8px' }}>{endIcon}</span>}
      </StyledButton>
    );
  }

  return (
    <StyledButton {...props} variant={variant} color={color} size={size}>
      {startIcon && <span style={{ marginRight: '8px' }}>{startIcon}</span>}
      {children}
      {endIcon && <span style={{ marginLeft: '8px' }}>{endIcon}</span>}
    </StyledButton>
  );
};

export default ClientOnlyButton;
