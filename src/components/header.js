import { Link } from 'gatsby';
import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { FaBars, FaTimes } from 'react-icons/fa';

import MyLogo from './myLogo';
import DarkModeToggle from './DarkModeToggle';
import { useTheme } from '../context/ThemeContext';

const NavLink = styled(Link)`
  color: ${(props) => props.theme.name === 'dark' ? '#000000' : props.theme.colors.text};
  font-weight: ${(props) => props.fontWeight || 'normal'};
  line-height: 1;
  text-decoration: none;
  padding: 0.75rem 1.25rem;
  border-radius: 25px;
  transition: all ${(props) => props.theme.transitions.normal};
  position: relative;
  overflow: hidden;
  display: block;

  @media (max-width: 768px) {
    padding: 1rem 2rem;
    font-size: 1.5rem;
    border-radius: 15px;
    text-align: center;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: ${(props) => props.theme.gradients.accent};
    transition: left ${(props) => props.theme.transitions.normal};
    z-index: -1;
  }

  &.current-page {
    background: ${(props) => props.theme.gradients.accent};
    color: ${(props) => props.theme.colors.textInverse};
    box-shadow: ${(props) => props.theme.shadows.medium};
    transform: translateY(-2px);

    &::before {
      left: 0;
    }
  }

  &:hover:not(.current-page) {
    background: ${(props) => props.theme.gradients.subtle};
    color: ${(props) => props.theme.colors.accentSecondary};
    transform: translateY(-2px);
    box-shadow: ${(props) => props.theme.shadows.small};

    &::before {
      left: 0;
      opacity: 0.1;
    }
  }

  &:focus {
    outline: 2px solid ${(props) => props.theme.colors.accentSecondary};
    outline-offset: 3px;
    transform: translateY(-2px);
  }

  &:focus:not(:focus-visible) {
    outline: none;
  }

  &:focus-visible {
    outline: 2px solid ${(props) => props.theme.colors.accentSecondary};
    outline-offset: 3px;
  }
`;

