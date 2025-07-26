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
    // MUI v5 already has tree-shaking support with named imports, so we don't need transform-imports
    // React Icons already tree-shake properly with named imports
  ],
};