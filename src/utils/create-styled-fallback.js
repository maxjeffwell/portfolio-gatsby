// Create styled fallback for SSR compatibility

const createStyled = () => {
  return () => 'div';
};

module.exports = createStyled;
module.exports.default = createStyled;