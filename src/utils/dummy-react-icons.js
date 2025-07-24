// Dummy react-icons module for SSR compatibility
// This prevents react-icons from being processed during server-side rendering

// Export commonly used icons as empty components
export function FaExclamationTriangle() {
  return null;
}
export function FaRedo() {
  return null;
}
export function FaHome() {
  return null;
}
export function FaBars() {
  return null;
}
export function FaTimes() {
  return null;
}
export function FaGithubAlt() {
  return null;
}
export function FaAngellist() {
  return null;
}
export function FaLinkedin() {
  return null;
}
export function FaPhone() {
  return null;
}
export function FaRegArrowAltCircleRight() {
  return null;
}

// Define LazyImage to resolve the mysterious error
if (typeof window === 'undefined') {
  global.LazyImage = function () {
    return null;
  };
}

// Default export for any other icons
function DummyIcon() {
  return null;
}

export default DummyIcon;
