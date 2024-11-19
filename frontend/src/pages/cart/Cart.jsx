import React from 'react'
import { Navbar } from '../../components/layout'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getImageUrl } from '../../utils/getImageUrl'
import { clearCart, removeFromCart } from '../../redux/features/cart/cartSlice'
import { Button } from '@headlessui/react'

const Cart = () => {

    const cartItems = useSelector((state) => state.cart.cartItems)
    const dispatch = useDispatch();

    const totalPrice = cartItems.reduce((acc, item) => acc + item.newPrice, 0).toFixed(2);

    const handleClearCart = () => {
        dispatch(clearCart())
    }

    const handleRemoveItem = (item) => {
        dispatch(removeFromCart(item))
    }

    return (
        <>
            <div className="flex mt-12 h-full flex-col overflow-hidden bg-white shadow-xl font-poppins">
                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                    <div className="flex items-start justify-between">
                        <div className="text-lg font-medium text-gray-900">Shopping cart</div>
                        <div className="ml-3 flex h-7 items-center ">
                            <Button
                                onClick={handleClearCart}
                                className="rounded bg-indigo-600 hover:bg-indigo-700 py-2 px-4 text-sm text-white flex items-center justify-center gap-1"
                            >
                                <span className="">Clear Cart</span>
                            </Button>
                        </div>
                    </div>

                    <div className="mt-8">
                        <div className="flow-root">

                            {
                                cartItems.length > 0 ?
                                    cartItems.map((item, index) => (

                                        <ul role="list" className="-my-6 divide-y divide-gray-200" key={index}>
                                            <li className="flex py-6">
                                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                    <img
                                                        alt=""
                                                        src={`${getImageUrl(item.coverImage)}`}
                                                        className="h-full w-full object-cover object-center"
                                                    />
                                                </div>

                                                <div className="ml-4 flex flex-1 flex-col">
                                                    <div>
                                                        <div className="flex flex-wrap justify-between text-base font-medium text-gray-900">
                                                            <h3>
                                                                <Link to={`books/${item._id}`}>{item.title}</Link>
                                                            </h3>
                                                            <p className="sm:ml-4"> ${item.newPrice}</p>
                                                        </div>
                                                        <p className="mt-1 text-sm text-gray-500 capitalize"><strong>Category:</strong> {item.category} </p>
                                                    </div>
                                                    <div className="flex flex-1 flex-wrap items-end justify-between space-y-2 text-sm">
                                                        <p className="text-gray-500"><strong>Qty:</strong> 1 </p>

                                                        <div className="flex">
                                                            <button onClick={() => handleRemoveItem(item)} type="button" className="font-medium text-indigo-600 hover:text-indigo-500">
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>

                                    )) :
                                    (<>
                                        <p>No Books in your cart.</p>
                                        <Link to="/" className='text-gray-500'>Back to Home?</Link>
                                    </>)}

                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Subtotal</p>
                        <p>${totalPrice ? totalPrice : 0}</p>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                    {
                        totalPrice != 0 &&
                        <div className="mt-6">
                        <Link
                            to="/checkout"
                            className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                        >
                            Checkout
                        </Link>
                    </div>
                    }
                    
                    <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                        <Link to="/">
                            or
                            <button
                                type="button"

                                className="font-medium text-indigo-600 hover:text-indigo-500 ml-1"
                            >
                                Continue Shopping
                                <span aria-hidden="true"> &rarr;</span>
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Cart