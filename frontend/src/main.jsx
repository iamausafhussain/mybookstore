import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './routers/router'
import { KBarWrapper } from "./components/command-bar";
import { Provider } from 'react-redux'
import { store } from './redux/store';

createRoot(document.getElementById('root')).render(

  <Provider store={store}>
    <KBarWrapper >
      <RouterProvider router={router} />
    </KBarWrapper>
  </Provider>,
)
