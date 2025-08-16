import React from 'react';

const ClientOnlyIcon = ({ iconName, fontSize = 'medium', style = {}, ...props }) => {
  // Check if we're on the client side first
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // Map fontSize to actual sizes
  const sizeMap = {
    small: '16px',
    medium: '20px',
    large: '24px',
    inherit: 'inherit',
  };

  const size = sizeMap[fontSize] || fontSize;

  // Return placeholder during SSR for all icons
  if (!isClient) {
    return (
      <div
        {...props}
        style={{
          width: size,
          height: size,
          background: 'transparent',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...style,
        }}
      />
    );
  }

  // Dynamically import the internal component only on client side
  const ClientOnlyIconInternal = React.lazy(() => import('./ClientOnlyIconInternal'));

  return (
    <React.Suspense
      fallback={
        <div
          {...props}
          style={{
            width: size,
            height: size,
            background: 'transparent',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            ...style,
          }}
        />
      }
    >
      <ClientOnlyIconInternal iconName={iconName} fontSize={fontSize} style={style} {...props} />
    </React.Suspense>
  );
};

export default ClientOnlyIcon;
