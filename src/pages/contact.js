import React from 'react';
import styled from 'styled-components';

import Layout from '../components/layout';
import SEO from '../components/seo';

const StyledContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;

  @media (max-width: 600px) {
    padding: 0 16px;
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

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${(props) => (props.spacing ? `${props.spacing * 8}px` : '16px')};

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const GridItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const Typography = styled.div`
  margin: 0;
  font-family: inherit;
  font-weight: ${props => props.variant === 'h2' ? 400 : props.variant === 'h3' ? 400 : props.variant === 'h5' ? 400 : props.variant === 'subtitle2' ? 500 : props.variant === 'body2' ? 400 : 400};
  font-size: ${props => 
    props.variant === 'h2' ? '2.125rem' :
    props.variant === 'h3' ? '1.5rem' :
    props.variant === 'h5' ? '1.5rem' :
    props.variant === 'body1' ? '1rem' :
    props.variant === 'body2' ? '0.875rem' :
    props.variant === 'subtitle2' ? '0.875rem' :
    '1rem'
  };
  line-height: ${props => 
    props.variant === 'h2' ? 1.235 :
    props.variant === 'h3' ? 1.334 :
    props.variant === 'h5' ? 1.334 :
    props.variant === 'body1' ? 1.5 :
    props.variant === 'body2' ? 1.43 :
    props.variant === 'subtitle2' ? 1.57 :
    1.5
  };
  letter-spacing: ${props => 
    props.variant === 'h2' ? '0.00735em' :
    props.variant === 'h3' ? 0 :
    props.variant === 'h5' ? 0 :
    props.variant === 'body1' ? '0.00938em' :
    props.variant === 'body2' ? '0.01071em' :
    props.variant === 'subtitle2' ? '0.00714em' :
    '0.00938em'
  };
  color: ${props => 
    props.color === 'text.secondary' ? 'rgba(0, 0, 0, 0.6)' :
    'rgba(0, 0, 0, 0.87)'
  };
  text-align: ${props => props.align || 'inherit'};
  margin-bottom: ${props => props.gutterBottom ? '0.35em' : props.paragraph ? '16px' : '0'};
  
  @media (prefers-color-scheme: dark) {
    color: ${props => 
      props.color === 'text.secondary' ? 'rgba(255, 255, 255, 0.7)' :
      'rgba(255, 255, 255, 0.87)'
    };
  }
`;

const GradientText = styled(Typography)`
  background: linear-gradient(45deg, #fc4a1a, #f7b733);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
`;

// Simple icon components using Unicode symbols
const EmailIcon = styled.span`
  font-size: 24px;
  color: #1976d2;
  &::before {
    content: '✉';
  }
`;

const PhoneIcon = styled.span`
  font-size: 24px;
  color: #1976d2;
  &::before {
    content: '📞';
  }
`;

const GitHubIcon = styled.span`
  font-size: 24px;
  color: #1976d2;
  &::before {
    content: '🔗';
  }
`;

const SendIcon = styled.span`
  font-size: 18px;
  color: inherit;
  &::before {
    content: '→';
  }
`;

const ContactCard = styled.div`
  padding: 32px;
  border-radius: 16px;
  background: #ffffff;
  transition: all 0.3s ease;
  box-shadow:
    0px 2px 1px -1px rgba(0, 0, 0, 0.2),
    0px 1px 1px 0px rgba(0, 0, 0, 0.14),
    0px 1px 3px 0px rgba(0, 0, 0, 0.12);

  &:hover {
    transform: translateY(-4px);
    box-shadow:
      0px 5px 5px -3px rgba(0, 0, 0, 0.2),
      0px 8px 10px 1px rgba(0, 0, 0, 0.14),
      0px 3px 14px 2px rgba(0, 0, 0, 0.12);
  }

  @media (prefers-color-scheme: dark) {
    background: #1a1a1a;
    box-shadow:
      0px 2px 1px -1px rgba(255, 255, 255, 0.2),
      0px 1px 1px 0px rgba(255, 255, 255, 0.14),
      0px 1px 3px 0px rgba(255, 255, 255, 0.12);
  }
`;

const StyledPaper = styled.div`
  background-color: #ffffff;
  color: rgba(0, 0, 0, 0.87);
  transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  border-radius: 4px;
  box-shadow: ${(props) => {
    const elevation = props.elevation || 1;
    if (elevation === 2)
      return '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)';
    return '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)';
  }};
  padding: ${(props) => (props.p ? `${props.p * 8}px` : '0')};
  margin-bottom: ${(props) => (props.mb ? `${props.mb * 8}px` : '0')};
  border-radius: ${(props) => (props.borderRadius ? `${props.borderRadius * 8}px` : '4px')};

  @media (prefers-color-scheme: dark) {
    background-color: #424242;
    color: rgba(255, 255, 255, 0.87);
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
  padding: 6px 16px;
  border-radius: 4px;
  border: 1px solid transparent;
  font-family: inherit;
  font-weight: 400;
  font-size: 0.875rem;
  line-height: 1.43;
  letter-spacing: 0.01071em;
  display: flex;
  margin-bottom: ${(props) => (props.mb ? `${props.mb * 8}px` : '0')};

  ${(props) =>
    props.severity === 'success' &&
    `
    color: #1e4620;
    background-color: #d4e7d5;
    border-color: #4caf50;
    
    @media (prefers-color-scheme: dark) {
      color: #b8e6b8;
      background-color: #1b5e20;
    }
  `}

  ${(props) =>
    props.severity === 'error' &&
    `
    color: #5f2120;
    background-color: #f8d7da;
    border-color: #f44336;
    
    @media (prefers-color-scheme: dark) {
      color: #f8b2b2;
      background-color: #d32f2f;
    }
  `}
  
  border: ${(props) => props.border || '1px solid transparent'};
  border-color: ${(props) => props.borderColor || 'inherit'};
  background-color: ${(props) => props.backgroundColor || 'inherit'};
  animation: ${(props) => props.animation || 'none'};

  @keyframes slideInScale {
    0% {
      opacity: 0;
      transform: translateY(-20px) scale(0.95);
    }
    50% {
      transform: translateY(5px) scale(1.02);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
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
  margin-bottom: 24px;

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.87);
    font-size: 1rem;

    @media (prefers-color-scheme: dark) {
      color: rgba(255, 255, 255, 0.87);
    }
  }

  input,
  textarea {
    width: 100%;
    padding: 16px 14px;
    border: 1px solid rgba(0, 0, 0, 0.23);
    border-radius: 4px;
    font-size: 1rem;
    font-family: inherit;
    background-color: transparent;
    color: rgba(0, 0, 0, 0.87);
    transition:
      border-color 0.2s ease-in-out,
      box-shadow 0.2s ease-in-out;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: #1976d2;
      box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
    }

    &::placeholder {
      color: rgba(0, 0, 0, 0.6);
    }

    @media (prefers-color-scheme: dark) {
      color: rgba(255, 255, 255, 0.87);
      border-color: rgba(255, 255, 255, 0.23);

      &::placeholder {
        color: rgba(255, 255, 255, 0.6);
      }

      &:focus {
        border-color: #90caf9;
        box-shadow: 0 0 0 2px rgba(144, 202, 249, 0.2);
      }
    }
  }

  textarea {
    resize: vertical;
    min-height: 120px;
  }

  @media (prefers-color-scheme: dark) {
    background: linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(45, 45, 45, 0.9) 100%);
  }
`;

const ContactMethod = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  padding: 16px;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
    transform: translateX(8px);
  }

  @media (prefers-color-scheme: dark) {
    background-color: rgba(255, 255, 255, 0.08);

    &:hover {
      background-color: rgba(255, 255, 255, 0.12);
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

  const encode = (data) => {
    return Object.keys(data)
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
      .join('&');
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
    const formData_netlify = new FormData(form);

    // Try native Netlify form submission first, then fallback to fetch
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData_netlify).toString()
    })
      .then((response) => {
        console.log('Form submission response:', response.status, response.statusText);
        if (response.ok) {
          console.log('Form submitted successfully!');
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
        console.error('Form submission error:', error);
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
        <StyledBox as="section" aria-labelledby="contact-header" mb={8} style={{ textAlign: 'center', paddingTop: '40px' }}>
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
            Let's Connect
          </Typography>
          <Typography 
            variant="h5" 
            style={{
              fontSize: '1.25rem',
              color: 'rgba(0, 0, 0, 0.7)',
              fontWeight: 400,
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: 1.5,
            }}
          >
            I'm always interested in new opportunities and collaborations
          </Typography>
        </StyledBox>

        <StyledBox as="section" aria-labelledby="contact-methods" mb={6}>
          <Typography as="h2" variant="h2" id="contact-methods" style={{
            position: 'absolute',
            left: '-10000px',
            width: '1px',
            height: '1px',
            overflow: 'hidden',
          }}>
            Contact Information and Methods
          </Typography>
          
          {/* Get in Touch Card */}
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            padding: '40px',
            marginBottom: '32px',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08), 0px 1px 4px rgba(0, 0, 0, 0.04)',
          }}>
            <Typography 
              as="h3" 
              style={{
                fontSize: '1.75rem',
                fontWeight: 600,
                color: 'rgba(0, 0, 0, 0.87)',
                marginBottom: '16px'
              }}
              id="get-in-touch"
            >
              Get in Touch
            </Typography>
            <Typography 
              variant="body1" 
              style={{
                color: 'rgba(0, 0, 0, 0.7)',
                marginBottom: '32px',
                fontSize: '1.125rem',
                lineHeight: 1.5
              }}
            >
              Whether you have a project in mind, need technical expertise, or just want to say hello, I'd love to hear from you. Feel free to reach out through any of these channels:
            </Typography>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px',
                borderRadius: '12px',
                background: '#f8f9fa',
                transition: 'all 0.2s ease',
              }}>
                <div style={{
                  fontSize: '1.5rem',
                  color: '#1565c0',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  ✉️
                </div>
                <div>
                  <Typography variant="subtitle2" style={{ fontWeight: 600, marginBottom: '4px', color: 'rgba(0, 0, 0, 0.87)' }}>
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

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px',
                borderRadius: '12px',
                background: '#f8f9fa',
                transition: 'all 0.2s ease',
              }}>
                <div style={{
                  fontSize: '1.5rem',
                  color: '#1565c0',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  📞
                </div>
                <div>
                  <Typography variant="subtitle2" style={{ fontWeight: 600, marginBottom: '4px', color: 'rgba(0, 0, 0, 0.87)' }}>
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

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px',
                borderRadius: '12px',
                background: '#f8f9fa',
                transition: 'all 0.2s ease',
              }}>
                <div style={{
                  fontSize: '1.5rem',
                  color: '#1565c0',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  🔗
                </div>
                <div>
                  <Typography variant="subtitle2" style={{ fontWeight: 600, marginBottom: '4px', color: 'rgba(0, 0, 0, 0.87)' }}>
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
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            padding: '40px',
            marginBottom: '32px',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08), 0px 1px 4px rgba(0, 0, 0, 0.04)',
          }}>
            <Typography 
              as="h3" 
              style={{
                fontSize: '1.75rem',
                fontWeight: 600,
                color: 'rgba(0, 0, 0, 0.87)',
                marginBottom: '16px'
              }}
              id="send-message"
            >
              Send a Message
            </Typography>
            <Typography 
              variant="body1" 
              style={{
                color: 'rgba(0, 0, 0, 0.7)',
                marginBottom: '32px',
                fontSize: '1.125rem',
                lineHeight: 1.5
              }}
            >
              Have a specific question or project in mind? Drop me a message and I'll get back to you as soon as possible.
            </Typography>

                {formStatus === 'success' && (
                  <StyledBox style={{ position: 'relative', marginBottom: '24px' }}>
                    <StyledAlert
                      severity="success"
                      border="2px solid"
                      borderColor="#4caf50"
                      backgroundColor="#d4e7d5"
                      animation="slideInScale 0.5s ease-out"
                    >
                      <Typography variant="h5" gutterBottom style={{ fontWeight: 'bold' }}>
                        🎉 Success! Your Message Has Been Sent!
                      </Typography>
                      <Typography variant="body1">
                        Thank you for reaching out! I appreciate your interest and will respond
                        within 24 hours.
                      </Typography>
                      <Typography variant="body2" style={{ marginTop: '8px', fontStyle: 'italic' }}>
                        Check your email for a confirmation of your message.
                      </Typography>
                      <StyledButton
                        variant="outlined"
                        color="success"
                        size="small"
                        onClick={() => {
                          setFormStatus('');
                          setFormData({ name: '', email: '', message: '' });
                        }}
                        mt={2}
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
                  mt={3}
                  name="contact"
                  data-netlify="true"
                  data-netlify-honeypot="bot-field"
                  sx={{
                    transition: 'all 0.3s ease',
                    ...(formStatus === 'success' && {
                      opacity: 0.7,
                      transform: 'scale(0.98)',
                    }),
                  }}
                >
                  <input type="hidden" name="form-name" value="contact" />
                  <StyledBox position="absolute" left="-5000px" overflow="hidden">
                    <label htmlFor="bot-field-input">
                      Don't fill this out if you're human:
                      <input
                        type="text"
                        name="bot-field"
                        id="bot-field-input"
                        tabIndex="-1"
                        autoComplete="off"
                      />
                    </label>
                  </StyledBox>

                  <StyledTextField>
                    <label htmlFor="contact-name">Your Name *</label>
                    <input
                      type="text"
                      id="contact-name"
                      name="name"
                      autoComplete="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      placeholder="Enter your name"
                    />
                  </StyledTextField>
                  <StyledTextField>
                    <label htmlFor="contact-email">Your Email *</label>
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      placeholder="Enter your email"
                    />
                  </StyledTextField>
                  <StyledTextField>
                    <label htmlFor="contact-message">Your Message *</label>
                    <textarea
                      id="contact-message"
                      name="message"
                      autoComplete="off"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      disabled={isSubmitting}
                      placeholder="Enter your message"
                    />
                  </StyledTextField>
                  <StyledButton
                    type="submit"
                    variant="contained"
                    color={formStatus === 'success' ? 'success' : 'primary'}
                    size="large"
                    disabled={isSubmitting || formStatus === 'success'}
                    style={{
                      background: formStatus === 'success' ? '#2e7d32' : 'linear-gradient(135deg, #1565c0 0%, #e91e63 100%)',
                      color: 'white',
                      padding: '16px 32px',
                      fontSize: '1.125rem',
                      fontWeight: 600,
                      borderRadius: '50px',
                      textTransform: 'none',
                      boxShadow: '0px 8px 16px rgba(25, 101, 192, 0.3)',
                      transition: 'all 0.3s ease',
                      marginTop: '24px'
                    }}
                  >
                    <span>
                      {isSubmitting
                        ? 'Sending...'
                        : formStatus === 'success'
                          ? 'Message Sent!'
                          : 'Send Message'}
                    </span>
                    <span className="button-end-icon">
                      {formStatus === 'success' ? (
                        '✓'
                      ) : (
                        <SendIcon />
                      )}
                    </span>
                  </StyledButton>
                </StyledBox>
          </div>
        </StyledBox>

        <StyledBox as="section" aria-labelledby="availability" mt={6} style={{ textAlign: 'center' }}>
          <Typography as="h2" variant="h2" id="availability" style={{
            position: 'absolute',
            left: '-10000px',
            width: '1px',
            height: '1px',
            overflow: 'hidden',
          }}>
            Current Availability
          </Typography>
          <Typography 
            variant="body2" 
            style={{
              color: 'rgba(0, 0, 0, 0.7)',
              fontSize: '1rem',
              fontWeight: 400
            }}
          >
            Currently open to new opportunities and exciting projects. Let's build something together!
          </Typography>
        </StyledBox>
      </StyledContainer>
    </Layout>
  );
}

export default Contact;
