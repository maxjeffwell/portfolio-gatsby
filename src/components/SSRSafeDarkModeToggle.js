import React from 'react';

// This component will only load on the client side
const DarkModeToggle = React.lazy(() => import('./DarkModeToggle'));

function SSRSafeDarkModeToggle() {
  // Don't render anything during SSR
  if (typeof window === 'undefined') {
    return <div style={{ width: '48px', height: '48px' }} />; // Placeholder
  }

  return (
    <React.Suspense fallback={<div style={{ width: '48px', height: '48px' }} />}>
      <DarkModeToggle />
    </React.Suspense>
  );
}

export default SSRSafeDarkModeToggle;