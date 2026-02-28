// Empty module replacement for MUI imports during webpack build
// This prevents webpack from processing MUI files entirely

require('react');

// Empty component that renders nothing
const EmptyComponent = () => null;

// Empty hook that returns empty object
const emptyHook = () => ({});

// Empty function that returns empty object
const emptyFunction = () => ({});

// Comprehensive MUI exports replacement
const muiExports = {
  // Common components
  Typography: EmptyComponent,
  Button: EmptyComponent,
  IconButton: EmptyComponent,
  TextField: EmptyComponent,
  Paper: EmptyComponent,
  Box: EmptyComponent,
  Container: EmptyComponent,
  Grid: EmptyComponent,
  Stack: EmptyComponent,
  Divider: EmptyComponent,
  Card: EmptyComponent,
  CardContent: EmptyComponent,
  CardActions: EmptyComponent,
  AppBar: EmptyComponent,
  Toolbar: EmptyComponent,
  Drawer: EmptyComponent,
  List: EmptyComponent,
  ListItem: EmptyComponent,
  ListItemText: EmptyComponent,
  Dialog: EmptyComponent,
  DialogTitle: EmptyComponent,
  DialogContent: EmptyComponent,
  DialogActions: EmptyComponent,
  Snackbar: EmptyComponent,
  Alert: EmptyComponent,
  Chip: EmptyComponent,
  Avatar: EmptyComponent,
  Badge: EmptyComponent,
  Tooltip: EmptyComponent,
  Menu: EmptyComponent,
  MenuItem: EmptyComponent,
  Select: EmptyComponent,
  FormControl: EmptyComponent,
  InputLabel: EmptyComponent,
  Checkbox: EmptyComponent,
  Radio: EmptyComponent,
  Switch: EmptyComponent,
  Slider: EmptyComponent,
  Tab: EmptyComponent,
  Tabs: EmptyComponent,
  Accordion: EmptyComponent,
  AccordionSummary: EmptyComponent,
  AccordionDetails: EmptyComponent,
  Stepper: EmptyComponent,
  Step: EmptyComponent,
  StepLabel: EmptyComponent,
  NoSsr: ({ children }) => children || null,
  Fade: ({ children }) => children || null,
  Grow: ({ children }) => children || null,
  Slide: ({ children }) => children || null,
  Zoom: ({ children }) => children || null,
  Collapse: ({ children }) => children || null,
  CssBaseline: EmptyComponent,

  // Styling and theming
  createTheme: emptyFunction,
  ThemeProvider: ({ children }) => children || null,
  useTheme: emptyHook,
  styled: () => EmptyComponent,
  StyledEngineProvider: ({ children }) => children || null,

  // Icons (common ones)
  Add: EmptyComponent,
  Remove: EmptyComponent,
  Edit: EmptyComponent,
  Delete: EmptyComponent,
  Search: EmptyComponent,
  Close: EmptyComponent,
  MenuIcon: EmptyComponent,
  Home: EmptyComponent,
  Settings: EmptyComponent,
  Info: EmptyComponent,
  Warning: EmptyComponent,
  Error: EmptyComponent,
  Check: EmptyComponent,
  Clear: EmptyComponent,
  ArrowBack: EmptyComponent,
  ArrowForward: EmptyComponent,
  ArrowUpward: EmptyComponent,
  ArrowDownward: EmptyComponent,
  ExpandMore: EmptyComponent,
  ExpandLess: EmptyComponent,
  ChevronLeft: EmptyComponent,
  ChevronRight: EmptyComponent,
  Favorite: EmptyComponent,
  Share: EmptyComponent,
  MoreVert: EmptyComponent,
  MoreHoriz: EmptyComponent,
  Email: EmptyComponent,
  Phone: EmptyComponent,
  GitHub: EmptyComponent,
  Send: EmptyComponent,
  Launch: EmptyComponent,
  Code: EmptyComponent,
  Coffee: EmptyComponent,
  Pets: EmptyComponent,
  Computer: EmptyComponent,
  Brightness4: EmptyComponent,
  Brightness7: EmptyComponent,
  SettingsBrightness: EmptyComponent,
  ContentCopy: EmptyComponent,
  CheckCircle: EmptyComponent,
  LightbulbOutlined: EmptyComponent,

  // System utilities
  alpha: emptyFunction,
  lighten: emptyFunction,
  darken: emptyFunction,
  emphasize: emptyFunction,
  getContrastRatio: emptyFunction,
  decomposeColor: emptyFunction,
  recomposeColor: emptyFunction,
  getLuminance: emptyFunction,
};

// Export as both default and named exports
module.exports = muiExports;
module.exports.default = muiExports;

// Individual exports for specific imports
Object.keys(muiExports).forEach((key) => {
  module.exports[key] = muiExports[key];
});
