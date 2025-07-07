// Dummy react-icons module for SSR compatibility
// This prevents react-icons from being processed during server-side rendering

// Export commonly used icons as empty components
export const FaExclamationTriangle = () => null;
export const FaRedo = () => null;
export const FaHome = () => null;
export const FaBars = () => null;
export const FaTimes = () => null;
export const FaGithubAlt = () => null;
export const FaAngellist = () => null;
export const FaLinkedin = () => null;
export const FaPhone = () => null;
export const FaRegArrowAltCircleRight = () => null;

// Define LazyImage to resolve the mysterious error
if (typeof window === 'undefined') {
  global.LazyImage = () => null;
}

// Default export for any other icons
const DummyIcon = () => null;

export default DummyIcon;
