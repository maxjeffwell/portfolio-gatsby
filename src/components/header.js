import { Link } from 'gatsby';
import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

import MyLogo from './myLogo';
import DarkModeToggle from './DarkModeToggle';
import { useTheme } from '../context/ThemeContext';

const NavLink = styled(Link)`
  color: ${(props) => props.theme.colors.text};
  font-weight: ${(props) => props.fontWeight || 'normal'};
  line-height: 1;
  text-decoration: none;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all ${(props) => props.theme.transitions.normal};

  &.current-page {
    border-bottom: 2px solid ${(props) => props.theme.colors.accentSecondary};
    background-color: ${(props) => props.theme.colors.accentSecondary}15;
  }

  &:hover {
    background-color: ${(props) => props.theme.colors.text}15;
    color: ${(props) => props.theme.colors.accentSecondary};
  }

  &:focus {
    outline: 2px solid ${(props) => props.theme.colors.accentSecondary};
    outline-offset: 2px;
    background-color: ${(props) => props.theme.colors.accentSecondary}25;
  }

  &:focus:not(:focus-visible) {
    outline: none;
  }

  &:focus-visible {
    outline: 2px solid ${(props) => props.theme.colors.accentSecondary};
    outline-offset: 2px;
  }
`;

const Header = () => {
  const { theme } = useTheme();

  return (
    <header
      role="banner"
      css={css`
        display: grid;
        grid-template-columns: auto 1fr 0.25fr auto auto;
        font-family: AvenirLTStd-Roman, sans-serif;
        font-size: 2rem;
        margin: 2rem auto 4rem;
        max-width: 90vw;
        width: 960px;
        align-items: center;
        gap: 1rem;
        @media (max-width: 480px) {
          font-size: 1.5rem;
          grid-template-columns: auto 1fr auto;
        }
        @media (max-width: 360px) {
          font-size: 1.25rem;
        }
      `}
    >
      <nav
        role="navigation"
        aria-label="Main navigation"
        css={css`
          margin-top: 0;
          grid-column: 2 / 3;
          align-self: end;
        `}
      >
        <ul
          css={css`
            list-style: none;
            margin: 0;
            padding: 0;
            display: flex;
            gap: 0.75rem;
          `}
        >
          <li>
            <NavLink
              to="/"
              fontWeight="bold"
              activeClassName="current-page"
              aria-current="page"
              theme={theme}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              fontWeight="bold"
              activeClassName="current-page"
              partiallyActive
              theme={theme}
            >
              Bio
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/projects"
              fontWeight="bold"
              activeClassName="current-page"
              partiallyActive
              theme={theme}
            >
              Projects
            </NavLink>
          </li>
        </ul>
      </nav>
      <div
        css={css`
          display: grid;
          grid-column: 3 / 4;
          justify-items: end;
          @media (max-width: 480px) {
            display: none;
          }
        `}
      >
        <MyLogo />
      </div>
      <div
        css={css`
          grid-column: 4 / 5;
          display: flex;
          align-items: center;
          justify-self: end;
          @media (max-width: 480px) {
            grid-column: 3 / 4;
          }
        `}
      >
        <DarkModeToggle />
      </div>
    </header>
  );
};

export default Header;
