import React from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import ConfigManager from './components/ConfigManager/ConfigManager';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ height: '100vh', overflow: 'auto' }}>
        <ConfigManager />
      </div>
    </ThemeProvider>
  );
}

export default App;
