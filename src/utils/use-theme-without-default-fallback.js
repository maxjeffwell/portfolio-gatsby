// This file is no longer needed as MUI has been completely removed
// Replaced with custom ThemeContext hook

export default function useThemeWithoutDefault() {
  return {
    palette: { mode: 'light' },
    breakpoints: { down: () => '(max-width: 600px)' },
    spacing: (factor) => `${factor * 8}px`,
  };
}