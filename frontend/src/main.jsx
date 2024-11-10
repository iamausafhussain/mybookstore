import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './routers/router'
import { KBarWrapper } from "./components/command-bar";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <KBarWrapper >
      <RouterProvider router={router} />
    </KBarWrapper>
  </StrictMode>,
)
