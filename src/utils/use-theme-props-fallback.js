// Use theme props fallback for SSR compatibility

const useThemeProps = ({ props, name }) => {
  return props;
};

module.exports = useThemeProps;
module.exports.default = useThemeProps;
