const React = require('react');

const Helmet = ({ children }) => React.createElement('div', { 'data-testid': 'helmet' }, children);
const HelmetProvider = ({ children }) => children;

module.exports = {
  Helmet,
  HelmetProvider,
};
