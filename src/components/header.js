import { Link } from 'gatsby';
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

import MyLogo from './myLogo';
import SSRSafeDarkModeToggle from './SSRSafeDarkModeToggle';
import { useTheme } from '../context/ThemeContext';

// Simple icon components using Unicode symbols
const MenuIcon = styled.span`
  font-size: 24px;
  &::before {
    content: '☰';
  }
`;

const CloseIcon = styled.span` 
  font-size: 24px;
  &::before {
    content: '✕';
  }
`;

const StyledContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;

  @media (max-width: 600px) {
    padding: 0 16px;
  }
`;

const StyledBox = styled.div`
  display: ${(props) => props.display || 'block'};
  justify-content: ${(props) => props.justifyContent || 'flex-start'};
  flex-direction: ${(props) => props.flexDirection || 'row'};
  align-items: ${(props) => props.alignItems || 'stretch'};
  gap: ${(props) => (props.gap ? `${props.gap * 8}px` : '0')};
  padding: ${(props) => (props.p ? `${props.p * 8}px` : '0')};
  text-align: ${(props) => props.textAlign || 'inherit'};
`;

const StyledAppBar = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1100;
  width: 100%;
  background: ${props => props.theme?.colors?.paper || '#ffffff'};
  color: ${props => props.theme?.colors?.text || '#333333'};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease, color 0.3s ease;
`;

const StyledToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 80px;
  padding: 0 16px;

  @media (max-width: 599px) {
    padding: 0 8px;
    min-height: 64px;
  }
`;

const NavButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 24px;
  margin: 0 8px;
  text-decoration: none;
  color: ${props => props.theme?.colors?.text || '#333'};
  background-color: ${props => props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : '#e8eaf6'};
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1;
  border-radius: 10px;
  text-transform: none;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : '#c5cae9'};
    transform: translateY(-1px);
  }

  &.active {
    background-color: ${props => props.theme?.colors?.primary || '#1976d2'};
    color: ${props => props.theme?.mode === 'dark' ? '#000' : '#fff'};
  }
  
  &:first-child {
    margin-left: 0;
  }

  @media (max-width: 1200px) {
    font-size: 1rem;
    padding: 12px 20px;
  }

  @media (max-width: 960px) {
    font-size: 0.95rem;
    padding: 10px 16px;
  }
`;

const StyledIconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  padding: 12px;
  border-radius: 50%;
  border: none;
  background-color: transparent;
  color: ${props => props.theme?.mode === 'dark' 
    ? (props.theme?.colors?.text || 'rgba(255, 255, 255, 0.87)') 
    : 'rgba(0, 0, 0, 0.8)'};
  cursor: pointer;
  font-size: 1.5rem;
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1), color 0.3s ease;

  &:hover {
    background-color: ${props => props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'};
  }

  &:focus {
    outline: 2px solid ${props => props.theme?.colors?.primary || '#1976d2'};
    outline-offset: 2px;
  }
`;

const StyledDrawer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1300;
  height: 100%;
  width: 80%;
  max-width: 300px;
  background-color: ${props => props.theme?.colors?.paper || '#ffffff'};
  color: ${props => props.theme?.colors?.text || '#333333'};
  box-shadow:
    0px 8px 10px -5px rgba(0, 0, 0, 0.2),
    0px 16px 24px 2px rgba(0, 0, 0, 0.14),
    0px 6px 30px 5px rgba(0, 0, 0, 0.12);
  transform: ${(props) => (props.open ? 'translateX(0)' : 'translateX(-100%)')};
  transition: transform 225ms cubic-bezier(0, 0, 0.2, 1), background-color 0.3s ease, color 0.3s ease;

  @media (max-width: 360px) {
    width: 85%;
    max-width: 280px;
  }
`;

const DrawerBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1200;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: ${(props) => (props.open ? 1 : 0)};
  visibility: ${(props) => (props.open ? 'visible' : 'hidden')};
  transition:
    opacity 225ms cubic-bezier(0, 0, 0.2, 1),
    visibility 225ms cubic-bezier(0, 0, 0.2, 1);
`;

const MobileNavButton = styled.a`
  display: block;
  width: 100%;
  padding: 18px;
  text-decoration: none;
  color: ${props => props.theme?.colors?.text || '#333'};
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: 1.4rem;
  font-weight: 500;
  text-align: center;
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1), color 0.3s ease;

  &:hover {
    background-color: ${props => props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'};
  }
`;

const ToolbarSpacer = styled.div`
  min-height: 80px;

  @media (max-width: 599px) {
    min-height: 64px;
  }
`;

function Header() {
  const { theme } = useTheme();
  const [currentPath, setCurrentPath] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false); // Default to false for SSR
  const menuButtonRef = useRef(null);

  // Client-side only theme and media query handling
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Set current path from window.location
      setCurrentPath(window.location.pathname);

      // Handle media query with client-side fallback
      const mediaQuery = window.matchMedia('(min-width: 960px)');
      setIsMobile(!mediaQuery.matches);

      const handleMediaChange = (e) => {
        setIsMobile(!e.matches);
      };

      mediaQuery.addEventListener('change', handleMediaChange);

      return () => {
        mediaQuery.removeEventListener('change', handleMediaChange);
      };
    }
    return undefined;
  }, []);

  // Remove theme dependency - use CSS media queries instead

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDrawerToggle = () => {
    const wasOpen = mobileOpen;
    setMobileOpen(!mobileOpen);

    // Focus management: when drawer closes, restore focus to menu button
    if (wasOpen && menuButtonRef.current) {
      setTimeout(() => {
        if (menuButtonRef.current) {
          menuButtonRef.current.focus();
        }
      }, 100);
    }
  };

  const menuItems = [
    { text: 'Home', to: '/' },
    { text: 'Bio', to: '/about' },
    { text: 'Projects', to: '/projects' },
    { text: 'Contact', to: '/contact' },
  ];

  const drawer = (
    <StyledBox textAlign="center">
      <StyledBox display="flex" justifyContent="flex-end" p={2}>
        <StyledIconButton theme={theme} onClick={handleDrawerToggle} aria-label="close drawer">
          <CloseIcon />
        </StyledIconButton>
      </StyledBox>
      <StyledBox
        component="nav"
        aria-label="Mobile navigation"
        display="flex"
        flexDirection="column"
        p={2}
      >
        {menuItems.map((item) => (
          <MobileNavButton 
            key={item.text} 
            as={Link} 
            to={item.to} 
            theme={theme}
            onClick={handleDrawerToggle}
          >
            {item.text}
          </MobileNavButton>
        ))}
      </StyledBox>
    </StyledBox>
  );

  return (
    <>
      <StyledAppBar theme={theme} scrolled={isScrolled ? 1 : 0}>
        <StyledContainer>
          <StyledToolbar>
            {isMobile && (
              <StyledIconButton
                theme={theme}
                aria-label="open drawer"
                onClick={handleDrawerToggle}
                ref={menuButtonRef}
              >
                <MenuIcon />
              </StyledIconButton>
            )}

            <StyledBox
              as="nav"
              aria-label="Main navigation"
              display="flex"
              alignItems="center"
            >
              {!isMobile && menuItems.map((item) => (
                <NavButton
                  key={item.text}
                  as={Link}
                  to={item.to}
                  theme={theme}
                  className={currentPath === item.to ? 'active' : ''}
                  aria-current={currentPath === item.to ? 'page' : undefined}
                >
                  {item.text}
                </NavButton>
              ))}
            </StyledBox>

            <StyledBox display="flex" alignItems="center" gap={2}>
              <MyLogo />
              <SSRSafeDarkModeToggle />
            </StyledBox>
          </StyledToolbar>
        </StyledContainer>
      </StyledAppBar>

      {mobileOpen && (
        <>
          <DrawerBackdrop open={mobileOpen} onClick={handleDrawerToggle} />
          <StyledDrawer theme={theme} open={mobileOpen}>{drawer}</StyledDrawer>
        </>
      )}

      {/* Toolbar spacer */}
      <ToolbarSpacer />
    </>
  );
}

export default Header;
