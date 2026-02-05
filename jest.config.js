module.exports = {
  // Use jsdom for DOM simulation
  testEnvironment: 'jsdom',

  // Setup files run before each test file
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // Transform files with babel-jest
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },

  // Module name mapping for imports
  moduleNameMapper: {
    // Handle CSS modules and styled-components
    '\\.css$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg|avif)$': '<rootDir>/__mocks__/fileMock.js',

    // Mock Gatsby modules
    '^gatsby-page-utils/(.*)$': '<rootDir>/__mocks__/gatsby-page-utils.js',
    '^gatsby$': '<rootDir>/__mocks__/gatsby.js',
  },

  // Directories to search for modules
  moduleDirectories: ['node_modules', '<rootDir>/src'],

  // Test file patterns
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx}',
  ],

  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.d.ts',
    '!src/pages/**',
    '!src/templates/**',
    '!src/html.js',
    '!src/wrap-root-element.js',
    '!src/polyfills/**',
    '!src/workers/**',
  ],

  // Coverage thresholds
  coverageThreshold: {
    global: {
      statements: 50,
      branches: 50,
      functions: 50,
      lines: 50,
    },
    'src/context/ThemeContext.js': {
      statements: 70,
      branches: 70,
      functions: 70,
      lines: 70,
    },
  },

  // Ignore patterns
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.cache/',
    '<rootDir>/public/',
    '<rootDir>/.netlify/',
  ],

  // Transform ignore patterns - allow Gatsby modules to be transformed
  transformIgnorePatterns: [
    'node_modules/(?!(gatsby|gatsby-script|gatsby-link)/)',
  ],

  // Global setup
  globals: {
    __PATH_PREFIX__: '',
    __BASE_PATH__: '',
  },

  // Verbose output
  verbose: true,

  // Clear mocks between tests
  clearMocks: true,

  // Restore mocks after each test
  restoreMocks: true,
};
