import React, { useState } from 'react';

// Email obfuscation component to protect from spam harvesters
const ProtectedEmail = ({
  children,
  className = '',
  style = {},
  title = 'Send email to Jeff Maxwell',
  'aria-label': ariaLabel = 'Send email to jeff@el-jefe.me',
  subject = '',
  body = '',
  ...props
}) => {
  const [isRevealed, setIsRevealed] = useState(false);

  // Obfuscated email parts
  const emailParts = {
    user: 'jeff',
    domain: 'el-jefe',
    tld: 'me',
  };

  // Create the email address
  const email = `${emailParts.user}@${emailParts.domain}.${emailParts.tld}`;

  // Create mailto URL with optional subject and body
  const createMailtoUrl = () => {
    let url = `mailto:${email}`;
    const params = [];

    if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
    if (body) params.push(`body=${encodeURIComponent(body)}`);

    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }

    return url;
  };

  const handleClick = (e) => {
    e.preventDefault();

    if (!isRevealed) {
      setIsRevealed(true);
      // Small delay before opening email client
      setTimeout(() => {
        window.location.href = createMailtoUrl();
      }, 100);
    } else {
      window.location.href = createMailtoUrl();
    }
  };

  const handleMouseEnter = () => {
    if (!isRevealed) {
      setIsRevealed(true);
    }
  };

  return (
    <a
      href={isRevealed ? createMailtoUrl() : '#'}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      className={className}
      style={style}
      title={title}
      aria-label={ariaLabel}
      {...props}
    >
      {children || (isRevealed ? email : 'Click to reveal email')}
    </a>
  );
};

export default ProtectedEmail;
