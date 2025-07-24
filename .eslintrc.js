module.exports = {
  parser: '@babel/eslint-parser',
  extends: [
    'airbnb',
    'airbnb/hooks',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'prettier',
  ],
  plugins: ['react', 'react-hooks', 'jsx-a11y', 'prettier'],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    requireConfigFile: false,
    babelOptions: {
      presets: ['@babel/preset-react'],
    },
  },
  env: {
    browser: true,
    es2022: true,
    node: true,
    jest: true,
  },
  globals: {
    graphql: 'readonly',
    __PATH_PREFIX__: 'readonly',
    __BASE_PATH__: 'readonly',
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.json'],
      },
    },
  },
  rules: {
    // Prettier
    'prettier/prettier': ['error'],

    // React
    'react/jsx-filename-extension': ['warn', { extensions: ['.js', '.jsx'] }],
    'react/prop-types': 'warn',
    'react/forbid-prop-types': 'off',
    'react/require-default-props': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/function-component-definition': [
      'off',
      {
        namedComponents: 'function-declaration',
        unnamedComponents: 'function-expression',
      },
    ],
    'react/no-unescaped-entities': 'warn',
    'react/jsx-one-expression-per-line': 'off',

    // Import
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          'gatsby-config.js',
          'gatsby-node.js',
          'gatsby-browser.js',
          'gatsby-ssr.js',
          'wrap-root-element.js',
          '**/*.test.js',
          '**/*.spec.js',
        ],
      },
    ],

    // General
    'no-console': 'warn',
    'no-alert': 'warn',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'prefer-const': 'error',
    'no-underscore-dangle': 'off',
    'consistent-return': 'warn',
    'no-shadow': 'off',
    'no-use-before-define': 'off',
    'no-param-reassign': ['error', { props: false }],

    // A11y
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['to'],
      },
    ],
    'jsx-a11y/label-has-associated-control': [
      'error',
      {
        required: {
          some: ['nesting', 'id'],
        },
      },
    ],

    // Allow for...of loops
    'no-restricted-syntax': [
      'error',
      {
        selector: 'ForInStatement',
        message: 'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
      },
      {
        selector: 'LabeledStatement',
        message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
      },
      {
        selector: 'WithStatement',
        message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
      },
    ],

    // Allow index in keys for static lists
    'react/no-array-index-key': 'warn',

    // Allow both .js and .jsx extensions
    'react/jsx-filename-extension': ['warn', { extensions: ['.js', '.jsx'] }],

    // Emotion/styled-components
    'react/no-unknown-property': ['error', { ignore: ['css'] }],

    // Functions
    'func-names': 'off',
    'arrow-body-style': 'off',
    'no-lonely-if': 'warn',
  },
  overrides: [
    {
      files: ['*.test.js', '*.spec.js'],
      env: {
        jest: true,
      },
    },
    {
      files: ['gatsby-*.js'],
      rules: {
        'import/no-extraneous-dependencies': 'off',
      },
    },
  ],
};