import {
    createBrowserRouter
} from "react-router-dom";
import App from '../App.jsx';

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <h1>Home Component</h1>
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
]);

export default router;