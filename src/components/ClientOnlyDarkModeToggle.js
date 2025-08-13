import React, { useState, useEffect } from 'react';

// Dynamic import to avoid SSR issues
let DarkModeToggle = null;

function ClientOnlyDarkModeToggle() {
  const [isMounted, setIsMounted] = useState(false);
  const [DarkModeToggleComponent, setDarkModeToggleComponent] = useState(null);

  useEffect(() => {
    setIsMounted(true);
    // Dynamically import the DarkModeToggle component only on client side
    import('./DarkModeToggle').then((module) => {
      setDarkModeToggleComponent(() => module.default);
    });
  }, []);

  // Don't render anything during SSR or before component is loaded
  if (!isMounted || !DarkModeToggleComponent) {
    return <div style={{ width: '48px', height: '48px' }} />; // Placeholder to prevent layout shift
  }

  return <DarkModeToggleComponent />;
}

export default ClientOnlyDarkModeToggle;
