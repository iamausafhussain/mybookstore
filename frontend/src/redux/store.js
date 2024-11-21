import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './features/cart/cartSlice'
import booksApi from './features/book/bookSlice'
import ordersApi from './features/orders/orderSlice'
import usersApi from './features/users/userSlice'
import stripeApi from './features/stripe/stripeSlice'

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    [booksApi.reducerPath]: booksApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [stripeApi.reducerPath]: stripeApi.reducer
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      booksApi.middleware,
      ordersApi.middleware,
      usersApi.middleware,
      stripeApi.middleware
    ),
})