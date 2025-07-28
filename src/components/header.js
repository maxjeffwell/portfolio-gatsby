import { Link } from 'gatsby';
import React, { useState, useEffect, useRef } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Drawer,
  useTheme,
  useMediaQuery,
  NoSsr,
} from '@mui/material';
import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material';
import styled from '@emotion/styled';

import MyLogo from './myLogo';
import DarkModeToggle from './DarkModeToggle';

const getAppBarBackground = (theme, scrolled) => {
  if (!scrolled) return 'transparent';
  if (!theme || !theme.palette) return 'rgba(255, 255, 255, 0.95)';
  return theme.palette.mode === 'dark' ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)';
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
  display: ${props => props.display || 'block'};
  justify-content: ${props => props.justifyContent || 'flex-start'};
  flex-direction: ${props => props.flexDirection || 'row'};
  align-items: ${props => props.alignItems || 'stretch'};
  gap: ${props => props.gap ? `${props.gap * 8}px` : '0'};
  padding: ${props => props.p ? `${props.p * 8}px` : '0'};
  text-align: ${props => props.textAlign || 'inherit'};
`;

const StyledAppBar = styled(AppBar)`
  background: ${props => getAppBarBackground(props.theme, props.scrolled)};
  backdrop-filter: ${props => props.scrolled ? 'blur(20px)' : 'none'};
  box-shadow: ${props => props.scrolled ? '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)' : 'none'};
  transition: background 250ms cubic-bezier(0.4, 0, 0.2, 1), backdrop-filter 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1);
`;

const NavButton = styled(Button)`
  border-radius: 20px;
  padding: 8px 24px;
  margin-left: 8px;
  margin-right: 8px;
  text-transform: none;
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), transform 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12);
  }
  
  &.active {
    background-color: #fc4a1a;
    color: white;
    box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);
  }
`;

const StyledDrawer = styled(Drawer)`
  & .MuiDrawer-paper {
    width: 80%;
    max-width: 300px;
    background-color: white;
    
    @media (prefers-color-scheme: dark) {
      background-color: #1e1e1e;
      background-image: linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05));
    }
    
    @media (max-width: 360px) {
      width: 85%;
      max-width: 280px;
    }
  }
`;

function Header() {
  const [currentPath, setCurrentPath] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(true); // Default to mobile for SSR
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
  }, []);

  // Safe theme access
  let safeTheme;
  try {
    safeTheme = useTheme();
  } catch (error) {
    // Fallback theme for SSR
    safeTheme = {
      palette: {
        mode: 'light',
        text: { primary: '#000' },
        action: { hover: 'rgba(0, 0, 0, 0.04)' }
      },
      breakpoints: {
        down: () => '(max-width: 959px)'
      }
    };
  }

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
        menuButtonRef.current.focus();
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
        <IconButton onClick={handleDrawerToggle} aria-label="close drawer">
          <CloseIcon />
        </IconButton>
      </StyledBox>
      <StyledBox
        component="nav"
        role="navigation"
        aria-label="Mobile navigation"
        display="flex"
        flexDirection="column"
        p={2}
      >
        {menuItems.map((item) => (
          <Button
            key={item.text}
            component={Link}
            to={item.to}
            fullWidth
            sx={{
              py: 2,
              fontSize: '1.25rem',
              textTransform: 'none',
              color: 'text.primary',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            {item.text}
          </Button>
        ))}
      </StyledBox>
    </StyledBox>
  );

  return (
    <>
      <StyledAppBar
        position="fixed"
        scrolled={isScrolled ? 1 : 0}
        elevation={0}
        component="header"
        role="banner"
        theme={safeTheme}
      >
        <StyledContainer>
          <Toolbar sx={{ 
            justifyContent: 'space-between', 
            padding: { xs: 1, sm: 2 },
            '@media (max-width: 360px)': {
              padding: '0.5rem 0.75rem',
              minHeight: 48,
            },
          }}>
            <NoSsr fallback={<div style={{ width: 48, height: 48 }} />}>
              {isMobile && (
                <IconButton
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  ref={menuButtonRef}
                  sx={{
                    color: safeTheme.palette.text.primary,
                    '&:hover': {
                      backgroundColor: safeTheme.palette.action.hover,
                    },
                  }}
                >
                  <MenuIcon />
                </IconButton>
              )}
            </NoSsr>

            <NoSsr fallback={<div style={{ flex: 1 }} />}>
              {!isMobile && (
                <StyledBox
                  component="nav"
                  role="navigation"
                  aria-label="Main navigation"
                  display="flex"
                  alignItems="center"
                >
                  {menuItems.map((item) => (
                    <NavButton
                      key={item.text}
                      component={Link}
                      to={item.to}
                      className={currentPath === item.to ? 'active' : ''}
                      aria-current={currentPath === item.to ? 'page' : undefined}
                    >
                      {item.text}
                    </NavButton>
                  ))}
                </StyledBox>
              )}
            </NoSsr>

            <StyledBox display="flex" alignItems="center" gap={2}>
              <NoSsr>
                {!isMobile && <MyLogo />}
              </NoSsr>
              <DarkModeToggle />
            </StyledBox>
          </Toolbar>
        </StyledContainer>
      </StyledAppBar>

      <NoSsr>
        <StyledDrawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {drawer}
        </StyledDrawer>
      </NoSsr>

      {/* Toolbar spacer */}
      <Toolbar sx={{ mb: 4 }} />
    </>
  );
}

export default Header;
