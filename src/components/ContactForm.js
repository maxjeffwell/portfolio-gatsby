import React, { useState } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { useTheme } from '../context/ThemeContext';
import { submitContactForm, validateEmail } from '../utils/formHandler';
import { FaUser, FaEnvelope, FaCommentDots, FaPaperPlane, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const FormContainer = styled.div`
  background: ${(props) => props.theme.gradients.secondary};
  border: 2px solid ${(props) => props.theme.colors.border};
  border-radius: 20px;
  padding: 2rem;
  margin: 2rem 0;
  box-shadow: ${(props) => props.theme.shadows.medium};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${(props) => props.theme.gradients.accent};
    border-radius: 20px 20px 0 0;
  }
`;

const FormTitle = styled.h2`
  color: ${(props) => props.theme.colors.text};
  font-family: HelveticaNeueLTStd-Bd, sans-serif;
  font-size: 2rem;
  margin-bottom: 1rem;
  text-align: center;
  background: ${(props) => props.theme.gradients.accent};
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const FormDescription = styled.p`
  color: ${(props) => props.theme.colors.textSecondary};
  font-family: SabonLTStd-Roman, serif;
  font-size: 1.1rem;
  text-align: center;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const Form = styled.form`
  display: grid;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  position: relative;
`;

const Label = styled.label`
  display: block;
  color: ${(props) => props.theme.colors.text};
  font-family: HelveticaNeueLTStd-Bd, sans-serif;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    color: ${(props) => props.theme.colors.accent};
  }
`;

const inputStyles = (props) => css`
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  font-family: SabonLTStd-Roman, serif;
  border: 2px solid ${props.hasError ? props.theme.colors.error : props.theme.colors.border};
  border-radius: 12px;
  background-color: ${props.theme.colors.surface};
  color: ${props.theme.colors.textInverse};
  transition: all ${props.theme.transitions.normal};
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${props.hasError ? props.theme.colors.error : props.theme.colors.accentSecondary};
    box-shadow: 0 0 0 3px ${props.hasError 
      ? `${props.theme.colors.error}40` 
      : `${props.theme.colors.accentSecondary}40`};
    transform: translateY(-1px);
  }

  &::placeholder {
    color: ${props.theme.colors.textSecondary}80;
  }

  &:hover:not(:focus) {
    border-color: ${props.theme.colors.accent};
  }
`;

const Input = styled.input`
  ${inputStyles}
`;

const TextArea = styled.textarea`
  ${inputStyles}
  min-height: 120px;
  max-height: 300px;
`;

const ErrorMessage = styled.div`
  color: ${(props) => props.theme.colors.error};
  font-family: SabonLTStd-Roman, serif;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  opacity: ${(props) => (props.show ? 1 : 0)};
  transform: ${(props) => (props.show ? 'translateY(0)' : 'translateY(-10px)')};
  transition: all ${(props) => props.theme.transitions.fast};

  svg {
    color: ${(props) => props.theme.colors.error};
  }
`;

const SubmitButton = styled.button`
  background: ${(props) => props.theme.gradients.accent};
  color: ${(props) => props.theme.colors.textInverse};
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-family: HelveticaNeueLTStd-Bd, sans-serif;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all ${(props) => props.theme.transitions.normal};
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 60px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left ${(props) => props.theme.transitions.normal};
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${(props) => props.theme.shadows.hover};

    &::before {
      left: 100%;
    }
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:focus {
    outline: 2px solid ${(props) => props.theme.colors.accentSecondary};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const SuccessMessage = styled.div`
  background: ${(props) => props.theme.colors.success}20;
  border: 2px solid ${(props) => props.theme.colors.success};
  border-radius: 12px;
  padding: 1rem;
  color: ${(props) => props.theme.colors.success};
  font-family: SabonLTStd-Roman, serif;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  opacity: ${(props) => (props.show ? 1 : 0)};
  transform: ${(props) => (props.show ? 'translateY(0)' : 'translateY(-10px)')};
  transition: all ${(props) => props.theme.transitions.normal};

  svg {
    color: ${(props) => props.theme.colors.success};
    font-size: 1.2rem;
  }
`;

const ContactForm = () => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);


  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Subject validation
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.trim().length < 5) {
      newErrors.subject = 'Subject must be at least 5 characters';
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    } else if (formData.message.trim().length > 1000) {
      newErrors.message = 'Message must be less than 1000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await submitContactForm(formData);
      
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      // In production, you could show an error message to the user
      alert('Sorry, there was an error sending your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormContainer theme={theme}>
      <FormTitle theme={theme}>Get In Touch</FormTitle>
      <FormDescription theme={theme}>
        I'd love to hear about your project ideas or discuss potential opportunities. 
        Send me a message and I'll get back to you as soon as possible!
      </FormDescription>

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label theme={theme}>
            {typeof window !== 'undefined' && <FaUser />}
            Name *
          </Label>
          <Input
            theme={theme}
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Your full name"
            hasError={!!errors.name}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          <ErrorMessage 
            theme={theme} 
            show={!!errors.name}
            id="name-error"
            role="alert"
          >
            {typeof window !== 'undefined' && <FaExclamationTriangle />}
            {errors.name}
          </ErrorMessage>
        </FormGroup>

        <FormGroup>
          <Label theme={theme}>
            {typeof window !== 'undefined' && <FaEnvelope />}
            Email *
          </Label>
          <Input
            theme={theme}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="your.email@example.com"
            hasError={!!errors.email}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          <ErrorMessage 
            theme={theme} 
            show={!!errors.email}
            id="email-error"
            role="alert"
          >
            {typeof window !== 'undefined' && <FaExclamationTriangle />}
            {errors.email}
          </ErrorMessage>
        </FormGroup>

        <FormGroup>
          <Label theme={theme}>
            {typeof window !== 'undefined' && <FaCommentDots />}
            Subject *
          </Label>
          <Input
            theme={theme}
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            placeholder="What's this about?"
            hasError={!!errors.subject}
            aria-invalid={!!errors.subject}
            aria-describedby={errors.subject ? 'subject-error' : undefined}
          />
          <ErrorMessage 
            theme={theme} 
            show={!!errors.subject}
            id="subject-error"
            role="alert"
          >
            {typeof window !== 'undefined' && <FaExclamationTriangle />}
            {errors.subject}
          </ErrorMessage>
        </FormGroup>

        <FormGroup>
          <Label theme={theme}>
            {typeof window !== 'undefined' && <FaCommentDots />}
            Message *
          </Label>
          <TextArea
            theme={theme}
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Tell me about your project, ideas, or just say hello!"
            hasError={!!errors.message}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? 'message-error' : undefined}
          />
          <ErrorMessage 
            theme={theme} 
            show={!!errors.message}
            id="message-error"
            role="alert"
          >
            {typeof window !== 'undefined' && <FaExclamationTriangle />}
            {errors.message}
          </ErrorMessage>
          <div
            css={css`
              font-size: 0.75rem;
              color: ${theme.colors.textSecondary};
              margin-top: 0.25rem;
              text-align: right;
            `}
          >
            {formData.message.length}/1000
          </div>
        </FormGroup>

        <SubmitButton
          theme={theme}
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div
                css={css`
                  width: 20px;
                  height: 20px;
                  border: 2px solid transparent;
                  border-top: 2px solid currentColor;
                  border-radius: 50%;
                  animation: spin 1s linear infinite;

                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}
              />
              Sending...
            </>
          ) : (
            <>
              {typeof window !== 'undefined' && <FaPaperPlane />}
              Send Message
            </>
          )}
        </SubmitButton>

        <SuccessMessage theme={theme} show={isSubmitted}>
          {typeof window !== 'undefined' && <FaCheckCircle />}
          Thank you! Your message has been sent successfully. I'll get back to you soon!
        </SuccessMessage>
      </Form>
    </FormContainer>
  );
};

export default ContactForm;