const Header = () => {
  const { theme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      role="banner"
      css={css`
        display: grid;
        grid-template-columns: auto 1fr auto auto;
        font-family: AvenirLTStd-Roman, sans-serif;
        font-size: 2rem;
        margin: 2rem auto 4rem;
        max-width: 90vw;
        width: 1100px;
        align-items: center;
        gap: 1rem;
        opacity: 1;
        transform: translateY(0);
        transition: all ${theme.transitions.slow};
        position: relative;
        overflow: hidden;
        padding: 1rem 2rem;
        border-radius: 20px;
        background: ${isScrolled ? `${theme.colors.surface}95` : 'transparent'};
        backdrop-filter: ${isScrolled ? 'blur(20px)' : 'none'};
        border: ${isScrolled ? `1px solid ${theme.colors.border}` : '1px solid transparent'};
        box-shadow: ${isScrolled ? theme.shadows.medium : 'none'};

        &::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background:
            radial-gradient(circle at 30% 20%, ${theme.colors.accent}08 0%, transparent 50%),
            radial-gradient(
              circle at 70% 80%,
              ${theme.colors.accentSecondary}08 0%,
              transparent 50%
            );
          animation: floatBackground 20s ease-in-out infinite;
          pointer-events: none;
          z-index: -1;
        }

        &::after {
          content: '';
          position: absolute;
          bottom: -1rem;
          left: 50%;
          transform: translateX(-50%);
          width: 60%;
          height: 1px;
          background: ${theme.gradients.accent};
          opacity: 0.3;
        }

        @keyframes floatBackground {
          0%,
          100% {
            transform: translateX(-10px) translateY(-10px) rotate(0deg);
          }
          33% {
            transform: translateX(10px) translateY(-20px) rotate(1deg);
          }
          66% {
            transform: translateX(-5px) translateY(10px) rotate(-1deg);
          }
        }

        @media (max-width: 768px) {
          font-size: 1.75rem;
          width: 95vw;
        }

        @media (max-width: 768px) {
          grid-template-columns: auto 1fr auto auto;
          padding: 0.75rem 1.5rem;
        }

        @media (max-width: 480px) {
          font-size: 1.5rem;
          grid-template-columns: 1fr auto auto;
          padding: 0.5rem 1rem;
        }
        @media (max-width: 360px) {
          font-size: 1.25rem;
        }
      `}
    >
      {/* Mobile menu button */}
      <button
        css={css`
          display: none;
          background: none;
          border: none;
          color: ${theme.name === 'dark' ? '#000000' : theme.colors.text};
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 8px;
          transition: all ${theme.transitions.normal};
          grid-column: 2 / 3;
          justify-self: end;

          &:hover {
            background: ${theme.colors.surfaceVariant};
            transform: scale(1.1);
          }

          &:focus {
            outline: 2px solid ${theme.colors.accentSecondary};
            outline-offset: 2px;
          }

          @media (max-width: 768px) {
            display: block;
          }
        `}
        onClick={toggleMobileMenu}
        aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isMobileMenuOpen}
      >
        {isMobileMenuOpen
          ? typeof window !== 'undefined' && <FaTimes />
          : typeof window !== 'undefined' && <FaBars />}
      </button>

      <nav
        role="navigation"
        aria-label="Main navigation"
        css={css`
          margin-top: 0;
          grid-column: 2 / 3;
          align-self: end;

          @media (max-width: 768px) {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: ${theme.colors.surface}98;
            backdrop-filter: blur(20px);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: ${isMobileMenuOpen ? 1 : 0};
            visibility: ${isMobileMenuOpen ? 'visible' : 'hidden'};
            transition: all ${theme.transitions.normal};
            grid-column: 1 / -1;
          }
        `}
      >
        {/* Close button for mobile */}
        <button
          css={css`
            display: none;
            position: absolute;
            top: 2rem;
            right: 2rem;
            background: none;
            border: none;
            color: ${theme.name === 'dark' ? '#000000' : theme.colors.text};
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 8px;
            transition: all ${theme.transitions.normal};

            &:hover {
              background: ${theme.colors.surfaceVariant};
            }

            @media (max-width: 768px) {
              display: block;
            }
          `}
          onClick={closeMobileMenu}
          aria-label="Close menu"
        >
          {typeof window !== 'undefined' && <FaTimes />}
        </button>

        <ul
          css={css`
            list-style: none;
            margin: 0;
            padding: 0;
            display: flex;
            gap: 0.75rem;

            @media (max-width: 768px) {
              flex-direction: column;
              gap: 2rem;
              text-align: center;
            }
          `}
        >
          <li>
            <NavLink
              to="/"
              fontWeight="bold"
              activeClassName="current-page"
              aria-current="page"
              theme={theme}
              onClick={closeMobileMenu}
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
              onClick={closeMobileMenu}
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
              onClick={closeMobileMenu}
            >
              Projects
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contact"
              fontWeight="bold"
              activeClassName="current-page"
              partiallyActive
              theme={theme}
              onClick={closeMobileMenu}
            >
              Contact
            </NavLink>
          </li>
        </ul>
      </nav>
      <div
        css={css`
          display: grid;
          grid-column: 3 / 4;
          justify-items: end;

          @media (max-width: 768px) {
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

          @media (max-width: 768px) {
            grid-column: 3 / 4;
          }

          @media (max-width: 480px) {
            grid-column: 3 / 4;
          }
        `}
      >
        <DarkModeToggle />
      </div>

      {/* Mobile menu backdrop */}
      {isMobileMenuOpen && (
        <div
          css={css`
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
            display: none;

            @media (max-width: 768px) {
              display: block;
            }
          `}
          onClick={closeMobileMenu}
        />
      )}
    </header>
  );
};

export default Header;
