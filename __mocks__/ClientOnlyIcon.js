import React from 'react';

// Mock ClientOnlyIcon - renders a simple span with the icon name
const ClientOnlyIcon = ({ iconName, ...props }) => (
  <span data-testid={`icon-${iconName}`} {...props}>
    {iconName}
  </span>
);

export default ClientOnlyIcon;
