import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';

/**
 * ScreenReaderAnnouncement - A utility component for making announcements to screen readers
 *
 * @param {string} message - The message to announce
 * @param {string} priority - Either 'polite' (default) or 'assertive' for urgent announcements
 * @param {boolean} visible - Whether the announcement should also be visually present (default: false)
 * @param {string} role - ARIA role, defaults to 'status' for polite, 'alert' for assertive
 */
const ScreenReaderAnnouncement = ({
  message,
  priority = 'polite',
  visible = false,
  role,
  ...props
}) => {
  // Auto-determine role based on priority if not specified
  const ariaRole = role || (priority === 'assertive' ? 'alert' : 'status');

  const visuallyHiddenStyles = css`
    position: absolute;
    left: -10000px;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
  `;

  const visibleStyles = css`
    /* Styles for visible announcements can be customized */
    margin: 0.5rem 0;
    padding: 0.5rem;
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.05);
  `;

  if (!message) {
    return null;
  }

  return (
    <div
      role={ariaRole}
      aria-live={priority}
      aria-atomic="true"
      css={visible ? visibleStyles : visuallyHiddenStyles}
      {...props}
    >
      {message}
    </div>
  );
};

ScreenReaderAnnouncement.propTypes = {
  message: PropTypes.string.isRequired,
  priority: PropTypes.oneOf(['polite', 'assertive']),
  visible: PropTypes.bool,
  role: PropTypes.string,
};

export default ScreenReaderAnnouncement;

/**
 * Hook for managing screen reader announcements
 *
 * Usage:
 * const announce = useScreenReaderAnnouncement();
 * announce('Form submitted successfully!');
 * announce('Error occurred!', 'assertive');
 */
export const useScreenReaderAnnouncement = () => {
  const [announcement, setAnnouncement] = React.useState('');
  const [priority, setPriority] = React.useState('polite');

  const announce = React.useCallback((message, announcementPriority = 'polite') => {
    // Clear any existing announcement first
    setAnnouncement('');

    // Set new announcement after a brief delay to ensure screen readers pick it up
    setTimeout(() => {
      setAnnouncement(message);
      setPriority(announcementPriority);
    }, 10);

    // Clear the announcement after it's been read
    setTimeout(() => {
      setAnnouncement('');
    }, 3000);
  }, []);

  return {
    announce,
    announcement,
    priority,
    AnnouncementComponent: () => (
      <ScreenReaderAnnouncement message={announcement} priority={priority} />
    ),
  };
};
