import React from 'react';
import CTASectionComponent from './CTASection';

const meta = {
  title: 'Components/CTASection',
  component: CTASectionComponent,
  parameters: { layout: 'padded' },
};

export default meta;

export const Visible = {
  args: { visible: true },
};

export const Hidden = {
  args: { visible: false },
};
