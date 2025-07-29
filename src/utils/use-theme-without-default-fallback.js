// Fallback for @mui/system/useThemeWithoutDefault during SSR
import { useTheme } from '@mui/material/styles';

const useThemeWithoutDefault = () => {
  try {
    return useTheme();
  } catch {
    return {
      palette: { mode: 'light' },
      breakpoints: { down: () => '(max-width: 600px)' },
      spacing: (factor) => `${factor * 8}px`,
    };
  }
};

export default useThemeWithoutDefault;
