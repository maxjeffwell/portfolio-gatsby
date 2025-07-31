import React from 'react';
import { Link } from 'gatsby';

function TestFormSuccess() {
  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <h1>✅ Test Form Submitted Successfully!</h1>
      <p>If you see this page, the form submission worked.</p>
      <p>Check your Netlify dashboard to see if the submission appears.</p>
      <Link to="/test-form" title="Send another test message to verify form functionality">← Send another test</Link>
    </div>
  );
}

export default TestFormSuccess;