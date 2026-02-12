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
    outline: 2px solid var(--primary-color);
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
    background-color: ${props.color === 'secondary' ? '#d32f2f' : 'var(--primary-color)'};
    box-shadow: 0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12);

    &:hover {
      background-color: ${props.color === 'secondary' ? '#c62828' : 'var(--primary-hover)'};
      box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);
    }
    ${
      props.color === 'secondary'
        ? `
    .dark-mode & {
      background-color: #f48fb1;
      &:hover { background-color: #f06292; }
    }`
        : ''
    }
  `}

  /* Outlined variant */
  ${(props) =>
    props.variant === 'outlined' &&
    `
    color: ${props.color === 'secondary' ? '#d32f2f' : 'var(--primary-color)'};
    border: 1px solid var(--outline-border);

    &:hover {
      background-color: ${props.color === 'secondary' ? 'rgba(211, 47, 47, 0.04)' : 'rgba(25, 118, 210, 0.04)'};
      border-color: ${props.color === 'secondary' ? '#d32f2f' : 'var(--primary-color)'};
    }
    ${
      props.color === 'secondary'
        ? `
    .dark-mode & {
      color: #f48fb1;
      &:hover {
        background-color: rgba(244, 143, 177, 0.08);
        border-color: #f48fb1;
      }
    }`
        : `
    .dark-mode & {
      &:hover {
        background-color: rgba(144, 202, 249, 0.08);
      }
    }`
    }
  `}

  /* Text variant (default) */
  ${(props) =>
    (!props.variant || props.variant === 'text') &&
    `
    color: ${props.color === 'secondary' ? '#d32f2f' : 'var(--primary-color)'};

    &:hover {
      background-color: ${props.color === 'secondary' ? 'rgba(211, 47, 47, 0.04)' : 'rgba(25, 118, 210, 0.04)'};
    }
    ${
      props.color === 'secondary'
        ? `
    .dark-mode & {
      color: #f48fb1;
      &:hover {
        background-color: rgba(244, 143, 177, 0.08);
      }
    }`
        : `
    .dark-mode & {
      &:hover {
        background-color: rgba(144, 202, 249, 0.08);
      }
    }`
    }
  `}
`;

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
