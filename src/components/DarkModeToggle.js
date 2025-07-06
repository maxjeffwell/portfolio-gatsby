import React, { useState } from 'react';
import { css } from '@emotion/react';
import { FaSun, FaMoon, FaDesktop } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const DarkModeToggle = () => {
  const { isDarkMode, isSystemPreference, toggleTheme, resetToSystemPreference, theme } =
    useTheme();
  const [showOptions, setShowOptions] = useState(false);

  const handleToggle = () => {
    if (showOptions) {
      setShowOptions(false);
    } else {
      toggleTheme();
    }
  };

  const handleSystemReset = () => {
    resetToSystemPreference();
    setShowOptions(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setShowOptions(false);
    }
  };

  return (
    <div
      css={css`
        position: relative;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      `}
    >
      {/* Main toggle button */}
      <button
        css={css`
          background: ${theme.colors.surfaceVariant};
          border: 2px solid ${theme.colors.border};
          border-radius: 24px;
          padding: 0.5rem;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all ${theme.transitions.normal};
          position: relative;
          overflow: hidden;

          &:hover {
            border-color: ${theme.colors.accentSecondary};
            transform: scale(1.05);
            box-shadow: ${theme.shadows.medium};
          }

          &:focus {
            outline: 2px solid ${theme.colors.accentSecondary};
            outline-offset: 2px;
            border-color: ${theme.colors.accentSecondary};
          }

          &:active {
            transform: scale(0.95);
          }

          @media (max-width: 768px) {
            width: 44px;
            height: 44px;
          }
        `}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode. Currently in ${isDarkMode ? 'dark' : 'light'} mode.`}
        title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      >
        {/* Animated background */}
        <div
          css={css`
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: ${isDarkMode
              ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
              : 'linear-gradient(135deg, #ffd89b 0%, #19547b 100%)'};
            transition: background ${theme.transitions.normal};
            border-radius: 20px;
            will-change: background;
          `}
        />

        {/* Icon container */}
        <div
          css={css`
            position: relative;
            z-index: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
          `}
        >
          {typeof window !== 'undefined' && isDarkMode ? (
            <FaMoon
              css={css`
                color: #ffc947;
                font-size: 1.2rem;
                filter: drop-shadow(0 0 6px rgba(255, 201, 71, 0.5));
                transition: all ${theme.transitions.normal};
                
                &:hover {
                  filter: drop-shadow(0 0 8px rgba(255, 201, 71, 0.7));
                  transform: scale(1.1);
                }
              `}
              aria-hidden="true"
            />
          ) : (
            typeof window !== 'undefined' && <FaSun
              css={css`
                color: #ffa500;
                font-size: 1.2rem;
                filter: drop-shadow(0 0 6px rgba(255, 165, 0, 0.5));
                transition: all ${theme.transitions.normal};
                
                &:hover {
                  filter: drop-shadow(0 0 8px rgba(255, 165, 0, 0.7));
                  transform: scale(1.1) rotate(15deg);
                }
              `}
              aria-hidden="true"
            />
          )}
        </div>
      </button>

      {/* System preference indicator */}
      {isSystemPreference && (
        <button
          css={css`
            background: transparent;
            border: 1px solid ${theme.colors.border};
            border-radius: 20px;
            padding: 0.25rem 0.5rem;
            display: flex;
            align-items: center;
            gap: 0.25rem;
            cursor: pointer;
            transition: all ${theme.transitions.normal};
            font-size: 0.75rem;
            color: ${theme.colors.textSecondary};

            &:hover {
              border-color: ${theme.colors.accentSecondary};
              color: ${theme.colors.text};
            }

            &:focus {
              outline: 2px solid ${theme.colors.accentSecondary};
              outline-offset: 2px;
            }

            @media (max-width: 768px) {
              display: none;
            }
          `}
          onClick={() => setShowOptions(!showOptions)}
          aria-label="Theme settings - currently following system preference"
          title="Currently following system preference"
        >
          {typeof window !== 'undefined' && <FaDesktop
            css={css`
              font-size: 0.8rem;
            `}
            aria-hidden="true"
          />}
          <span>Auto</span>
        </button>
      )}

      {/* Options dropdown */}
      {showOptions && (
        <div
          css={css`
            position: absolute;
            top: 100%;
            right: 0;
            margin-top: 0.5rem;
            background: ${theme.colors.surface};
            border: 2px solid ${theme.colors.border};
            border-radius: 8px;
            padding: 0.5rem;
            box-shadow: ${theme.shadows.large};
            z-index: 1000;
            min-width: 200px;
            animation: dropdownFadeIn 0.2s ease-out;

            @keyframes dropdownFadeIn {
              from {
                opacity: 0;
                transform: translateY(-10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            @media (max-width: 768px) {
              right: -1rem;
              min-width: 180px;
            }
          `}
        >
          <h3
            css={css`
              color: ${theme.colors.text};
              font-size: 0.9rem;
              margin: 0 0 0.5rem 0;
              padding: 0 0.5rem;
              font-family: HelveticaNeueLTStd-Bd, sans-serif;
            `}
          >
            Theme Settings
          </h3>

          <button
            css={css`
              width: 100%;
              background: transparent;
              border: none;
              padding: 0.5rem;
              display: flex;
              align-items: center;
              gap: 0.5rem;
              cursor: pointer;
              border-radius: 4px;
              color: ${theme.colors.text};
              transition: background-color ${theme.transitions.fast};

              &:hover {
                background: ${theme.colors.surfaceVariant};
              }

              &:focus {
                outline: 2px solid ${theme.colors.accentSecondary};
                outline-offset: -2px;
              }
            `}
            onClick={handleSystemReset}
          >
            {typeof window !== 'undefined' && <FaDesktop aria-hidden="true" />}
            <span>Follow system preference</span>
          </button>
        </div>
      )}

      {/* Screen reader announcement */}
      <div
        css={css`
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        `}
        aria-live="polite"
        aria-atomic="true"
      >
        {`Theme changed to ${isDarkMode ? 'dark' : 'light'} mode${isSystemPreference ? ' (following system preference)' : ''}`}
      </div>
    </div>
  );
};

export default DarkModeToggle;
