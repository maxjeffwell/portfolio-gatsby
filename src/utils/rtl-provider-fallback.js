// Fallback for @mui/system/RtlProvider during SSR
import React from 'react';

const RtlProvider = ({ children }) => children;

export default RtlProvider;
export { RtlProvider };
