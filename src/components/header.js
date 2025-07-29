import { Link } from 'gatsby';
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

import MyLogo from './myLogo';
import DarkModeToggle from './DarkModeToggle';

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

const getAppBarBackground = (scrolled) => {
  if (!scrolled) return 'transparent';
  return 'rgba(255, 255, 255, 0.95)';
};

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
  background: ${(props) => {
    if (props.scrolled) {
      return props.theme?.mode === 'dark' ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)';
    }
    return 'transparent';
  }};
  backdrop-filter: ${(props) => (props.scrolled ? 'blur(20px)' : 'none')};
  box-shadow: ${(props) =>
    props.scrolled
      ? '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)'
      : 'none'};
  transition:
    background 250ms cubic-bezier(0.4, 0, 0.2, 1),
    backdrop-filter 250ms cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1);
`;

const StyledToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 64px;
  padding: 8px 16px;

  @media (max-width: 599px) {
    padding: 4px 8px;
    min-height: 56px;
  }

  @media (max-width: 360px) {
    padding: 0.5rem 0.75rem;
    min-height: 48px;
  }
`;

const NavButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 64px;
  padding: 8px 24px;
  margin: 0 4px;
  text-decoration: none;
  color: ${props => props.theme?.colors?.text || (props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)')};
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.75;
  border-radius: 20px;
  padding: 8px 24px;
  margin-left: 8px;
  margin-right: 8px;
  text-transform: none;
  font-size: 1rem;
  font-weight: 500;
  transition:
    background-color 250ms cubic-bezier(0.4, 0, 0.2, 1),
    transform 250ms cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-2px);
    box-shadow:
      0px 3px 1px -2px rgba(0, 0, 0, 0.2),
      0px 2px 2px 0px rgba(0, 0, 0, 0.14),
      0px 1px 5px 0px rgba(0, 0, 0, 0.12);
  }

  &.active {
    background-color: #fc4a1a;
    color: white;
    box-shadow:
      0px 2px 4px -1px rgba(0, 0, 0, 0.2),
      0px 4px 5px 0px rgba(0, 0, 0, 0.14),
      0px 1px 10px 0px rgba(0, 0, 0, 0.12);
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
  color: inherit;
  cursor: pointer;
  font-size: 1.5rem;
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }

  @media (prefers-color-scheme: dark) {
    &:hover {
      background-color: rgba(255, 255, 255, 0.08);
    }
  }

  &:focus {
    outline: 2px solid #1976d2;
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
  background-color: white;
  box-shadow:
    0px 8px 10px -5px rgba(0, 0, 0, 0.2),
    0px 16px 24px 2px rgba(0, 0, 0, 0.14),
    0px 6px 30px 5px rgba(0, 0, 0, 0.12);
  transform: ${(props) => (props.open ? 'translateX(0)' : 'translateX(-100%)')};
  transition: transform 225ms cubic-bezier(0, 0, 0.2, 1);

  @media (prefers-color-scheme: dark) {
    background-color: #1e1e1e;
    background-image: linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05));
  }

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
  padding: 16px;
  text-decoration: none;
  color: inherit;
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: 1.25rem;
  text-align: center;
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }

  @media (prefers-color-scheme: dark) {
    &:hover {
      background-color: rgba(255, 255, 255, 0.08);
    }
  }
`;

const ToolbarSpacer = styled.div`
  min-height: 64px;
  margin-bottom: 32px;

  @media (max-width: 599px) {
    min-height: 56px;
  }

  @media (max-width: 360px) {
    min-height: 48px;
  }
`;

function Header() {
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
        <StyledIconButton onClick={handleDrawerToggle} aria-label="close drawer">
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
          <MobileNavButton key={item.text} as={Link} to={item.to} onClick={handleDrawerToggle}>
            {item.text}
          </MobileNavButton>
        ))}
      </StyledBox>
    </StyledBox>
  );

  return (
    <>
      <StyledAppBar scrolled={isScrolled ? 1 : 0}>
        <StyledContainer>
          <StyledToolbar>
            {isMobile && (
              <StyledIconButton
                aria-label="open drawer"
                onClick={handleDrawerToggle}
                ref={menuButtonRef}
              >
                <MenuIcon />
              </StyledIconButton>
            )}

            {!isMobile && (
              <StyledBox
                component="nav"
                aria-label="Main navigation"
                display="flex"
                alignItems="center"
              >
                {menuItems.map((item) => (
                  <NavButton
                    key={item.text}
                    as={Link}
                    to={item.to}
                    className={currentPath === item.to ? 'active' : ''}
                    aria-current={currentPath === item.to ? 'page' : undefined}
                  >
                    {item.text}
                  </NavButton>
                ))}
              </StyledBox>
            )}

            <StyledBox display="flex" alignItems="center" gap={2}>
              {!isMobile && <MyLogo />}
              <DarkModeToggle />
            </StyledBox>
          </StyledToolbar>
        </StyledContainer>
      </StyledAppBar>

      {mobileOpen && (
        <>
          <DrawerBackdrop open={mobileOpen} onClick={handleDrawerToggle} />
          <StyledDrawer open={mobileOpen}>{drawer}</StyledDrawer>
        </>
      )}

      {/* Toolbar spacer */}
      <ToolbarSpacer />
    </>
  );
}

export default Header;
