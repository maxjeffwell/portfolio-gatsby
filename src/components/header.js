import { Link } from 'gatsby';
import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

import MyLogo from './myLogo';

const NavLink = styled(Link)`
  color: #ffffff;
  font-weight: ${props => props.fontWeight || 'normal'};
  line-height: 1;
  margin: 0 0.5rem 0 0;
  padding: 0.25rem;
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
      padding: 0.5rem calc((100vw - 960px - 0.5rem) / 2);
    `}
  >
    <nav
      css={css`
        margin-top: 0;
        grid-column: 1 / 2;
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
        align-content: end;
      `}
    >
      <MyLogo />
    </div>
  </header>
);

export default Header;
