// Form submission utility
// This is a demo implementation. In production, you would integrate with:
// - Netlify Forms
// - Formspree
// - EmailJS
// - Your own backend API

export const submitContactForm = async (formData) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Log form data (in production, this would be sent to your backend)
  console.log('Contact form submitted:', {
    name: formData.name,
    email: formData.email,
    subject: formData.subject,
    message: formData.message,
    timestamp: new Date().toISOString(),
  });

  // For demonstration purposes, we'll simulate a successful submission
  // In production, you might do something like:
  /*
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    throw new Error('Failed to submit form');
  }

  return response.json();
  */

  return { success: true, message: 'Form submitted successfully!' };
};

// For Netlify Forms integration, you would add:
export const submitToNetlify = async (formData) => {
  const response = await fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      'form-name': 'contact',
      ...formData,
    }).toString(),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response;
};

// Email validation utility
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone number validation (optional)
export const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};
