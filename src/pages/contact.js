import React from 'react';
import styled from 'styled-components';

import Layout from '../components/layout';
import SEO from '../components/seo';

const StyledContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;

  @media (max-width: 768px) {
    padding: 0 20px;
    
    .contact-form-card {
      border-radius: 20px !important;
      padding: 32px !important;
    }
  }

  @media (max-width: 600px) {
    padding: 0 16px;
    
    .contact-form-card {
      border-radius: 16px !important;
      padding: 24px !important;
    }
  }
  
  @media (max-width: 480px) {
    padding: 0 12px;
    
    .contact-form-card {
      border-radius: 12px !important;
      padding: 20px !important;
    }
  }
`;

const StyledBox = styled.div`
  margin-bottom: ${(props) => (props.mb ? `${props.mb * 8}px` : '0')};
  margin-top: ${(props) => (props.mt ? `${props.mt * 8}px` : '0')};
  text-align: ${(props) => props.textAlign || 'inherit'};
  display: ${(props) => props.display || 'block'};
  padding: ${(props) => (props.p ? `${props.p * 8}px` : '0')};
  padding-top: ${(props) => (props.pt ? `${props.pt * 8}px` : 'inherit')};
  position: ${(props) => props.position || 'static'};
  left: ${(props) => props.left || 'auto'};
  width: ${(props) => props.width || 'auto'};
  height: ${(props) => props.height || 'auto'};
  overflow: ${(props) => props.overflow || 'visible'};
  border-radius: ${(props) => (props.borderRadius ? `${props.borderRadius * 8}px` : '0')};
`;

const getTypographyFontWeight = (variant) => {
  if (variant === 'subtitle2') return 500;
  return 400;
};

const getTypographyFontSize = (variant) => {
  switch (variant) {
    case 'h2':
      return '2.125rem';
    case 'h3':
    case 'h5':
      return '1.5rem';
    case 'body1':
      return '1rem';
    case 'body2':
    case 'subtitle2':
      return '0.875rem';
    default:
      return '1rem';
  }
};

const getTypographyLineHeight = (variant) => {
  switch (variant) {
    case 'h2':
      return 1.235;
    case 'h3':
    case 'h5':
      return 1.334;
    case 'body1':
      return 1.5;
    case 'body2':
      return 1.43;
    case 'subtitle2':
      return 1.57;
    default:
      return 1.5;
  }
};

const getTypographyLetterSpacing = (variant) => {
  switch (variant) {
    case 'h2':
      return '0.00735em';
    case 'h3':
    case 'h5':
      return 0;
    case 'body1':
      return '0.00938em';
    case 'body2':
      return '0.01071em';
    case 'subtitle2':
      return '0.00714em';
    default:
      return '0.00938em';
  }
};

const Typography = styled.div`
  margin: 0;
  font-family: inherit;
  font-weight: ${(props) => getTypographyFontWeight(props.variant)};
  font-size: ${(props) => getTypographyFontSize(props.variant)};
  line-height: ${(props) => getTypographyLineHeight(props.variant)};
  letter-spacing: ${(props) => getTypographyLetterSpacing(props.variant)};
  color: ${(props) => {
    // Use CSS variables that work with theme switching
    if (props.color === 'text.secondary') {
      return 'var(--text-secondary-color)';
    }
    return 'var(--text-color)';
  }};
  text-align: ${(props) => props.align || 'inherit'};
  margin-bottom: ${(props) => {
    if (props.gutterBottom) return '0.35em';
    if (props.paragraph) return '16px';
    return '0';
  }};
  transition: color 0.3s ease;
`;

// Simple icon components using Unicode symbols

const SendIcon = styled.span`
  font-size: 18px;
  color: inherit;
  &::before {
    content: '→';
  }
