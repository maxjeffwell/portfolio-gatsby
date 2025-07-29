// This component is no longer needed as MUI has been completely removed
// Keeping it as a fallback to prevent import errors during transition

import React from 'react';

const ClientOnlyButton = ({ children, fallback = null, ...props }) => {
  // Return a simple button since MUI Button is no longer used
  return <button {...props}>{children}</button>;
};

export default ClientOnlyButton;