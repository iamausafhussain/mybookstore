import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './routers/router'
import { KBarWrapper } from "./components/command-bar";
import { Provider } from 'react-redux'
import { store } from './redux/store';
import { AuthProvide } from './context/AuthContext'
import { CustomSnackbarProvider } from './context/SnackbarContext';
import React from 'react';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CustomSnackbarProvider>
      <AuthProvide>
        <Provider store={store}>
          <KBarWrapper >
            <RouterProvider router={router} />
          </KBarWrapper>
        </Provider>
      </AuthProvide>
    </CustomSnackbarProvider>
  </React.StrictMode>
  ,
)