`;

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-sizing: border-box;
  background-color: transparent;
  outline: 0;
  border: 0;
  margin: 0;
  cursor: pointer;
  user-select: none;
  vertical-align: middle;
  appearance: none;
  text-decoration: none;
  font-family: inherit;
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.75;
  letter-spacing: 0.02857em;
  text-transform: uppercase;
  min-width: 64px;
  padding: 6px 16px;
  border-radius: 4px;
  transition:
    background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;

  ${(props) =>
    props.variant === 'contained' &&
    props.color === 'primary' &&
    `
    color: #fff;
    background-color: #1976d2;
    box-shadow: 0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12);
    
    &:hover {
      background-color: #1565c0;
      box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);
    }
  `}

  ${(props) =>
    props.variant === 'contained' &&
    props.color === 'success' &&
    `
    color: #fff;
    background-color: #2e7d32;
    box-shadow: 0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12);
    
    &:hover {
      background-color: #1b5e20;
      box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);
    }
  `}
  
  ${(props) =>
    props.variant === 'outlined' &&
    props.color === 'success' &&
    `
    color: #2e7d32;
    border: 1px solid rgba(46, 125, 50, 0.5);
    
    &:hover {
      border: 1px solid #2e7d32;
      background-color: rgba(46, 125, 50, 0.04);
    }
  `}
  
  ${(props) =>
    props.size === 'large' &&
    `
    padding: 8px 22px;
    font-size: 0.9375rem;
  `}
  
  ${(props) =>
    props.size === 'small' &&
    `
    padding: 4px 10px;
    font-size: 0.8125rem;
  `}
  
  &:disabled {
    opacity: 0.26;
    cursor: default;
    pointer-events: none;
  }

  margin-top: ${(props) => (props.mt ? `${props.mt * 8}px` : '0')};
  border-radius: ${(props) => (props.borderRadius ? `${props.borderRadius}px` : '4px')};
  padding-left: ${(props) => (props.px ? `${props.px * 8}px` : 'inherit')};
  padding-right: ${(props) => (props.px ? `${props.px * 8}px` : 'inherit')};
  text-transform: ${(props) => props.textTransform || 'uppercase'};

  .button-end-icon {
    margin-left: 8px;
    display: inherit;
  }
`;

const StyledAlert = styled.div`
  padding: 24px;
  border-radius: 16px;
  border: 2px solid transparent;
  font-family: inherit;
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.6;
  letter-spacing: 0.01071em;
  display: flex;
  flex-direction: column;
  margin-bottom: ${(props) => (props.mb ? `${props.mb * 8}px` : '0')};
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;

  ${(props) =>
    props.severity === 'success' &&
    `
    color: #1b5e20;
    background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c8 100%);
    border-color: #4caf50;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #4caf50, #66bb6a, #81c784);
    }
    
    @media (prefers-color-scheme: dark) {
      color: #c8e6c8;
      background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%);
      border-color: #66bb6a;
      box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.3);
    }
  `}

  ${(props) =>
    props.severity === 'error' &&
    `
    color: #c62828;
    background: linear-gradient(135deg, #ffeaea 0%, #ffcdd2 100%);
    border-color: #f44336;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #f44336, #ef5350, #e57373);
    }
    
    @media (prefers-color-scheme: dark) {
      color: #ffcdd2;
      background: linear-gradient(135deg, #c62828 0%, #d32f2f 100%);
      border-color: #ef5350;
      box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.3);
    }
  `}
  
  border: ${(props) => props.border || '2px solid transparent'};
  border-color: ${(props) => props.borderColor || 'inherit'};
  background: ${(props) => props.backgroundColor || 'inherit'};
  animation: ${(props) => props.animation || 'none'};

  @keyframes slideInScale {
    0% {
      opacity: 0;
      transform: translateY(-30px) scale(0.9);
    }
    60% {
      transform: translateY(8px) scale(1.05);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes fadeInUp {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const StyledLink = styled.a`
  color: #1565c0;
  text-decoration: underline;
  text-decoration-color: #1565c0;
  text-decoration-thickness: ${(props) => props.textDecorationThickness || '1px'};
  text-underline-offset: ${(props) => props.textUnderlineOffset || '2px'};
  cursor: pointer;

  &:hover {
    text-decoration-color: #0d47a1;
    color: ${(props) => props.hoverColor || '#0d47a1'};
  }

  &:visited {
    color: #1565c0;
    text-decoration-color: #1565c0;
  }

  @media (prefers-color-scheme: dark) {
    color: #64b5f6;
    text-decoration-color: #64b5f6;

    &:hover {
      color: #42a5f5;
      text-decoration-color: #42a5f5;
    }

    &:visited {
      color: #64b5f6;
      text-decoration-color: #64b5f6;
    }
  }
