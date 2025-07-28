// SSR-safe Chip fallback component
import React from 'react';
import styled from '@emotion/styled';

const StyledChip = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  padding: 0 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.43;
  letter-spacing: 0.01071em;
  background-color: transparent;
  border: 1px solid rgba(0, 0, 0, 0.23);
  color: rgba(0, 0, 0, 0.87);
  
  @media (prefers-color-scheme: dark) {
    border-color: rgba(255, 255, 255, 0.23);
    color: rgba(255, 255, 255, 0.87);
  }
`;

// Simple fallback component that doesn't cause SSR issues
const ChipFallback = ({ label, size, color, variant, ...props }) => {
  return (
    <StyledChip {...props}>
      {label}
    </StyledChip>
  );
};

// Export as default and named export to match MUI Chip API
export default ChipFallback;
export { ChipFallback as Chip };