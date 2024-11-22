import React, { createContext, useContext } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { SnackbarProvider as NotistackProvider, useSnackbar as useNotistackSnackbar } from 'notistack';

// Create context for custom hook (optional, just for consistency)
const SnackbarContext = createContext();

const customTheme = createTheme({
  typography: {
    fontFamily: '"Inter", sans-serif',
    body1: {
      fontFamily: '"Inter", sans-serif',
    },
  },
});

export const CustomSnackbarProvider = ({ children }) => {
  return (
    <ThemeProvider theme={customTheme}>
      <NotistackProvider maxSnack={3}> {/* maxSnack controls the number of Snackbars shown at once */}
        {children}
      </NotistackProvider>
    </ThemeProvider>
  );
};

// Custom hook that wraps `notistack`'s `useSnackbar`
export const useSnackbar = () => {
  const { enqueueSnackbar } = useNotistackSnackbar();

  const showSnackbar = (message, severity = 'info') => {
    enqueueSnackbar(message, { variant: severity });
  };

  return showSnackbar;
};