`;

const StyledTextField = styled.div`
  margin-bottom: 28px;
  position: relative;

  label {
    display: block;
    margin-bottom: 12px;
    font-weight: 600;
    color: var(--text-color);
    font-size: 1.1rem;
    letter-spacing: 0.02em;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 0;
      height: 2px;
      background: linear-gradient(135deg, #1565c0 0%, #e91e63 100%);
      transition: width 0.3s ease;
    }
  }

  &:focus-within label::after {
    width: 100%;
  }

  input,
  textarea {
    width: 100%;
    padding: 20px 18px;
    border: 2px solid rgba(0, 0, 0, 0.12);
    border-radius: 12px;
    font-size: 1.1rem;
    font-family: inherit;
    background: var(--paper-color);
    color: var(--text-color);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-sizing: border-box;
    position: relative;
    z-index: 1;
    
    &:hover {
      border-color: rgba(25, 118, 210, 0.4);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      transform: translateY(-1px);
    }

    &:focus {
      outline: none;
      border-color: #1976d2;
      box-shadow: 
        0 0 0 3px rgba(25, 118, 210, 0.15),
        0 4px 16px rgba(25, 118, 210, 0.2);
      transform: translateY(-2px);
    }

    &::placeholder {
      color: var(--text-secondary-color);
      opacity: 0.7;
      font-style: italic;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      background: rgba(0, 0, 0, 0.04);
    }

    @media (prefers-color-scheme: dark) {
      border-color: rgba(255, 255, 255, 0.15);
      background: rgba(255, 255, 255, 0.05);
      
      &:hover {
        border-color: rgba(144, 202, 249, 0.4);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      }

      &:focus {
        border-color: #90caf9;
        box-shadow: 
          0 0 0 3px rgba(144, 202, 249, 0.25),
          0 4px 16px rgba(144, 202, 249, 0.3);
      }

      &:disabled {
        background: rgba(255, 255, 255, 0.02);
      }
    }
  }

  textarea {
    resize: vertical;
    min-height: 140px;
    max-height: 300px;
    line-height: 1.6;
  }

  /* Floating label effect for better UX */
  &.focused label,
  &.has-value label {
    transform: translateY(-2px) scale(0.95);
    color: #1976d2;
    
    @media (prefers-color-scheme: dark) {
      color: #90caf9;
    }
  }

  /* Responsive design improvements */
  @media (max-width: 768px) {
    margin-bottom: 24px;
    
    label {
      font-size: 1rem;
      margin-bottom: 10px;
    }
    
    input,
    textarea {
      padding: 16px 14px;
      font-size: 1rem;
      border-radius: 10px;
    }
    
    textarea {
      min-height: 120px;
    }
  }
  
  @media (max-width: 480px) {
    margin-bottom: 20px;
    
    label {
      font-size: 0.95rem;
      margin-bottom: 8px;
    }
    
    input,
    textarea {
      padding: 14px 12px;
      font-size: 0.95rem;
      border-radius: 8px;
    }
    
    textarea {
      min-height: 100px;
    }
  }
