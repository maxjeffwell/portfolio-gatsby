import React from 'react';
import ErrorBoundary from './ErrorBoundary';

const meta = {
  title: 'Components/ErrorBoundary',
  component: ErrorBoundary,
  parameters: { layout: 'padded' },
};

export default meta;

const BuggyComponent = () => {
  throw new Error('Intentional test error for Storybook demo');
};

export const Normal = {
  render: () => (
    <ErrorBoundary>
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Everything is working fine!</h2>
        <p>This content renders normally inside the ErrorBoundary.</p>
      </div>
    </ErrorBoundary>
  ),
};

export const ErrorState = {
  render: () => (
    <ErrorBoundary>
      <BuggyComponent />
    </ErrorBoundary>
  ),
};
