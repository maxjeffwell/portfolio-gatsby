import React from 'react';
import ProtectedEmail from './ProtectedEmail';

const meta = {
  title: 'Components/ProtectedEmail',
  component: ProtectedEmail,
  parameters: { layout: 'centered' },
};

export default meta;

export const Default = {
  render: () => <ProtectedEmail />,
};

export const WithChildren = {
  render: () => (
    <ProtectedEmail style={{ fontSize: '1.25rem', color: '#1976d2' }}>
      Contact Jeff
    </ProtectedEmail>
  ),
};

export const WithSubject = {
  render: () => (
    <ProtectedEmail subject="Project Inquiry" body="Hi Jeff, I'd like to discuss a project.">
      Send Project Inquiry
    </ProtectedEmail>
  ),
};
