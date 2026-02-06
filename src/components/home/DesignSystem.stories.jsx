import React from 'react';

const lightTheme = {
  mode: 'light',
  colors: {
    primary: '#1976d2',
    secondary: '#dc004e',
    background: '#f5f5f5',
    paper: '#ffffff',
    text: '#212121',
    textSecondary: '#424242',
  },
};

const darkTheme = {
  mode: 'dark',
  colors: {
    primary: '#90caf9',
    secondary: '#f48fb1',
    background: '#0a0a0a',
    paper: '#1a1a1a',
    text: '#ffffff',
    textSecondary: '#e0e0e0',
  },
};

const meta = {
  title: 'Design System/Foundations',
  parameters: { layout: 'padded' },
};

export default meta;

export const Typography = {
  render: () => {
    const headings = [
      { tag: 'h1', size: 'clamp(2.5rem, 8vw, 4rem)' },
      { tag: 'h2', size: 'clamp(2rem, 6vw, 3rem)' },
      { tag: 'h3', size: 'clamp(1.5rem, 4vw, 2.25rem)' },
      { tag: 'h4', size: 'clamp(1.25rem, 3vw, 1.75rem)' },
      { tag: 'h5', size: 'clamp(1.125rem, 2.5vw, 1.5rem)' },
      { tag: 'h6', size: 'clamp(1rem, 2vw, 1.25rem)' },
    ];

    return (
      <div style={{ padding: '2rem', backgroundColor: '#f5f5f5' }}>
        <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.6, marginBottom: '1.5rem' }}>
          Fluid Typography Scale
        </p>
        {headings.map(({ tag, size }) => {
          const Tag = tag;
          return (
            <div key={tag} style={{ marginBottom: '1.25rem' }}>
              <Tag style={{ fontSize: size, fontWeight: 700, lineHeight: 1.2, margin: 0 }}>
                {tag.toUpperCase()} Heading
              </Tag>
              <code style={{ display: 'block', marginTop: '0.25rem', fontSize: '0.75rem', color: '#666' }}>
                font-size: {size}
              </code>
            </div>
          );
        })}
      </div>
    );
  },
};

export const ColorPalette = {
  render: () => {
    const renderPalette = (theme) => (
      <div style={{ flex: 1, padding: '1.5rem', backgroundColor: theme.colors.background, borderRadius: '8px' }}>
        <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: theme.colors.text, marginBottom: '1rem' }}>
          {theme.mode} theme
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem' }}>
          {Object.entries(theme.colors).map(([name, value]) => (
            <div key={name} style={{ textAlign: 'center' }}>
              <div style={{ width: '100%', height: '64px', backgroundColor: value, borderRadius: '6px', border: '1px solid rgba(128,128,128,0.25)', marginBottom: '0.5rem' }} />
              <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: theme.colors.text }}>{name}</span>
              <code style={{ fontSize: '0.7rem', color: theme.colors.textSecondary }}>{value}</code>
            </div>
          ))}
        </div>
      </div>
    );

    return (
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        {renderPalette(lightTheme)}
        {renderPalette(darkTheme)}
      </div>
    );
  },
};

export const GradientText = {
  render: () => {
    const style = {
      background: 'linear-gradient(45deg, #fc4a1a, #f7b733)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontWeight: 700,
      lineHeight: 1.2,
    };

    return (
      <div style={{ padding: '2rem', backgroundColor: '#f5f5f5' }}>
        <h1 style={{ ...style, fontSize: 'clamp(2.5rem, 8vw, 4rem)', marginBottom: '1rem' }}>Building the Future</h1>
        <h2 style={{ ...style, fontSize: 'clamp(2rem, 6vw, 3rem)', marginBottom: '1rem' }}>One Component at a Time</h2>
        <h3 style={{ ...style, fontSize: 'clamp(1.5rem, 4vw, 2.25rem)' }}>Crafted with Care</h3>
      </div>
    );
  },
};

export const CSSVariables = {
  render: () => {
    const vars = [
      { name: '--bg-color', light: '#f5f5f5', dark: '#0a0a0a' },
      { name: '--text-color', light: '#212121', dark: '#ffffff' },
      { name: '--paper-color', light: '#ffffff', dark: '#1a1a1a' },
      { name: '--primary-color', light: '#1976d2', dark: '#90caf9' },
      { name: '--secondary-color', light: '#dc004e', dark: '#f48fb1' },
      { name: '--text-secondary-color', light: '#424242', dark: '#e0e0e0' },
    ];

    return (
      <div style={{ padding: '2rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Variable</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Light</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Dark</th>
            </tr>
          </thead>
          <tbody>
            {vars.map(({ name, light, dark }) => (
              <tr key={name} style={{ borderTop: '1px solid #eee' }}>
                <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontSize: '0.8rem' }}>{name}</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <span style={{ display: 'inline-block', width: 20, height: 20, backgroundColor: light, borderRadius: 4, border: '1px solid #ccc', verticalAlign: 'middle', marginRight: 8 }} />
                  <code style={{ fontSize: '0.8rem' }}>{light}</code>
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <span style={{ display: 'inline-block', width: 20, height: 20, backgroundColor: dark, borderRadius: 4, border: '1px solid #ccc', verticalAlign: 'middle', marginRight: 8 }} />
                  <code style={{ fontSize: '0.8rem' }}>{dark}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  },
};
