import React, { useState, useEffect } from 'react';

// This component will only load on the client side
const DarkModeToggle = React.lazy(() => import('./DarkModeToggle'));

function SSRSafeDarkModeToggle() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Always render placeholder during SSR and until hydration is complete
  if (!isClient) {
    return <div style={{ width: '56px', height: '56px' }} />; // Placeholder
  }

  return (
    <React.Suspense fallback={<div style={{ width: '56px', height: '56px' }} />}>
      <DarkModeToggle />
    </React.Suspense>
  );
}

export default SSRSafeDarkModeToggle;
