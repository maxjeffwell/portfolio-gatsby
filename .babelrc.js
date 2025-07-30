module.exports = {
  presets: [
    [
      'babel-preset-gatsby',
      {
        targets: {
          browsers: ['> 0.25%', 'not dead'],
        },
      },
    ],
  ],
  plugins: [
    [
      'babel-plugin-styled-components',
      {
        ssr: true,
        displayName: process.env.NODE_ENV !== 'production',
        fileName: process.env.NODE_ENV !== 'production',
        pure: true,
        minify: process.env.NODE_ENV === 'production',
        transpileTemplateLiterals: process.env.NODE_ENV === 'production',
      },
    ],
  ],
};