/**
 * Focus management utilities for accessibility
 */

/**
 * Get all focusable elements within a container
 * @param {HTMLElement} container - The container to search within
 * @returns {NodeList} List of focusable elements
 */
export const getFocusableElements = (container) => {
  if (!container) return [];

  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'textarea:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
    'audio[controls]',
    'video[controls]',
    'iframe',
    'object',
    'embed',
    'details summary',
  ].join(', ');

  return container.querySelectorAll(focusableSelectors);
};

/**
 * Focus an element safely with error handling
 * @param {HTMLElement} element - Element to focus
 * @param {Object} options - Focus options
 */
export const safeFocus = (element, options = {}) => {
  if (!element || typeof element.focus !== 'function') {
    console.warn('safeFocus: Invalid element provided');
    return false;
  }

  try {
    element.focus(options);

    // Scroll into view if requested
    if (options.scrollIntoView) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        ...options.scrollOptions,
      });
    }

    return true;
  } catch (error) {
    console.warn('safeFocus: Error focusing element', error);
    return false;
  }
};

/**
 * Create a focus trap within a container
 * @param {HTMLElement} container - Container to trap focus within
 * @returns {Function} Cleanup function to remove the trap
 */
export const trapFocus = (container) => {
  if (!container) return () => {};

  const focusableElements = getFocusableElements(container);
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (e) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      // Shift + Tab - moving backwards
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable?.focus();
      }
    } else {
      // Tab - moving forwards
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable?.focus();
      }
    }
  };

  container.addEventListener('keydown', handleKeyDown);

  // Focus the first element
  if (firstFocusable) {
    safeFocus(firstFocusable);
  }

  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
};

/**
 * Save and restore focus for modal/dialog interactions
 * @returns {Object} Focus management functions
 */
export const createFocusManager = () => {
  let previouslyFocusedElement = null;

  return {
    save: () => {
      previouslyFocusedElement = document.activeElement;
    },

    restore: () => {
      if (previouslyFocusedElement && typeof previouslyFocusedElement.focus === 'function') {
        safeFocus(previouslyFocusedElement);
      }
      previouslyFocusedElement = null;
    },

    clear: () => {
      previouslyFocusedElement = null;
    },
  };
};

/**
 * Announce text to screen readers
 * @param {string} message - Message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
export const announceToScreenReader = (message, priority = 'polite') => {
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', priority);
  announcer.setAttribute('aria-atomic', 'true');
  announcer.className = 'sr-only';
  announcer.style.cssText = `
    position: absolute;
    left: -10000px;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
  `;

  document.body.appendChild(announcer);
  announcer.textContent = message;

  // Clean up after announcement
  setTimeout(() => {
    if (document.body.contains(announcer)) {
      document.body.removeChild(announcer);
    }
  }, 1000);
};

/**
 * Check if focus is within a container
 * @param {HTMLElement} container - Container to check
 * @returns {boolean} True if focus is within container
 */
export const isFocusWithin = (container) => {
  if (!container) return false;
  return container.contains(document.activeElement);
};

/**
 * Move focus to next focusable element in sequence
 * @param {HTMLElement} currentElement - Current focused element
 * @param {HTMLElement} container - Container to search within (optional)
 */
export const focusNext = (currentElement, container = document.body) => {
  const focusableElements = Array.from(getFocusableElements(container));
  const currentIndex = focusableElements.indexOf(currentElement);

  if (currentIndex >= 0 && currentIndex < focusableElements.length - 1) {
    safeFocus(focusableElements[currentIndex + 1]);
  }
};

/**
 * Move focus to previous focusable element in sequence
 * @param {HTMLElement} currentElement - Current focused element
 * @param {HTMLElement} container - Container to search within (optional)
 */
export const focusPrevious = (currentElement, container = document.body) => {
  const focusableElements = Array.from(getFocusableElements(container));
  const currentIndex = focusableElements.indexOf(currentElement);

  if (currentIndex > 0) {
    safeFocus(focusableElements[currentIndex - 1]);
  }
};

export default {
  getFocusableElements,
  safeFocus,
  trapFocus,
  createFocusManager,
  announceToScreenReader,
  isFocusWithin,
  focusNext,
  focusPrevious,
};
