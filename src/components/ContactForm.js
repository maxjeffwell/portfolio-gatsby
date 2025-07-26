import React, { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import {
  FaUser,
  FaEnvelope,
  FaCommentDots,
  FaPaperPlane,
  FaCheckCircle,
  FaExclamationTriangle,
} from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { submitToNetlify, validateEmail } from '../utils/formHandler';
import { useScreenReaderAnnouncement } from './ScreenReaderAnnouncement';

const FormContainer = styled.div`
  background: ${(props) => props.theme.gradients.secondary};
  border: 2px solid ${(props) => props.theme.colors.border};
  border-radius: 20px;
  padding: 2rem;
  margin: 2rem 0;
  box-shadow:
    0 10px 25px rgba(0, 0, 0, 0.1),
    0 6px 10px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${(props) => props.theme.gradients.primary};
    opacity: 0.05;
    pointer-events: none;
  }

  @media (max-width: 768px) {
    margin: 1rem 0;
    padding: 1.5rem;
  }
`;

const FormTitle = styled.h2`
  color: ${(props) => props.theme.colors.primary};
  text-align: center;
  font-family: HelveticaNeueLTStd-Bd, sans-serif;
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  background: ${(props) => props.theme.gradients.accent};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  border-radius: 8px;

  &:focus {
    outline: 3px solid ${(props) => props.theme.colors.accent || '#f7b733'};
    outline-offset: 4px;
    background: ${(props) => props.theme.colors.primary};
    -webkit-text-fill-color: ${(props) => props.theme.colors.primary};
    color: ${(props) => props.theme.colors.primary};
  }

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const FormDescription = styled.p`
  text-align: center;
  color: ${(props) => props.theme.colors.textSecondary};
  font-family: SabonLTStd-Roman, serif;
  font-size: 1.125rem;
  line-height: 1.6;
  margin: 0 0 2rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
`;

const Form = styled.form`
  display: grid;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  position: relative;
`;

const Label = styled.label`
  color: ${(props) => props.theme.colors.text};
  font-family: HelveticaNeueLTStd-Roman, sans-serif;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1.25rem;
  font-size: 1rem;
  font-family: SabonLTStd-Roman, serif;
  border: 2px solid
    ${(props) => (props.hasError ? props.theme.colors.error : props.theme.colors.border)};
  border-radius: 12px;
  background-color: ${(props) => props.theme.colors.surface};
  color: ${(props) => props.theme.colors.text};
  transition: all ${(props) => props.theme.transitions.normal};

  &::placeholder {
    color: ${(props) => props.theme.colors.textSecondary};
  }

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.accent};
    box-shadow: 0 0 0 3px ${(props) => props.theme.colors.accent}20;
    transform: translateY(-1px);
  }

  &:hover:not(:focus) {
    border-color: ${(props) => props.theme.colors.accentLight};
  }

  &:focus::placeholder {
    opacity: 0.5;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem 1.25rem;
  font-size: 1rem;
  font-family: SabonLTStd-Roman, serif;
  border: 2px solid
    ${(props) => (props.hasError ? props.theme.colors.error : props.theme.colors.border)};
  border-radius: 12px;
  background-color: ${(props) => props.theme.colors.surface};
  color: ${(props) => props.theme.colors.text};
  resize: vertical;
  min-height: 120px;
  max-height: 300px;
  transition: all ${(props) => props.theme.transitions.normal};

  &::placeholder {
    color: ${(props) => props.theme.colors.textSecondary};
  }

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.accent};
    box-shadow: 0 0 0 3px ${(props) => props.theme.colors.accent}20;
    transform: translateY(-1px);
  }

  &:hover:not(:focus) {
    border-color: ${(props) => props.theme.colors.accentLight};
  }

  &:focus::placeholder {
    opacity: 0.5;
  }
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
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.6s;
  }

  &:hover::before {
    left: 100%;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(247, 183, 51, 0.3);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  &:disabled::before {
    display: none;
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

  &:focus {
    outline: 3px solid ${(props) => props.theme.colors.success};
    outline-offset: 2px;
    box-shadow: 0 0 0 6px ${(props) => props.theme.colors.success}20;
  }

  svg {
    color: ${(props) => props.theme.colors.success};
    flex-shrink: 0;
  }
`;

function ContactForm() {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const successMessageRef = useRef(null);
  const formRef = useRef(null);
  const submitButtonRef = useRef(null);
  const { announce, AnnouncementComponent } = useScreenReaderAnnouncement();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.length < 5) {
      newErrors.subject = 'Subject must be at least 5 characters';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    } else if (formData.message.length > 1000) {
      newErrors.message = 'Message must be less than 1000 characters';
    }

    setErrors(newErrors);

    // Return both validation result and errors for focus management
    return {
      isValid: Object.keys(newErrors).length === 0,
      errors: newErrors,
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateForm();
    if (!validation.isValid) {
      announce('Please fix the form errors before submitting.', 'assertive');

      // Focus the first field with an error
      const firstErrorField = Object.keys(validation.errors)[0];
      if (firstErrorField && formRef.current) {
        const errorInput = formRef.current.querySelector(`#${firstErrorField}`);
        if (errorInput) {
          setTimeout(() => {
            errorInput.focus();
            errorInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 100);
        }
      }

      return;
    }

    setIsSubmitting(true);

    try {
      await submitToNetlify(formData);

      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });

      // Announce success to screen readers
      announce('Thank you! Your message has been sent successfully.');

      // Focus management strategy:
      // 1. Focus the success message immediately for screen readers
      // 2. After success message disappears, focus moves to top of form for next submission
      setTimeout(() => {
        if (successMessageRef.current) {
          // Focus the success message which contains actionable content
          successMessageRef.current.focus();

          // Scroll the success message into view if needed
          successMessageRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
          });
        }
      }, 100);

      // Hide success message after 5 seconds and restore focus
      setTimeout(() => {
        setIsSubmitted(false);

        // After success message disappears, focus the form title
        // This provides a logical starting point for users who might want to send another message
        setTimeout(() => {
          if (formRef.current) {
            const formTitle = formRef.current.querySelector('h2');
            if (formTitle) {
              formTitle.focus();
            }
          }
        }, 100);
      }, 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      // Announce error to screen readers
      announce('Sorry, there was an error sending your message. Please try again.', 'assertive');

      // Focus management for errors: return focus to submit button
      setTimeout(() => {
        if (submitButtonRef.current) {
          submitButtonRef.current.focus();
        }
      }, 100);

      // In production, you could show an error message to the user
      alert('Sorry, there was an error sending your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormContainer theme={theme} ref={formRef}>
      <FormTitle theme={theme} tabIndex={-1}>
        Get In Touch
      </FormTitle>
      <FormDescription theme={theme}>
        I'd love to hear about your project ideas or discuss potential opportunities. Send me a
        message and I'll get back to you as soon as possible!
      </FormDescription>

      <Form
        onSubmit={handleSubmit}
        name="contact"
        method="POST"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
      >
        {/* Hidden fields for Netlify Forms */}
        <input type="hidden" name="form-name" value="contact" />
        <input type="hidden" name="bot-field" />

        <FormGroup>
          <Label htmlFor="name" theme={theme}>
            <FaUser /> Name *
          </Label>
          <Input
            theme={theme}
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your full name"
            hasError={!!errors.name}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          <ErrorMessage theme={theme} show={!!errors.name} id="name-error" role="alert">
            <FaExclamationTriangle />
            {errors.name}
          </ErrorMessage>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="email" theme={theme}>
            <FaEnvelope /> Email *
          </Label>
          <Input
            theme={theme}
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
            hasError={!!errors.email}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          <ErrorMessage theme={theme} show={!!errors.email} id="email-error" role="alert">
            <FaExclamationTriangle />
            {errors.email}
          </ErrorMessage>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="subject" theme={theme}>
            <FaCommentDots /> Subject *
          </Label>
          <Input
            theme={theme}
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="What would you like to discuss?"
            hasError={!!errors.subject}
            aria-invalid={!!errors.subject}
            aria-describedby={errors.subject ? 'subject-error' : undefined}
          />
          <ErrorMessage theme={theme} show={!!errors.subject} id="subject-error" role="alert">
            <FaExclamationTriangle />
            {errors.subject}
          </ErrorMessage>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="message" theme={theme}>
            <FaCommentDots /> Message *
          </Label>
          <TextArea
            theme={theme}
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell me about your project, ideas, or how I can help..."
            hasError={!!errors.message}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? 'message-error' : undefined}
          />
          <ErrorMessage theme={theme} show={!!errors.message} id="message-error" role="alert">
            <FaExclamationTriangle />
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
          aria-describedby={isSubmitting ? 'loading-status' : undefined}
          ref={submitButtonRef}
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
                    0% {
                      transform: rotate(0deg);
                    }
                    100% {
                      transform: rotate(360deg);
                    }
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

        {/* Loading state announcement for screen readers */}
        {isSubmitting && (
          <div
            id="loading-status"
            role="status"
            aria-live="polite"
            css={css`
              position: absolute;
              left: -10000px;
              width: 1px;
              height: 1px;
              overflow: hidden;
            `}
          >
            Sending your message, please wait...
          </div>
        )}

        <SuccessMessage
          theme={theme}
          show={isSubmitted}
          role="status"
          aria-live="polite"
          tabIndex={-1}
          ref={successMessageRef}
        >
          {typeof window !== 'undefined' && <FaCheckCircle />}
          Thank you! Your message has been sent successfully. I'll get back to you soon!
        </SuccessMessage>
      </Form>

      {/* Global announcement component for screen readers */}
      <AnnouncementComponent />
    </FormContainer>
  );
}

export default ContactForm;
