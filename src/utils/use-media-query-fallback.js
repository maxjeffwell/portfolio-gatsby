// Use media query fallback for SSR compatibility

const useMediaQuery = (query) => {
  // SSR fallback - assume desktop
  return false;
};

module.exports = useMediaQuery;
module.exports.default = useMediaQuery;
