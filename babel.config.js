module.exports = {
  presets: [
    [
      'babel-preset-gatsby',
      {
        targets: {
          browsers: ['>0.25%', 'not dead'],
        },
      },
    ],
  ],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@mui/system/colorManipulator': './src/utils/color-manipulator-fallback.js',
          '@mui/system/styleFunctionSx': './src/utils/style-function-sx-fallback.js',
          '@mui/system/createTheme': './src/utils/create-theme-fallback.js',
          '@mui/system/createStyled': './src/utils/create-styled-fallback.js',
          '@mui/system/useThemeProps': './src/utils/use-theme-props-fallback.js',
          '@mui/system/useMediaQuery': './src/utils/use-media-query-fallback.js',
          '@mui/system/Unstable_Grid': './src/utils/unstable-grid-fallback.js',
          '@mui/system/DefaultPropsProvider': './src/utils/default-props-provider-fallback.js',
          '@mui/system/RtlProvider': './src/utils/rtl-provider-fallback.js',
          '@mui/system/InitColorSchemeScript': './src/utils/init-color-scheme-script-fallback.js',
          '@mui/system/useThemeWithoutDefault': './src/utils/use-theme-without-default-fallback.js',
        },
      },
    ],
  ],
};
