import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark', // Dark mode is the default
    primary: {
      main: '#90caf9', // Lighter blue for dark mode (MUI default)
    },
    secondary: {
      main: '#ce93d8', // Lighter purple for dark mode
    },
    background: {
      default: '#121212', // Material Design standard dark grey
      paper: '#1e1e1e',   // Slightly lighter for cards/modals to show elevation
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
});
