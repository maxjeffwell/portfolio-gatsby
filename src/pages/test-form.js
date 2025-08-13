import React from 'react';

function TestForm() {
  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Netlify Forms Test</h1>

      {/* Hidden form for Netlify detection */}
      <form name="test-form" data-netlify="true" data-netlify-honeypot="bot-field" hidden>
        <input type="hidden" name="form-name" value="test-form" />
        <input type="text" name="name" />
        <input type="email" name="email" />
        <textarea name="message"></textarea>
        <input type="text" name="bot-field" />
      </form>

      {/* Visible form */}
      <form
        name="test-form"
        method="POST"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        action="/test-form-success"
      >
        <input type="hidden" name="form-name" value="test-form" />
        <p style={{ position: 'absolute', left: '-9999px' }}>
          <label>
            Don't fill this out if you're human:
            <input name="bot-field" />
          </label>
        </p>
        <p>
          <label>
            Your Name: <br />
            <input type="text" name="name" required />
          </label>
        </p>
        <p>
          <label>
            Your Email: <br />
            <input type="email" name="email" required />
          </label>
        </p>
        <p>
          <label>
            Message: <br />
            <textarea name="message" required></textarea>
          </label>
        </p>
        <p>
          <button type="submit">Send Test</button>
        </p>
      </form>
    </div>
  );
}

export default TestForm;
