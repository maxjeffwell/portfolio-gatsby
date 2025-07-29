// Fallback for @mui/system/DefaultPropsProvider during SSR
import React from 'react';

const DefaultPropsProvider = ({ children }) => children;

export default DefaultPropsProvider;
