import React from 'react';
import CTASectionComponent from './CTASection';

const meta = {
  title: 'Components/CTASection',
  component: CTASectionComponent,
  parameters: { layout: 'fullscreen' },
};

export default meta;

export const Visible = {
  render: () => (
    <div style={{ padding: '48px 24px', maxWidth: '900px', margin: '0 auto' }}>
      <CTASectionComponent visible />
    </div>
  ),
};

export const Hidden = {
  name: 'Stats Hidden (Animating In)',
  render: () => (
    <div style={{ padding: '48px 24px', maxWidth: '900px', margin: '0 auto' }}>
      <CTASectionComponent visible={false} />
    </div>
  ),
};

export const Mobile = {
  render: () => (
    <div style={{ padding: '16px' }}>
      <CTASectionComponent visible />
    </div>
  ),
  parameters: {
    viewport: { defaultViewport: 'mobile' },
  },
};
