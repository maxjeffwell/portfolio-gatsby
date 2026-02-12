import { Link } from 'gatsby';
import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import styled from 'styled-components';

import MyLogo from './myLogo';
import SSRSafeDarkModeToggle from './SSRSafeDarkModeToggle';
import ClientOnlyIcon from './ClientOnlyIcon';

const DocSearch = lazy(() =>
  import('@docsearch/react').then((mod) => ({ default: mod.DocSearch }))
);

// Simple icon components using Unicode symbols

const CloseIcon = styled.span`
  font-size: 24px;
  &::before {
    content: '✕';
  }
`;

const StyledContainer = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 24px;
  box-sizing: border-box;

  @media (max-width: 600px) {
    padding: 0 16px;
  }

  @media (max-width: 360px) {
    padding: 0 12px;
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
  background: var(--paper-color);
  color: var(--text-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const StyledToolbar = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
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
  color: var(--text-color);
  background-color: var(--nav-bg);
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1;
  border-radius: 10px;
  text-transform: none;
  transition: background-color 0.2s ease;

  &:link,
  &:visited {
    color: var(--text-color);
    text-decoration: none;
  }

  &:hover {
    background-color: var(--nav-hover-bg);
  }

  &.active {
    background-color: var(--primary-color);
    color: var(--nav-active-text);
  }

  &.active:link,
  &.active:visited {
    color: var(--nav-active-text);
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

const SecondaryNavBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  padding: 6px 16px;
  background: var(--secondary-nav-bg);
  border-top: 1px solid var(--secondary-nav-border);

  @media (max-width: 959px) {
    display: none;
  }
`;

const SecondaryNavLink = styled.a`
  display: inline-flex;
  align-items: center;
  padding: 6px 16px;
  text-decoration: none;
  color: var(--text-color);
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 500;
  border-radius: 6px;
  transition: background-color 0.2s ease;
  opacity: 0.75;

  &:link,
  &:visited {
    color: var(--text-color);
    text-decoration: none;
  }

  &:hover {
    background-color: var(--hover-bg);
    opacity: 1;
  }
`;

const StyledIconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 50%;
  border: none;
  background-color: transparent;
  color: var(--text-color);
  cursor: pointer;
  font-size: 1.5rem;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }

  &:focus {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }

  &:active {
    transform: scale(0.95);
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
  background-color: var(--paper-color);
  color: var(--text-color);
  box-shadow:
    0px 8px 10px -5px rgba(0, 0, 0, 0.2),
    0px 16px 24px 2px rgba(0, 0, 0, 0.14),
    0px 6px 30px 5px rgba(0, 0, 0, 0.12);
  transform: ${(props) => (props.open ? 'translateX(0)' : 'translateX(-100%)')};
  transition: transform 225ms cubic-bezier(0, 0, 0.2, 1);

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
  color: var(--text-color);
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: 1.4rem;
  font-weight: 500;
  text-align: center;
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1);

  &:link,
  &:visited {
    color: var(--text-color);
    text-decoration: none;
  }

  &:hover {
    background-color: var(--hover-bg);
  }
`;

const MobileNavDivider = styled.div`
  height: 1px;
  margin: 8px 16px;
  background: var(--divider-subtle);
`;

const MobileNavLabel = styled.div`
  padding: 12px 18px 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--mobile-nav-label);
`;

const MobileOnly = styled.div`
  display: none;

  @media (max-width: 959px) {
    display: flex;
    align-items: center;
  }
`;

const DesktopOnly = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 959px) {
    display: none;
  }
`;

const ToolbarSpacer = styled.div`
  min-height: 116px;

  @media (max-width: 959px) {
    min-height: 64px;
  }
`;

function Header() {
  const [currentPath, setCurrentPath] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuButtonRef = useRef(null);

  // Set current path client-side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

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

  const primaryItems = [
    { text: 'Home', to: '/' },
    { text: 'Bio', to: '/about' },
    { text: 'Projects', to: '/projects' },
    { text: 'Blog', to: '/blog' },
    { text: 'Contact', to: '/contact' },
  ];

  const secondaryItems = [
    { text: 'Live Cluster', to: '/cluster/' },
    { text: 'Storybook', to: '/storybook/' },
    { text: 'Infrastructure', to: '/docs/' },
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
        {primaryItems.map((item) => (
          <MobileNavButton key={item.text} as={Link} to={item.to} onClick={handleDrawerToggle}>
            {item.text}
          </MobileNavButton>
        ))}
        <MobileNavDivider />
        <MobileNavLabel>Tools</MobileNavLabel>
        {secondaryItems.map((item) => {
          const isGatsbyPage = !item.to.startsWith('/storybook') && !item.to.startsWith('/docs');
          return (
            <MobileNavButton
              key={item.text}
              {...(isGatsbyPage ? { as: Link, to: item.to } : { href: item.to })}
              onClick={handleDrawerToggle}
            >
              {item.text}
            </MobileNavButton>
          );
        })}
      </StyledBox>
    </StyledBox>
  );

  return (
    <>
      <StyledAppBar scrolled={isScrolled ? 1 : 0}>
        <StyledContainer>
          <StyledToolbar>
            {/* Left section: Menu/Navigation */}
            <StyledBox display="flex" alignItems="center">
              <MobileOnly>
                <StyledIconButton
                  aria-label="open drawer"
                  onClick={handleDrawerToggle}
                  ref={menuButtonRef}
                  style={{ opacity: 1, pointerEvents: 'auto' }}
                >
                  <ClientOnlyIcon
                    iconName="Burger"
                    fontSize="32px"
                    style={{
                      color: 'var(--primary-color)',
                    }}
                  />
                </StyledIconButton>
              </MobileOnly>

              <DesktopOnly as="nav" aria-label="Main navigation">
                {primaryItems.map((item) => (
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
              </DesktopOnly>
            </StyledBox>

            {/* Center section: Search */}
            <StyledBox display="flex" alignItems="center" justifyContent="center">
              <Suspense fallback={null}>
                <DocSearch
                  appId="E2O1YZJVJI"
                  indexName="el-jefe-me"
                  apiKey="e036cac75dbca995c2c61173f72c05e2"
                  askAi={{
                    assistantId: 'g2MyPVDcN5aX',
                    indexName: 'el-jefe-me-askai',
                  }}
                />
              </Suspense>
            </StyledBox>

            {/* Right section: Logo and Dark mode toggle */}
            <StyledBox display="flex" alignItems="center" justifyContent="flex-end" gap={2}>
              <MyLogo />
              <SSRSafeDarkModeToggle />
            </StyledBox>
          </StyledToolbar>
          <SecondaryNavBar>
            {secondaryItems.map((item) => {
              const isGatsbyPage =
                !item.to.startsWith('/storybook') && !item.to.startsWith('/docs');
              return (
                <SecondaryNavLink
                  key={item.text}
                  {...(isGatsbyPage ? { as: Link, to: item.to } : { href: item.to })}
                >
                  {item.text}
                </SecondaryNavLink>
              );
            })}
          </SecondaryNavBar>
        </StyledContainer>
      </StyledAppBar>

      {mobileOpen && (
        <>
          <DrawerBackdrop open={mobileOpen} onClick={handleDrawerToggle} />
          <StyledDrawer open={mobileOpen}>{drawer}</StyledDrawer>
        </>
      )}
      <ToolbarSpacer />
    </>
  );
}

export default Header;
