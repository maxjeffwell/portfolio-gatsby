// Custom styled-engine configuration to use styled-components with MUI
import styled, { css, keyframes, ThemeProvider } from 'styled-components';

// Export styled-components as the styled engine for MUI
export { styled as default, css, keyframes, ThemeProvider };

// Export additional utilities that MUI expects
export const StyledEngineProvider = ThemeProvider;
export const GlobalStyles = styled.div``;

// Create a styled-components version of createTheme
export const createTheme = (options) => options;
