import { createSlice } from '@reduxjs/toolkit'
import { useSnackbar } from '../../../context/SnackbarContext'

const initialState = {
    cartItems: [],
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const existingItem = state.cartItems.find((item) => item._id === action.payload._id)

            if (!existingItem) {
                state.cartItems.push(action.payload)
            }
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter((item) => item._id !== action.payload._id);
        },
        clearCart: (state) => {
            state.cartItems = []
        }
    }
})

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;