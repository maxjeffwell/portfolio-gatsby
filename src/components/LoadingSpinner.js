import React from 'react';
import { css } from '@emotion/react';
import { useTheme } from '../context/ThemeContext';

const LoadingSpinner = () => {
  const { theme } = useTheme();

  return (
    <div
      css={css`
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 200px;
      `}
    >
      <div
        css={css`
          position: relative;
          width: 60px;
          height: 60px;
        `}
      >
        <div
          css={css`
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: 3px solid transparent;
            border-top: 3px solid ${theme.colors.accent};
            border-radius: 50%;
            animation: spin 1s linear infinite;
            
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        />
        <div
          css={css`
            position: absolute;
            top: 6px;
            left: 6px;
            width: calc(100% - 12px);
            height: calc(100% - 12px);
            border: 2px solid transparent;
            border-bottom: 2px solid ${theme.colors.accentSecondary};
            border-radius: 50%;
            animation: spin-reverse 1.5s linear infinite;
            
            @keyframes spin-reverse {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(-360deg); }
            }
          `}
        />
        <div
          css={css`
            position: absolute;
            top: 50%;
            left: 50%;
            width: 8px;
            height: 8px;
            background: ${theme.gradients.accent};
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: ${theme.animations.pulse};
          `}
        />
      </div>
    </div>
  );
};

export default LoadingSpinner;