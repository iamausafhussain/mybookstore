import {
    createBrowserRouter
} from "react-router-dom";
import App from '../App.jsx';
import Home from "../pages/home/Home.jsx";
import Login from "../pages/login/Login.jsx";
import Signup from "../pages/signup/Signup.jsx";
import Cart from "../pages/cart/Cart.jsx";
import Checkout from "../pages/checkout/Checkout.jsx";
import SingleBook from "../pages/books/SingleBook.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import OrderHistory from "../pages/orders/OrderHistory.jsx";
import OrderHistoryReceipt from "../pages/orders/OrderHistoryReceipt.jsx";

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
                path: "/order_history",
                element: <OrderHistory />
            },
            {
                path: "/about",
                element: <div>About</div>
            },
            {
                path: "/cart",
                element: <Cart />
            },
            {
                path: "/checkout",
                element: <PrivateRoute>
                    <Checkout />
                </PrivateRoute>
            },
            {
                path: "/books/:id",
                element: <SingleBook />
            }

        ]
    },
    {
        path: "/order_history/:session_id",
        element: <OrderHistoryReceipt />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/signup",
        element: <Signup />
    }
]);

export default router;