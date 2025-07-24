import React, { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Box,
  useTheme as useMuiTheme,
  NoSsr,
} from '@mui/material';
import { Brightness4, Brightness7, SettingsBrightness, Computer } from '@mui/icons-material';
import { useTheme } from '../context/ThemeContext';

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
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                ml: 1,
                px: 1,
                py: 0.5,
                borderRadius: 20,
                border: `1px solid ${muiTheme.palette.divider}`,
                fontSize: '0.75rem',
                color: muiTheme.palette.text.secondary,
              }}
            >
              <Computer sx={{ fontSize: 16, mr: 0.5 }} />
              Auto
            </Box>
          </Tooltip>
        )}

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
      </Box>
    </NoSsr>
  );
}

export default DarkModeToggle;
