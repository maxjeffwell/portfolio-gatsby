import React from 'react';
import Header from './header';

const meta = {
  title: 'Navigation/Header',
  component: Header,
  parameters: { layout: 'fullscreen' },
};

export default meta;

export const Desktop = {};

export const Mobile = {
  parameters: {
    viewport: { defaultViewport: 'mobile' },
  },
};
