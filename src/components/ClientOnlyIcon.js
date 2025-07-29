// This component is no longer needed as MUI has been completely removed
// Keeping it as a fallback to prevent import errors during transition

import React from 'react';

const ClientOnlyIcon = ({ iconName, ...props }) => {
  // Return a simple placeholder since MUI icons are no longer used
  return <span>⚙️</span>;
};

export default ClientOnlyIcon;