`;

function Contact() {
  const [formData, setFormData] = React.useState(() => ({
    name: '',
    email: '',
    message: '',
  }));
  const [formStatus, setFormStatus] = React.useState(() => '');
  const [errorMessage, setErrorMessage] = React.useState(() => '');
  const [isSubmitting, setIsSubmitting] = React.useState(() => false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus('');
    setErrorMessage('');

    // Basic form validation with specific error messages
    if (!formData.name.trim()) {
      setFormStatus('error');
      setErrorMessage('Please enter your name.');
      setIsSubmitting(false);
      return;
    }

    if (!formData.email.trim()) {
      setFormStatus('error');
      setErrorMessage('Please enter your email address.');
      setIsSubmitting(false);
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setFormStatus('error');
      setErrorMessage('Please enter a valid email address.');
      setIsSubmitting(false);
      return;
    }

    if (!formData.message.trim()) {
      setFormStatus('error');
      setErrorMessage('Please enter your message.');
      setIsSubmitting(false);
      return;
    }

    const form = e.target;
    const formDataNetlify = new FormData(form);

    // Try native Netlify form submission first, then fallback to fetch
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formDataNetlify).toString(),
    })
      .then((response) => {
        if (response.ok) {
          setFormStatus('success');
          setFormData({ name: '', email: '', message: '' });
          // Scroll to top of form to show success message
          const formElement = e.target;
          const formTop = formElement.getBoundingClientRect().top + window.pageYOffset - 100;
          window.scrollTo({ top: formTop, behavior: 'smooth' });
        } else if (response.status === 404) {
          throw new Error('Netlify form handler not found. Please check form configuration.');
        } else if (response.status >= 500) {
          throw new Error('Server error occurred. Please try again later.');
        } else if (response.status === 429) {
          throw new Error('Too many requests. Please wait a moment before trying again.');
        } else {
          throw new Error(
            `Form submission failed with status ${response.status}. Please try again.`
          );
        }
      })
      .catch((error) => {
        setFormStatus('error');

        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          setErrorMessage('Network error: Please check your internet connection and try again.');
        } else if (error.message.includes('Netlify form handler not found')) {
          setErrorMessage(
            'Form configuration error. Please contact me directly at maxjeffwell@gmail.com.'
          );
        } else if (error.message.includes('Server error')) {
          setErrorMessage(
            'Server error occurred. Please try again in a few minutes or contact me directly.'
          );
        } else if (error.message.includes('Too many requests')) {
          setErrorMessage('Too many attempts. Please wait a moment before trying again.');
        } else {
          setErrorMessage(
            error.message ||
              'An unexpected error occurred. Please try again or contact me directly.'
          );
        }

        // Clear error message after 10 seconds
        setTimeout(() => {
          setFormStatus('');
          setErrorMessage('');
        }, 10000);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <Layout>
      <SEO
        title="Contact"
        description="Hire Jeff Maxwell for web development projects. Full stack React & Node.js developer available for freelance work and collaborations."
        pathname="/contact/"
        keywords={[
          `contact web developer`,
          `hire full stack developer`,
          `freelance developer`,
          `web development services`,
          `Jeff Maxwell contact`,
        ]}
      />
      {/* Hidden form for Netlify to detect - MUST be outside NoSsr */}
      <form name="contact" data-netlify="true" data-netlify-honeypot="bot-field" hidden>
        <input type="hidden" name="form-name" value="contact" />
        <label htmlFor="netlify-name">
          Name: <input type="text" name="name" id="netlify-name" />
        </label>
        <label htmlFor="netlify-email">
          Email: <input type="email" name="email" id="netlify-email" />
        </label>
        <label htmlFor="netlify-message">
          Message: <textarea name="message" id="netlify-message" />
        </label>
        <label htmlFor="netlify-bot-field">
          Bot field: <input type="text" name="bot-field" id="netlify-bot-field" />
        </label>
      </form>
      <StyledContainer>
        <StyledBox
          as="section"
          aria-labelledby="contact-header"
          mb={8}
          style={{ textAlign: 'center', paddingTop: '40px' }}
        >
          <Typography
            as="h1"
            id="contact-header"
            style={{
              fontSize: 'clamp(2.5rem, 8vw, 4rem)',
              fontWeight: 700,
              lineHeight: 1.2,
              marginBottom: '24px',
              background: 'linear-gradient(135deg, #1565c0 0%, #9c27b0 50%, #e91e63 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em',
            }}
          >
            Let&apos;s Connect
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            style={{
              fontSize: '1.25rem',
              fontWeight: 400,
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: 1.5,
            }}
          >
            I&apos;m always interested in new opportunities and collaborations
          </Typography>
        </StyledBox>

        <StyledBox as="section" aria-labelledby="contact-methods" mb={6}>
          <Typography
            as="h2"
            variant="h2"
            id="contact-methods"
            style={{
              position: 'absolute',
              left: '-10000px',
              width: '1px',
              height: '1px',
              overflow: 'hidden',
            }}
          >
            Contact Information and Methods
          </Typography>

          {/* Get in Touch Card */}
          <div
            style={{
              background: 'var(--paper-color)',
              borderRadius: '24px',
              padding: '40px',
              marginBottom: '32px',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08), 0px 1px 4px rgba(0, 0, 0, 0.04)',
              transition: 'background-color 0.3s ease',
            }}
          >
            <Typography
              as="h3"
              style={{
                fontSize: '1.75rem',
                fontWeight: 600,
                color: 'var(--text-color)',
                marginBottom: '16px',
              }}
              id="get-in-touch"
            >
              Get in Touch
            </Typography>
            <Typography
              variant="body1"
              style={{
                color: 'var(--text-secondary-color)',
                marginBottom: '32px',
                fontSize: '1.125rem',
                lineHeight: 1.5,
              }}
            >
              Whether you have a project in mind, need technical expertise, or just want to say
              hello, I&apos;d love to hear from you. Feel free to reach out through any of these
              channels:
            </Typography>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px',
                  borderRadius: '12px',
                  background: 'var(--bg-color)',
                  transition: 'all 0.2s ease',
                }}
              >
                <div
                  style={{
                    fontSize: '1.5rem',
                    color: '#1565c0',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  ✉️
                </div>
                <div>
                  <Typography
                    variant="subtitle2"
                    style={{ fontWeight: 600, marginBottom: '4px', color: 'var(--text-color)' }}
                  >
                    Email
                  </Typography>
                  <StyledLink
                    href="mailto:maxjeffwell@gmail.com"
                    style={{ fontSize: '1rem', fontWeight: 500 }}
                  >
                    maxjeffwell@gmail.com
                  </StyledLink>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px',
                  borderRadius: '12px',
                  background: 'var(--bg-color)',
                  transition: 'all 0.2s ease',
                }}
              >
                <div
                  style={{
                    fontSize: '1.5rem',
                    color: '#1565c0',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  📞
                </div>
                <div>
                  <Typography
                    variant="subtitle2"
                    style={{ fontWeight: 600, marginBottom: '4px', color: 'var(--text-color)' }}
                  >
                    Phone
                  </Typography>
                  <StyledLink
                    href="tel:+01-508-395-2008"
                    style={{ fontSize: '1rem', fontWeight: 500 }}
                  >
                    (508) 395-2008
                  </StyledLink>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px',
                  borderRadius: '12px',
                  background: 'var(--bg-color)',
                  transition: 'all 0.2s ease',
                }}
              >
                <div
                  style={{
                    fontSize: '1.5rem',
                    color: '#1565c0',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  🔗
                </div>
                <div>
                  <Typography
                    variant="subtitle2"
                    style={{ fontWeight: 600, marginBottom: '4px', color: 'var(--text-color)' }}
                  >
                    GitHub
                  </Typography>
                  <StyledLink
                    href="https://github.com/maxjeffwell"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '1rem', fontWeight: 500 }}
                  >
                    View my projects
                  </StyledLink>
                </div>
              </div>
            </div>
          </div>

          {/* Send a Message Card */}
          <div
            style={{
              background: 'var(--paper-color)',
              borderRadius: '28px',
              padding: '48px',
              marginBottom: '32px',
              boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.12), 0px 2px 8px rgba(0, 0, 0, 0.08)',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
            }}
            className="contact-form-card"
          >
            <Typography
              as="h3"
              style={{
                fontSize: '1.75rem',
                fontWeight: 600,
                color: 'var(--text-color)',
                marginBottom: '16px',
              }}
              id="send-message"
            >
              Send a Message
            </Typography>
            <Typography
              variant="body1"
              style={{
                color: 'var(--text-secondary-color)',
                marginBottom: '32px',
                fontSize: '1.125rem',
                lineHeight: 1.5,
              }}
            >
              Have a specific question or project in mind? Drop me a message and I&apos;ll get back
              to you as soon as possible.
            </Typography>

            {formStatus === 'success' && (
              <StyledBox style={{ position: 'relative', marginBottom: '32px' }}>
                <StyledAlert
                  severity="success"
                  animation="slideInScale 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)"
                >
                  <div style={{ marginBottom: '16px' }}>
                    <Typography
                      variant="h4"
                      style={{
                        fontWeight: 'bold',
                        fontSize: '1.5rem',
                        marginBottom: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <span style={{ fontSize: '1.8rem' }}>🎉</span>
                      Success! Your Message Has Been Sent!
                    </Typography>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <Typography
                      variant="body1"
                      style={{
                        fontSize: '1.1rem',
                        lineHeight: '1.6',
                        marginBottom: '8px',
                      }}
                    >
                      Thank you for reaching out! I appreciate your interest and will respond within
                      24 hours.
                    </Typography>
                    <Typography
                      variant="body2"
                      style={{
                        fontStyle: 'italic',
                        opacity: 0.8,
                        fontSize: '0.95rem',
                      }}
                    >
                      Check your email for a confirmation of your message.
                    </Typography>
                  </div>

                  <StyledButton
                    variant="outlined"
                    onClick={() => {
                      setFormStatus('');
                      setFormData({ name: '', email: '', message: '' });
                    }}
                    style={{
                      alignSelf: 'flex-start',
                      borderColor: '#4caf50',
                      color: '#4caf50',
                      fontWeight: '600',
                      padding: '8px 20px',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      textTransform: 'none',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#4caf50';
                      e.target.style.color = 'white';
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 4px 8px rgba(76, 175, 80, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#4caf50';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    Send Another Message
                  </StyledButton>
                </StyledAlert>
              </StyledBox>
            )}

            {formStatus === 'error' && (
              <StyledAlert severity="error" mb={3}>
                ❌{' '}
                {errorMessage ||
                  'Sorry, there was an error sending your message. Please ensure all fields are filled out correctly, or contact me directly at maxjeffwell@gmail.com.'}
                {!errorMessage.includes('maxjeffwell@gmail.com') && (
                  <>
                    {' '}
                    You can also reach me directly at{' '}
                    <StyledLink href="mailto:maxjeffwell@gmail.com">
                      maxjeffwell@gmail.com
                    </StyledLink>
                  </>
                )}
              </StyledAlert>
            )}

            <StyledBox
              as="form"
              onSubmit={handleSubmit}
              method="POST"
              mt={4}
              name="contact"
              data-netlify="true"
              data-netlify-honeypot="bot-field"
              style={{
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                padding: '32px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                ...(formStatus === 'success' && {
                  opacity: 0.75,
                  transform: 'scale(0.98)',
                  filter: 'blur(0.5px)',
                }),
              }}
            >
              <input type="hidden" name="form-name" value="contact" />
              <StyledBox position="absolute" left="-5000px" overflow="hidden">
                <label htmlFor="bot-field-input">
                  Don&apos;t fill this out if you&apos;re human:
                  <input
                    type="text"
                    name="bot-field"
                    id="bot-field-input"
                    tabIndex="-1"
                    autoComplete="off"
                  />
                </label>
              </StyledBox>

              <StyledTextField className={formData.name ? 'has-value' : ''}>
                <label htmlFor="contact-name">Your Name *</label>
                <input
                  type="text"
                  id="contact-name"
                  name="name"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={(e) => e.target.parentElement.classList.add('focused')}
                  onBlur={(e) => e.target.parentElement.classList.remove('focused')}
                  required
                  disabled={isSubmitting}
                  placeholder="What should I call you?"
                />
              </StyledTextField>
              <StyledTextField className={formData.email ? 'has-value' : ''}>
                <label htmlFor="contact-email">Your Email *</label>
                <input
                  type="email"
                  id="contact-email"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={(e) => e.target.parentElement.classList.add('focused')}
                  onBlur={(e) => e.target.parentElement.classList.remove('focused')}
                  required
                  disabled={isSubmitting}
                  placeholder="your.email@example.com"
                />
              </StyledTextField>
              <StyledTextField className={formData.message ? 'has-value' : ''}>
                <label htmlFor="contact-message">Your Message *</label>
                <textarea
                  id="contact-message"
                  name="message"
                  autoComplete="off"
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={(e) => e.target.parentElement.classList.add('focused')}
                  onBlur={(e) => e.target.parentElement.classList.remove('focused')}
                  required
                  rows={5}
                  disabled={isSubmitting}
                  placeholder="Tell me about your project, ideas, or just say hello..."
                />
              </StyledTextField>
              <StyledButton
                type="submit"
                variant="contained"
                color={formStatus === 'success' ? 'success' : 'primary'}
                size="large"
                disabled={isSubmitting || formStatus === 'success'}
                style={{
                  background:
                    formStatus === 'success'
                      ? 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)'
                      : 'linear-gradient(135deg, #1565c0 0%, #e91e63 100%)',
                  color: 'white',
                  padding: '18px 36px',
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  borderRadius: '16px',
                  textTransform: 'none',
                  boxShadow: formStatus === 'success' 
                    ? '0px 12px 24px rgba(46, 125, 50, 0.4), 0px 4px 12px rgba(76, 175, 80, 0.3)'
                    : '0px 12px 24px rgba(25, 101, 192, 0.4), 0px 4px 12px rgba(233, 30, 99, 0.3)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  marginTop: '32px',
                  position: 'relative',
                  overflow: 'hidden',
                  transform: isSubmitting ? 'scale(0.98)' : 'scale(1)',
                  width: '100%',
                  '@media (max-width: 768px)': {
                    padding: '16px 28px',
                    fontSize: '1.1rem',
                    marginTop: '24px',
                  },
                  '@media (max-width: 480px)': {
                    padding: '14px 24px',
                    fontSize: '1rem',
                    borderRadius: '12px',
                    marginTop: '20px',
                  },
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting && formStatus !== 'success') {
                    e.target.style.transform = 'translateY(-2px) scale(1.02)';
                    e.target.style.boxShadow = '0px 16px 32px rgba(25, 101, 192, 0.5), 0px 6px 16px rgba(233, 30, 99, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting && formStatus !== 'success') {
                    e.target.style.transform = 'translateY(0) scale(1)';
                    e.target.style.boxShadow = '0px 12px 24px rgba(25, 101, 192, 0.4), 0px 4px 12px rgba(233, 30, 99, 0.3)';
                  }
                }}
              >
                <span>
                  {(() => {
                    if (isSubmitting) return 'Sending...';
                    if (formStatus === 'success') return 'Message Sent!';
                    return 'Send Message';
                  })()}
                </span>
                <span className="button-end-icon">
                  {formStatus === 'success' ? '✓' : <SendIcon />}
                </span>
              </StyledButton>
            </StyledBox>
          </div>
        </StyledBox>

        <StyledBox
          as="section"
          aria-labelledby="availability"
          mt={6}
          style={{ textAlign: 'center' }}
        >
          <Typography
            as="h2"
            variant="h2"
            id="availability"
            style={{
              position: 'absolute',
              left: '-10000px',
              width: '1px',
              height: '1px',
              overflow: 'hidden',
            }}
          >
            Current Availability
          </Typography>
          <Typography
            variant="body2"
            style={{
              color: 'var(--text-secondary-color)',
              fontSize: '1.25rem',
              fontWeight: 400,
              lineHeight: 1.6,
            }}
          >
            Currently open to new opportunities and exciting projects. Let&apos;s build something
            together!
          </Typography>
        </StyledBox>
      </StyledContainer>
    </Layout>
  );
}

export default Contact;
