import React, { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  useTheme as useMuiTheme,
  NoSsr,
} from '@mui/material';
import { Brightness4, Brightness7, SettingsBrightness, Computer } from '@mui/icons-material';
import styled from '@emotion/styled';
import { useTheme } from '../context/ThemeContext';

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
`;

const SystemIndicator = styled.div`
  display: flex;
  align-items: center;
  margin-left: 8px;
  padding: 4px 8px;
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  font-size: 0.75rem;
  color: rgba(0, 0, 0, 0.6);
  
  @media (max-width: 960px) {
    display: none;
  }
  
  @media (prefers-color-scheme: dark) {
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: rgba(255, 255, 255, 0.7);
  }
`;

function DarkModeToggle() {
  const { isDarkMode, isSystemPreference, toggleTheme, resetToSystemPreference } = useTheme();
  const muiTheme = useMuiTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    if (isSystemPreference) {
      setAnchorEl(event.currentTarget);
    } else {
      toggleTheme();
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleToggleMode = () => {
    toggleTheme();
    handleClose();
  };

  const handleSystemReset = () => {
    resetToSystemPreference();
    handleClose();
  };

  return (
    <NoSsr>
      <StyledContainer>
        <Tooltip title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}>
          <IconButton
            onClick={handleClick}
            color="inherit"
            sx={{
              background: muiTheme.palette.action.hover,
              border: `2px solid ${muiTheme.palette.divider}`,
              '&:hover': {
                borderColor: muiTheme.palette.primary.main,
                transform: 'scale(1.05)',
                boxShadow: muiTheme.shadows[4],
              },
            }}
          >
            {isDarkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Tooltip>

        {isSystemPreference && (
          <Tooltip title="Currently following system preference">
            <SystemIndicator>
              <Computer style={{ fontSize: 16, marginRight: 4 }} />
              Auto
            </SystemIndicator>
          </Tooltip>
        )}

        <NoSsr>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
          <MenuItem onClick={handleToggleMode}>
            <ListItemIcon>{isDarkMode ? <Brightness7 /> : <Brightness4 />}</ListItemIcon>
            <ListItemText>Switch to {isDarkMode ? 'light' : 'dark'} mode</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleSystemReset}>
            <ListItemIcon>
              <SettingsBrightness />
            </ListItemIcon>
            <ListItemText>Follow system preference</ListItemText>
          </MenuItem>
        </Menu>
        </NoSsr>
      </StyledContainer>
    </NoSsr>
  );
}

export default DarkModeToggle;
