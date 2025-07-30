import React, { useState } from 'react';
import styled from 'styled-components';
import { CgDarkMode } from 'react-icons/cg';
import { useTheme } from '../context/ThemeContext';

const SettingsBrightnessIcon = styled.span`
  font-size: 24px;
  &::before {
    content: '⚙️';
  }
`;

const ComputerIcon = styled.span`
  font-size: 24px;
  &::before {
    content: '💻';
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
  background-color: transparent;
  outline: 0;
  border: 0;
  margin: 0;
  cursor: pointer;
  user-select: none;
  vertical-align: middle;
  appearance: none;
  text-decoration: none;
  color: inherit;
  padding: 8px;
  border-radius: 50%;
  overflow: visible;
  font-size: 1.5rem;
  background: rgba(0, 0, 0, 0.04);
  border: 2px solid rgba(0, 0, 0, 0.12);

  &:focus-visible {
    outline: 2px solid #1976d2;
    outline-offset: 2px;
  }

  @media (prefers-color-scheme: dark) {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.12);

    &:focus-visible {
      outline-color: #90caf9;
    }
  }
`;

const StyledTooltip = styled.div`
  position: relative;
  display: inline-flex;

  &:hover::after {
    content: attr(data-tooltip);
    position: absolute;
    top: -35px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(97, 97, 97, 0.92);
    color: #fff;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.75rem;
    white-space: nowrap;
    z-index: 1400;
    pointer-events: none;
    animation: tooltipFadeIn 0.15s ease-in;
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

const SystemIndicator = styled.div`
  display: flex;
  align-items: center;
  margin-left: 8px;
  padding: 4px 8px;
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  font-size: 0.75rem;
  color: rgba(0, 0, 0, 0.6);

  @media (max-width: 960px) {
    display: none;
  }

  @media (prefers-color-scheme: dark) {
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: rgba(255, 255, 255, 0.7);
  }
`;

function DarkModeToggle() {
  const { isDarkMode, isSystemPreference, toggleTheme, resetToSystemPreference } = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    if (isSystemPreference) {
      setAnchorEl(event.currentTarget);
    } else {
      toggleTheme();
    }
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
          aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
        >
          <CgDarkMode />
        </StyledIconButton>
      </StyledTooltip>

      {isSystemPreference && (
        <SystemIndicator role="status" aria-hidden="false">
          <ComputerIcon />
          <span>Auto</span>
        </SystemIndicator>
      )}

      {open && (
        <StyledMenu>
          <StyledMenuItem onClick={handleToggleMode}>
            <MenuIcon><CgDarkMode /></MenuIcon>
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
