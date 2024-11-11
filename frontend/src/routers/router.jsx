import {
    createBrowserRouter
} from "react-router-dom";
import App from '../App.jsx';
import Home from "../pages/home/Home.jsx";
import Login from "../pages/login/Login.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <Home />
            },
            { 
                path: "/orders",
                element: <div>Orders Component</div>
            },
            {
                path: "/about",
                element: <div>About</div>
            }
        ]
    },
    {
        path: "/login",
        element: <Login />
    }
]);

export default router;