import React from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  Link,
  useTheme,
  Alert,
  NoSsr,
} from '@mui/material';
import { Grid } from '@mui/material';
import { Email, Phone, GitHub, Send } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

import Layout from '../components/layout';
import SEO from '../components/seo';

const GradientText = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  display: 'inline-block',
}));

const ContactCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  background:
    theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(30,30,30,0.95) 0%, rgba(45,45,45,0.9) 100%)'
      : theme.palette.background.paper,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

const ContactMethod = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.action.hover,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
    transform: 'translateX(8px)',
  },
}));

function Contact() {
  const theme = useTheme();
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    message: '',
  });
  const [formStatus, setFormStatus] = React.useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic would go here
    setFormStatus('success');
    setTimeout(() => setFormStatus(''), 5000);
  };

  return (
    <Layout>
      <SEO
        title="Contact"
        description="Get in touch with Jeff Maxwell for web development projects, collaborations, or opportunities. Available for freelance and full-time positions."
        pathname="/contact/"
        keywords={[
          `contact web developer`,
          `hire full stack developer`,
          `freelance developer`,
          `web development services`,
          `Jeff Maxwell contact`,
        ]}
      />
      <Container maxWidth="lg">
        <Box component="section" aria-labelledby="contact-header" sx={{ mb: 6 }}>
          <GradientText variant="h2" component="h1" id="contact-header" align="center" gutterBottom>
            Let&#39;s Connect
          </GradientText>
          <Typography variant="h5" align="center" color="text.secondary" paragraph>
            I&#39;m always interested in new opportunities and collaborations
          </Typography>
        </Box>

        <Box component="section" aria-labelledby="contact-methods">
          <Typography variant="h2" id="contact-methods" sx={{ position: 'absolute', left: '-10000px', width: '1px', height: '1px', overflow: 'hidden' }}>
            Contact Information and Methods
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <ContactCard elevation={3}>
                <Typography variant="h3" component="h3" id="get-in-touch" gutterBottom>
                  Get in Touch
                </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Whether you have a project in mind, need technical expertise, or just want to say
                hello, hello, I&#39;d love to hear from you. Feel free to reach out through any of
                these channels:
              </Typography>

              <Box sx={{ mt: 4 }}>
                <ContactMethod>
                  <Email color="primary" />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
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
                  </Box>
                </ContactMethod>

                <ContactMethod>
                  <Phone color="primary" />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
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
                  </Box>
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
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
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
                  </Box>
                </ContactMethod>
              </Box>
            </ContactCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <ContactCard elevation={3}>
              <Typography variant="h3" component="h3" id="send-message" gutterBottom>
                Send a Message
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Have a specific question or project in mind? Drop me a message and I&#39;ll get back
                to you as soon as possible.
              </Typography>

              {formStatus === 'success' && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  Thank you for your message! I&#39;ll get back to you soon.
                </Alert>
              )}

              <NoSsr>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                  <TextField
                    fullWidth
                    label="Your Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    margin="normal"
                    variant="outlined"
                  />
                  <TextField
                    fullWidth
                    label="Your Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    margin="normal"
                    variant="outlined"
                  />
                  <TextField
                    fullWidth
                    label="Your Message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    multiline
                    rows={4}
                    margin="normal"
                    variant="outlined"
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    endIcon={<Send />}
                    sx={{
                      mt: 3,
                      borderRadius: 20,
                      textTransform: 'none',
                      px: 4,
                    }}
                  >
                    Send Message
                  </Button>
                </Box>
              </NoSsr>
            </ContactCard>
          </Grid>
          </Grid>
        </Box>

        <Box component="section" aria-labelledby="availability" sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="h2" id="availability" sx={{ position: 'absolute', left: '-10000px', width: '1px', height: '1px', overflow: 'hidden' }}>
            Current Availability
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Currently open to new opportunities and exciting projects. Let&#39;s build something
            together!
          </Typography>
        </Box>
      </Container>
    </Layout>
  );
}

export default Contact;
