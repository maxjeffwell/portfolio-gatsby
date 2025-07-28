import React from 'react';
import { Typography, Paper, TextField, Button, Link, useTheme, Alert, NoSsr } from '@mui/material';
import { Email, Phone, GitHub, Send } from '@mui/icons-material';
import styled from '@emotion/styled';

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

const GradientText = styled(Typography)`
  background: linear-gradient(45deg, #fc4a1a, #f7b733);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
`;

const ContactCard = styled(Paper)`
  padding: 32px;
  border-radius: 16px;
  background: ${(props) => props.theme?.palette?.background?.paper || '#ffffff'};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow:
      0px 5px 5px -3px rgba(0, 0, 0, 0.2),
      0px 8px 10px 1px rgba(0, 0, 0, 0.14),
      0px 3px 14px 2px rgba(0, 0, 0, 0.12);
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
  const theme = useTheme();
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
    
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode({
        'form-name': form.getAttribute('name'),
        ...formData,
      }),
    })
      .then((response) => {
        if (response.ok) {
          setFormStatus('success');
          setFormData({ name: '', email: '', message: '' });
          // Keep success message visible permanently until user submits again
        } else if (response.status === 404) {
          throw new Error('Netlify form handler not found. Please check form configuration.');
        } else if (response.status >= 500) {
          throw new Error('Server error occurred. Please try again later.');
        } else if (response.status === 429) {
          throw new Error('Too many requests. Please wait a moment before trying again.');
        } else {
          throw new Error(`Form submission failed with status ${response.status}. Please try again.`);
        }
      })
      .catch((error) => {
        console.error('Form submission error:', error);
        setFormStatus('error');
        
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          setErrorMessage('Network error: Please check your internet connection and try again.');
        } else if (error.message.includes('Netlify form handler not found')) {
          setErrorMessage('Form configuration error. Please contact me directly at maxjeffwell@gmail.com.');
        } else if (error.message.includes('Server error')) {
          setErrorMessage('Server error occurred. Please try again in a few minutes or contact me directly.');
        } else if (error.message.includes('Too many requests')) {
          setErrorMessage('Too many attempts. Please wait a moment before trying again.');
        } else {
          setErrorMessage(error.message || 'An unexpected error occurred. Please try again or contact me directly.');
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
        <label htmlFor="netlify-name">Name: <input type="text" name="name" id="netlify-name" /></label>
        <label htmlFor="netlify-email">Email: <input type="email" name="email" id="netlify-email" /></label>
        <label htmlFor="netlify-message">Message: <textarea name="message" id="netlify-message"></textarea></label>
        <label htmlFor="netlify-bot-field">Bot field: <input type="text" name="bot-field" id="netlify-bot-field" /></label>
      </form>
      <StyledContainer>
        <StyledBox component="section" aria-labelledby="contact-header" mb={6}>
          <GradientText variant="h2" component="h1" id="contact-header" align="center" gutterBottom>
            Let&#39;s Connect
          </GradientText>
          <Typography variant="h5" align="center" color="text.secondary" paragraph>
            I&#39;m always interested in new opportunities and collaborations
          </Typography>
        </StyledBox>

        <StyledBox component="section" aria-labelledby="contact-methods">
          <Typography
            variant="h2"
            id="contact-methods"
            sx={{
              position: 'absolute',
              left: '-10000px',
              width: '1px',
              height: '1px',
              overflow: 'hidden',
            }}
          >
            Contact Information and Methods
          </Typography>
          <GridContainer spacing={4}>
            <GridItem>
              <ContactCard elevation={3}>
                <Typography variant="h3" component="h3" id="get-in-touch" gutterBottom>
                  Get in Touch
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Whether you have a project in mind, need technical expertise, or just want to say
                  hello, hello, I&#39;d love to hear from you. Feel free to reach out through any of
                  these channels:
                </Typography>

                <StyledBox mt={4}>
                  <ContactMethod>
                    <Email color="primary" />
                    <StyledBox>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color:
                            theme.palette.mode === 'dark'
                              ? 'rgba(255, 255, 255, 0.7)'
                              : 'rgba(0, 0, 0, 0.6)',
                          fontWeight: 500,
                        }}
                      >
                        Email
                      </Typography>
                      <Link
                        href="mailto:maxjeffwell@gmail.com"
                        color="primary"
                        underline="always"
                        variant="body1"
                        sx={{
                          textDecorationThickness: '2px',
                          textUnderlineOffset: '3px',
                          '&:hover': {
                            textDecorationColor: theme.palette.primary.dark,
                          },
                        }}
                      >
                        maxjeffwell@gmail.com
                      </Link>
                    </StyledBox>
                  </ContactMethod>

                  <ContactMethod>
                    <Phone color="primary" />
                    <StyledBox>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color:
                            theme.palette.mode === 'dark'
                              ? 'rgba(255, 255, 255, 0.7)'
                              : 'rgba(0, 0, 0, 0.6)',
                          fontWeight: 500,
                        }}
                      >
                        Phone
                      </Typography>
                      <Link
                        href="tel:+01-508-395-2008"
                        color="primary"
                        underline="always"
                        variant="body1"
                        sx={{
                          textDecorationThickness: '2px',
                          textUnderlineOffset: '3px',
                          '&:hover': {
                            textDecorationColor: theme.palette.primary.dark,
                          },
                        }}
                      >
                        (508) 395-2008
                      </Link>
                    </StyledBox>
                  </ContactMethod>

                  {/* <ContactMethod> */}
                  {/*   <LinkedIn color="primary" /> */}
                  {/*   <Box> */}
                  {/*     <Typography variant="subtitle2" color="text.secondary"> */}
                  {/*       LinkedIn */}
                  {/*     </Typography> */}
                  {/*     <Link */}
                  {/*       href="https://www.linkedin.com/in/jeffrey-maxwell-553176172" */}
                  {/*       target="_blank" */}
                  {/*       rel="noopener noreferrer" */}
                  {/*       color="primary" */}
                  {/*       underline="hover" */}
                  {/*       variant="body1" */}
                  {/*     > */}
                  {/*       Connect on LinkedIn */}
                  {/*     </Link> */}
                  {/*   </Box> */}
                  {/* </ContactMethod> */}

                  <ContactMethod>
                    <GitHub color="primary" />
                    <StyledBox>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color:
                            theme.palette.mode === 'dark'
                              ? 'rgba(255, 255, 255, 0.7)'
                              : 'rgba(0, 0, 0, 0.6)',
                          fontWeight: 500,
                        }}
                      >
                        GitHub
                      </Typography>
                      <Link
                        href="https://github.com/maxjeffwell"
                        target="_blank"
                        rel="noopener noreferrer"
                        color="primary"
                        underline="always"
                        variant="body1"
                        sx={{
                          textDecorationThickness: '2px',
                          textUnderlineOffset: '3px',
                          '&:hover': {
                            textDecorationColor: theme.palette.primary.dark,
                          },
                        }}
                      >
                        View my projects
                      </Link>
                    </StyledBox>
                  </ContactMethod>
                </StyledBox>
              </ContactCard>
            </GridItem>

            <GridItem>
              <ContactCard elevation={3}>
                <Typography variant="h3" component="h3" id="send-message" gutterBottom>
                  Send a Message
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Have a specific question or project in mind? Drop me a message and I&#39;ll get
                  back to you as soon as possible.
                </Typography>

                {formStatus === 'success' && (
                  <Alert 
                    severity="success" 
                    sx={{ 
                      mb: 3,
                      animation: 'fadeIn 0.5s ease-in',
                      '@keyframes fadeIn': {
                        from: { opacity: 0, transform: 'translateY(-10px)' },
                        to: { opacity: 1, transform: 'translateY(0)' }
                      }
                    }}
                  >
                    <Typography variant="h6" component="div" gutterBottom>
                      ✅ Message Sent Successfully!
                    </Typography>
                    <Typography variant="body2">
                      Thank you for reaching out! I&#39;ll get back to you within 24 hours.
                    </Typography>
                  </Alert>
                )}

                {formStatus === 'error' && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    ❌ {errorMessage || 'Sorry, there was an error sending your message. Please ensure all fields are filled out correctly, or contact me directly at maxjeffwell@gmail.com.'}
                    {!errorMessage.includes('maxjeffwell@gmail.com') && (
                      <>
                        {' '}You can also reach me directly at{' '}
                        <Link href="mailto:maxjeffwell@gmail.com" color="inherit" underline="always">
                          maxjeffwell@gmail.com
                        </Link>
                      </>
                    )}
                  </Alert>
                )}

                <StyledBox
                  component="form"
                  onSubmit={handleSubmit}
                  mt={3}
                  name="contact"
                  method="POST"
                  action="/contact/"
                  data-netlify="true"
                  data-netlify-honeypot="bot-field"
                >
                  <input type="hidden" name="form-name" value="contact" />
                  <StyledBox position="absolute" left="-5000px" overflow="hidden">
                    <label htmlFor="bot-field-input">
                      Don't fill this out if you're human:
                      <input type="text" name="bot-field" id="bot-field-input" tabIndex="-1" autoComplete="off" />
                    </label>
                  </StyledBox>

                    <TextField
                      fullWidth
                      label="Your Name"
                      name="name"
                      autoComplete="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      margin="normal"
                      variant="outlined"
                      disabled={isSubmitting}
                      id="contact-name"
                      InputLabelProps={{
                        htmlFor: 'contact-name',
                      }}
                      inputProps={{
                        id: 'contact-name',
                        name: 'name',
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Your Email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      margin="normal"
                      variant="outlined"
                      disabled={isSubmitting}
                      id="contact-email"
                      InputLabelProps={{
                        htmlFor: 'contact-email',
                      }}
                      inputProps={{
                        id: 'contact-email',
                        name: 'email',
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Your Message"
                      name="message"
                      autoComplete="off"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      multiline
                      rows={4}
                      margin="normal"
                      variant="outlined"
                      disabled={isSubmitting}
                      id="contact-message"
                      InputLabelProps={{
                        htmlFor: 'contact-message',
                      }}
                      inputProps={{
                        id: 'contact-message',
                        name: 'message',
                      }}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      color={formStatus === 'success' ? 'success' : 'primary'}
                      size="large"
                      endIcon={formStatus === 'success' ? '✓' : <Send />}
                      disabled={isSubmitting || formStatus === 'success'}
                      sx={{
                        mt: 3,
                        borderRadius: 20,
                        textTransform: 'none',
                        px: 4,
                      }}
                    >
                      {isSubmitting ? 'Sending...' : formStatus === 'success' ? 'Message Sent!' : 'Send Message'}
                    </Button>
                </StyledBox>
              </ContactCard>
            </GridItem>
          </GridContainer>
        </StyledBox>

        <StyledBox component="section" aria-labelledby="availability" mt={6} textAlign="center">
          <Typography
            variant="h2"
            id="availability"
            sx={{
              position: 'absolute',
              left: '-10000px',
              width: '1px',
              height: '1px',
              overflow: 'hidden',
            }}
          >
            Current Availability
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Currently open to new opportunities and exciting projects. Let&#39;s build something
            together!
          </Typography>
        </StyledBox>
      </StyledContainer>
    </Layout>
  );
}

export default Contact;
