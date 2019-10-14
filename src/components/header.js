import { Link } from 'gatsby';
import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

import MyLogo from './myLogo';

const NavLink = styled(Link)`
  color: #ffffff;
  font-weight: ${props => props.fontWeight || 'normal'};
  line-height: 1;
  margin: 0 0.75rem 0 0;
  text-decoration: none;
  &.current-page {
    border-bottom: 2px solid #f7b733;
  }
  &:last-of-type {
    margin-right: 0;
  }
`;

const Header = () => (
  // eslint-disable-next-line react/jsx-filename-extension
  <header
    css={css`
      display: grid;
      grid-template-columns: auto 1fr auto;
      font-family: AvenirLTStd-Roman, sans-serif;
      font-size: 2rem;
      margin: 2rem auto 4rem;
      max-width: 90vw;
      width: 960px;
      @media (max-width: 480px) {
        font-size: 1.5rem;
      }
      @media (max-width: 360px) {
        font-size: 1.25rem;
      }
    `}
  >
    <nav
      css={css`
        margin-top: 0;
        grid-column: 2 / 4;
        align-self: end;
      `}
    >
      <NavLink to="/" fontWeight="bold" activeClassName="current-page">
        Home
      </NavLink>
      <NavLink to="/about" fontWeight="bold" activeClassName="current-page" partiallyActive>
        Bio
      </NavLink>
      <NavLink to="/projects" fontWeight="bold" activeClassName="current-page" partiallyActive>
        Projects
      </NavLink>
    </nav>
    <div
      css={css`
        grid-column: 3 / 4;
        align-self: end;
      `}
    >
      <MyLogo />
    </div>
  </header>
);

export default Header;
