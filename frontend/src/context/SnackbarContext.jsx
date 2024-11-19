import React, { createContext, useContext } from 'react';
import { SnackbarProvider as NotistackProvider, useSnackbar as useNotistackSnackbar } from 'notistack';

// Create context for custom hook (optional, just for consistency)
const SnackbarContext = createContext();

export const CustomSnackbarProvider = ({ children }) => {
  return (
    <NotistackProvider maxSnack={3}> {/* maxSnack controls the number of Snackbars shown at once */}
      {children}
    </NotistackProvider>
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
