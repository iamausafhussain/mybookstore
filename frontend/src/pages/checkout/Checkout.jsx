import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@headlessui/react'
import { useAuth } from '../../context/AuthContext'
import { useAddOrderMutation } from '../../redux/features/orders/orderSlice'
import { useSnackbar } from '../../context/SnackbarContext'
import { clearCart } from '../../redux/features/cart/cartSlice'
import { loadStripe } from '@stripe/stripe-js';
import { useCreateCheckoutSessionMutation } from '../../redux/features/stripe/stripeSlice'


const Checkout = () => {
    const { currentUser } = useAuth();
    const [addOrder, { isLoading, error }] = useAddOrderMutation();
    const [createCheckoutSession] = useCreateCheckoutSessionMutation();
    const navigate = useNavigate();
    const showSnackbar = useSnackbar();
    const dispatch = useDispatch();


    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState(currentUser?.email);
    const [phone, setPhone] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [isChecked, setIsChecked] = useState(false);


    const cartItems = useSelector((state) => state.cart.cartItems);
    const totalPrice = cartItems.reduce((acc, item) => acc + item.newPrice, 0).toFixed(2);

    const handleSubmit = async () => {
        const stripe = await loadStripe("pk_test_51QKsYhSFcvNtMUOMN3euS4bvZ9gsLHv0j0T7cwrfF3kNa1g8lB1eck72F3LEq8EL0WhCboWLPxhVofbNyXPqsDNL009wRkGYFZ");
        const bookItems = cartItems.map(book => ({
            "_id": book._id,
            "description": book.description,
            "title": book.title,
            "newPrice": book.newPrice,
            "qnty": 1
        }));

        const body = JSON.stringify({ products: bookItems, customer_email: currentUser.email })
        const headers = { "Content-Type": "application/json" }

        const newOrder = {
            name: fullName,
            email: email,
            address: {
                street: street,
                city: city,
                country: country,
                state: state,
                zipCode: zipCode
            },
            phone: phone,
            productsIds: cartItems.map(item => item?._id),
            totalPrice: totalPrice
        }
        try {
            // const response = await fetch("http://localhost:3000/api/stripe/create-checkout-session", {
            //     method: "POST",
            //     headers: headers,
            //     body: body
            // });

            await createCheckoutSession(body).unwrap().then((res) => {
                console.log('stripe response: ', res.id)
                localStorage.setItem('stripe response', res.id)
                const session = res.id;

                const result = stripe.redirectToCheckout({
                    sessionId: session
                });

                console.log(result)

                if (result.error) {
                    console.log(result.error);
                }

            });

            // await addOrder(newOrder).unwrap();
            // // showSnackbar('Order placed successfully!', 'success')
            // dispatch(clearCart())
            // navigate('/')
        } catch (error) {
            console.log(error)
            showSnackbar(`Error ${error}`, 'error')
        }
    }

    return (
        <section>
            <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
                <div className="container max-w-screen-lg mx-auto">
                    <div>
                        <div>
                            <h2 className="font-semibold text-xl text-gray-600 mb-2">Cash On Delivery</h2>
                            <p className="text-gray-500 mb-2">Total Price: ${totalPrice}</p>
                            <p className="text-gray-500 mb-6">Items: {cartItems.length > 0 ? cartItems.length : 0}</p>
                        </div>


                        <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
                            <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3 my-8">
                                <div className="text-gray-600">
                                    <p className="font-medium text-lg">Personal Details</p>
                                    <p>Please fill out all the fields.</p>
                                </div>

                                <div className="lg:col-span-2">
                                    <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                                        <div className="md:col-span-5">
                                            <label htmlFor="full_name">Full Name</label>
                                            <input
                                                type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} name="name" id="name" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" />
                                        </div>

                                        <div className="md:col-span-5">
                                            <label htmlFor="email">Email Address</label>
                                            <input
                                                value={email} onChange={(e) => setEmail(e.target.value)}
                                                type="text" name="email" id="email" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                                                disabled
                                                placeholder="email@domain.com" />
                                        </div>

                                        <div className="md:col-span-5">
                                            <label htmlFor="phone">Phone Number</label>
                                            <input
                                                value={phone} onChange={(e) => setPhone(e.target.value)}
                                                type="number" name="phone" id="phone" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="+123 456 7890" />
                                        </div>

                                        <div className="md:col-span-3">
                                            <label htmlFor="address">Address / Street</label>
                                            <input
                                                value={street} onChange={(e) => setStreet(e.target.value)}
                                                type="text" name="address" id="address" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="" />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label htmlFor="city">City</label>
                                            <input
                                                value={city} onChange={(e) => setCity(e.target.value)}
                                                type="text" name="city" id="city" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="" />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label htmlFor="country">Country / region</label>
                                            <div className="h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
                                                <input
                                                    value={country} onChange={(e) => setCountry(e.target.value)}
                                                    name="country" id="country" placeholder="Country" className="px-4 appearance-none outline-none text-gray-800 w-full bg-transparent" />
                                                <button tabIndex="-1" className="cursor-pointer outline-none focus:outline-none transition-all text-gray-300 hover:text-red-600">
                                                    <svg className="w-4 h-4 mx-2 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                                    </svg>
                                                </button>
                                                <button tabIndex="-1" className="cursor-pointer outline-none focus:outline-none border-l border-gray-200 transition-all text-gray-300 hover:text-blue-600">
                                                    <svg className="w-4 h-4 mx-2 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label htmlFor="state">State / province</label>
                                            <div className="h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
                                                <input
                                                    value={state} onChange={(e) => setState(e.target.value)}
                                                    name="state" id="state" placeholder="State" className="px-4 appearance-none outline-none text-gray-800 w-full bg-transparent" />
                                                <button className="cursor-pointer outline-none focus:outline-none transition-all text-gray-300 hover:text-red-600">
                                                    <svg className="w-4 h-4 mx-2 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                                    </svg>
                                                </button>
                                                <button tabIndex="-1" className="cursor-pointer outline-none focus:outline-none border-l border-gray-200 transition-all text-gray-300 hover:text-blue-600">
                                                    <svg className="w-4 h-4 mx-2 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="md:col-span-1">
                                            <label htmlFor="zipcode">Zipcode</label>
                                            <input
                                                value={zipCode} onChange={(e) => setZipCode(e.target.value)}
                                                type="text" name="zipcode" id="zipcode" className="transition-all flex items-center h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="" />
                                        </div>

                                        <div className="md:col-span-5 mt-3">
                                            <div className="inline-flex items-center">
                                                <input
                                                    onChange={(e) => setIsChecked(e.target.checked)}
                                                    type="checkbox" name="billing_same" id="billing_same" className="form-checkbox" />
                                                <label htmlFor="billing_same" className="ml-2 ">I agree to the <Link className='underline underline-offset-2 text-blue-600'>Terms & Conditions</Link> and <Link className='underline underline-offset-2 text-blue-600'>Shoping Policy.</Link></label>
                                            </div>
                                        </div>



                                        <div className="md:col-span-5 text-right">
                                            <div className="inline-flex items-end">
                                                <Button
                                                    onClick={() => handleSubmit()}
                                                    disabled={isChecked == false || cartItems.length == 0}
                                                    className="rounded bg-[#4D47C3] hover:bg-[#3833a0] py-2 px-4 text-sm text-white">
                                                    Proceed to Payment
                                                </Button>

                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>



                    </div>


                </div>
            </div>
        </section>
    )
}

export default Checkout