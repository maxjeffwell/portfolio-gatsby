import React, { useState } from 'react';
import styled from 'styled-components';
import ClientOnlyIcon from './ClientOnlyIcon';
import { useTheme } from '../context/ThemeContext';

const SettingsBrightnessIcon = styled.span`
  font-size: 24px;
  &::before {
    content: '⚙️';
  }
`;

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
`;

const StyledMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #ffffff;
  border-radius: 4px;
  box-shadow:
    0px 5px 5px -3px rgba(0, 0, 0, 0.2),
    0px 8px 10px 1px rgba(0, 0, 0, 0.14),
    0px 3px 14px 2px rgba(0, 0, 0, 0.12);
  min-width: 200px;
  z-index: 1300;
  overflow: hidden;

  @media (prefers-color-scheme: dark) {
    background-color: #424242;
  }
`;

const StyledMenuItem = styled.div`
  padding: 6px 16px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }

  @media (prefers-color-scheme: dark) {
    &:hover {
      background-color: rgba(255, 255, 255, 0.08);
    }
  }
`;

const MenuIcon = styled.div`
  display: flex;
  align-items: center;
  min-width: 56px;
  color: rgba(0, 0, 0, 0.54);

  @media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.7);
  }
`;

const MenuText = styled.span`
  margin: 0;
  font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.5;
  letter-spacing: 0.00938em;
  color: rgba(0, 0, 0, 0.87);

  @media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.87);
  }
`;

const StyledIconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-sizing: border-box;
  outline: 0;
  border: 0;
  margin: 0;
  cursor: pointer;
  user-select: none;
  vertical-align: middle;
  appearance: none;
  text-decoration: none;
  color: ${(props) => props.theme?.colors?.primary || '#1565c0'};
  padding: 8px;
  border-radius: 50%;
  overflow: visible;
  font-size: 2rem;
  background: transparent;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }

  &:focus-visible {
    outline: 2px solid ${(props) => props.theme?.colors?.secondary || '#e91e63'};
    outline-offset: 2px;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const StyledTooltip = styled.div`
  position: relative;
  display: inline-flex;

  &:hover::after {
    content: attr(data-tooltip);
    position: absolute;
    top: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(97, 97, 97, 0.92);
    color: #fff;
    padding: 6px 10px;
    border-radius: 6px;
    font-size: 0.75rem;
    white-space: nowrap;
    z-index: 1400;
    pointer-events: none;
    animation: tooltipFadeIn 0.15s ease-in;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  @keyframes tooltipFadeIn {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
`;

function DarkModeToggle() {
  const { isDarkMode, toggleTheme, resetToSystemPreference } = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = () => {
    // Always toggle theme directly - this is more intuitive
    toggleTheme();
  };

  const handleRightClick = (event) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleToggleMode = () => {
    toggleTheme();
    handleClose();
  };

  const handleSystemReset = () => {
    resetToSystemPreference();
    handleClose();
  };

  return (
    <StyledContainer>
      <StyledTooltip data-tooltip={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}>
        <StyledIconButton
          onClick={handleClick}
          onContextMenu={handleRightClick}
          aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
          theme={{
            mode: isDarkMode ? 'dark' : 'light',
            colors: { primary: '#1565c0', secondary: '#e91e63' },
          }}
        >
          <ClientOnlyIcon iconName="DarkModeToggle" fontSize="48px" />
        </StyledIconButton>
      </StyledTooltip>

      {open && (
        <StyledMenu>
          <StyledMenuItem onClick={handleToggleMode}>
            <MenuIcon>
              <ClientOnlyIcon iconName="DarkModeToggle" style={{ fontSize: '1.5rem' }} />
            </MenuIcon>
            <MenuText>Switch to {isDarkMode ? 'light' : 'dark'} mode</MenuText>
          </StyledMenuItem>
          <StyledMenuItem onClick={handleSystemReset}>
            <MenuIcon>
              <SettingsBrightnessIcon />
            </MenuIcon>
            <MenuText>Follow system preference</MenuText>
          </StyledMenuItem>
        </StyledMenu>
      )}
    </StyledContainer>
  );
}

export default DarkModeToggle;
