import React from 'react';
import { Box, CircularProgress, useTheme } from '@mui/material';

const LoadingSpinner = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 200,
      }}
    >
      <CircularProgress
        size={60}
        sx={{
          color: theme.palette.primary.main,
        }}
      />
    </Box>
  );
};

export default LoadingSpinner;