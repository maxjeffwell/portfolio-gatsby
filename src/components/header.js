import { Link } from 'gatsby';
// import PropTypes from 'prop-types';
import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

const NavLink = styled(Link)`
  color: #222;
  font-size: 1rem;
  font-weight: ${props => props.fontWeight || 'normal'};
  line-height: 1;
  margin: 0 0.5rem 0 0;
  padding: 0.25rem;
  text-decoration: none;
  &.current-page {
    border-bottom: 2px solid #222;
  }
  &:last-of-type {
    margin-right: 0;
  }
`;

const Header = () => (
  // eslint-disable-next-line react/jsx-filename-extension
  <header
    css={css`
      font-family: LetterGothicStd, serif;
      background: #eee;
      border-bottom: 1px solid #ddd;
      display: flex;
      justify-content: space-between;
      padding: 0.5rem calc((100vw - 960px - 0.5rem) / 2);
    `}
  >
    <nav
      css={css`
        margin-top: 0;
      `}
    >
      <NavLink to="/" fontWeight="bold" activeClassName="current-page">
        Home
      </NavLink>
    </nav>
  </header>
);

// Header.propTypes = {
//   siteTitle: PropTypes.string,
// };

// Header.defaultProps = {
//   siteTitle: `My Portfolio`,
// };

export default Header;
