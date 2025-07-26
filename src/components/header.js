import { Link } from 'gatsby';
import { useLocation } from '@gatsbyjs/reach-router';
import React, { useState, useEffect, useRef } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Drawer,
  useTheme,
  useMediaQuery,
  Box,
  Container,
  NoSsr,
} from '@mui/material';
import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

import MyLogo from './myLogo';
import DarkModeToggle from './DarkModeToggle';

const getAppBarBackground = (theme, scrolled) => {
  if (!scrolled) return 'transparent';
  return theme.palette.mode === 'dark' ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)';
};

const StyledAppBar = styled(AppBar)(({ theme, scrolled }) => ({
  background: getAppBarBackground(theme, scrolled),
  backdropFilter: scrolled ? 'blur(20px)' : 'none',
  boxShadow: scrolled ? theme.shadows[4] : 'none',
  transition: theme.transitions.create(['background', 'backdrop-filter', 'box-shadow'], {
    duration: theme.transitions.duration.standard,
  }),
}));

const NavButton = styled(Button)(({ theme }) => ({
  borderRadius: 20,
  padding: '8px 24px',
  marginLeft: theme.spacing(1),
  marginRight: theme.spacing(1),
  textTransform: 'none',
  fontSize: '1rem',
  fontWeight: 500,
  transition: theme.transitions.create(['background-color', 'transform', 'box-shadow'], {
    duration: theme.transitions.duration.short,
  }),
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[2],
  },
  '&.active': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    boxShadow: theme.shadows[4],
  },
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: '80%',
    maxWidth: 300,
    backgroundColor: theme.palette.background.paper,
    backgroundImage:
      theme.palette.mode === 'dark'
        ? 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))'
        : 'none',
  },
}));

function Header() {
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuButtonRef = useRef(null);

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
    <Box sx={{ textAlign: 'center' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
        <IconButton onClick={handleDrawerToggle} aria-label="close drawer">
          <CloseIcon />
        </IconButton>
      </Box>
      <Box
        component="nav"
        role="navigation"
        aria-label="Mobile navigation"
        sx={{ display: 'flex', flexDirection: 'column', p: 2 }}
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
      </Box>
    </Box>
  );

  return (
    <>
      <StyledAppBar
        position="fixed"
        scrolled={isScrolled ? 1 : 0}
        elevation={0}
        component="header"
        role="banner"
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: 'space-between', padding: { xs: 1, sm: 2 } }}>
            {isMobile && (
              <IconButton
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                ref={menuButtonRef}
                sx={{
                  color:
                    theme.palette.mode === 'dark'
                      ? theme.palette.text.primary
                      : theme.palette.text.primary,
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
            )}

            {!isMobile && (
              <Box
                component="nav"
                role="navigation"
                aria-label="Main navigation"
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                {menuItems.map((item) => (
                  <NavButton
                    key={item.text}
                    component={Link}
                    to={item.to}
                    className={location.pathname === item.to ? 'active' : ''}
                    aria-current={location.pathname === item.to ? 'page' : undefined}
                  >
                    {item.text}
                  </NavButton>
                ))}
              </Box>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {!isMobile && <MyLogo />}
              <DarkModeToggle />
            </Box>
          </Toolbar>
        </Container>
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
