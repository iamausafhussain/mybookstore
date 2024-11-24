import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useFetchSessionDetailsQuery } from '../../redux/features/stripe/stripeSlice';
import { useAddOrderMutation } from '../../redux/features/orders/orderSlice';
import { Navbar } from '../../components/layout';
import BookStoreLogoLight from '../../assets/BookStoreLogoLight.png';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useFetchBooksByProductIdMutation } from '../../redux/features/book/bookSlice';
import { Chip } from "@material-tailwind/react";
import { useRef } from "react";

const OrderHistoryReceipt = () => {
    const { session_id } = useParams();
    const [order, setOrder] = useState(null); // Initialize as null to avoid unnecessary triggers
    const [productsIds, setProductsIds] = useState([]);
    const [requestBody, setRequestBody] = useState(null);
    const [products, setProducts] = useState([]);
    const [addOrder] = useAddOrderMutation();
    const isOrderAddedRef = useRef(false); // Ref to track if the order has been added
    const { data: orderDetails, isLoading, isError } = useFetchSessionDetailsQuery(session_id, {
        skip: !session_id,
    });
    const [fetchBooksByProductId, { data: productsByEmail = [], isLoading: isProductsLoading, isError: isProductsError }] =
        useFetchBooksByProductIdMutation();

    useEffect(() => {
        if (orderDetails?.metadata?.product_ids) {
            try {
                const parsedIds = JSON.parse(orderDetails.metadata.product_ids);
                setProductsIds(parsedIds);
                setRequestBody({ productsIds: parsedIds });
            } catch (error) {
                console.error("Failed to parse product IDs:", error);
                setProductsIds([]);
            }
        }
    }, [orderDetails]);

    useEffect(() => {
        if (orderDetails && !isLoading && !isError) {
            const newOrder = {
                id: orderDetails.id,
                amount_subtotal: orderDetails.amount_subtotal / 100,
                amount_total: orderDetails.amount_total / 100,
                created: orderDetails.created,
                currency: orderDetails.currency,
                customer_details: {
                    address: { ...orderDetails.customer_details?.address },
                    email: orderDetails.customer_details?.email,
                    name: orderDetails.customer_details?.name,
                    phone: orderDetails.customer_details?.phone,
                    tax_exempt: orderDetails.customer_details?.tax_exempt,
                    tax_ids: orderDetails.customer_details?.tax_ids,
                },
                product_ids: orderDetails.metadata?.product_ids
                    ? JSON.parse(orderDetails.metadata.product_ids)
                    : [],
                mode: orderDetails.mode,
                payment_intent: orderDetails.payment_intent,
                payment_status: orderDetails.payment_status,
                shipping_cost: orderDetails.shipping_cost,
                shipping_details: {
                    address: { ...orderDetails.shipping_details?.address },
                    name: orderDetails.shipping_details?.name,
                },
                shipping_options: orderDetails.shipping_options || [],
                status: orderDetails.status,
            };

            setOrder(newOrder);
        }

        if (requestBody && productsIds.length > 0) {
            fetchBooksByProductId(requestBody)
                .unwrap()
                .then((res) => {
                    setProducts(res);
                })
                .catch((err) => {
                    console.error("Failed to fetch books:", err);
                });
        }
    }, [orderDetails, isLoading, isError, requestBody, productsIds, fetchBooksByProductId]);

    const handleAddOrder = () => {
        if (order && !isOrderAddedRef.current) {
            isOrderAddedRef.current = true; // Mark the order as added
            addOrder(order)
                .unwrap()
                .then((res) => {
                    console.log("Order added successfully: ", res);
                })
                .catch((err) => {
                    console.error("Failed to add order: ", err);
                    isOrderAddedRef.current = false; // Reset in case of failure
                });
        }
    };

    useEffect(() => {
        handleAddOrder(); // Call the function to add the order
    }, [order]); // Trigger only when `order` is updated

    if (isLoading || isProductsLoading) {
        return <div>Loading...</div>;
    }

    if (isError || isProductsError) {
        return <div>Error occurred while fetching data.</div>;
    }

    if (!orderDetails) {
        return <div>No order details found.</div>;
    }

    function ccyFormat(num) {
        return `${num.toFixed(2)}`;
    }

    function priceRow(unit) {
        return unit;
    }

    function createRow(desc, unit) {
        const price = priceRow(unit);
        return { desc, price };
    }

    console.log(orderDetails)

    products.map((item) => {
        createRow(item.title, item.newPrice)
    })

    const invoiceSubtotal = products.reduce((sum, row) => sum + row.newPrice, 0);

    return (
        <>
            <div className="relative z-50">
                <Navbar />

            </div>
            <div className="flex flex-col h-screen">
                <div className="bg-[#fe9900] flex-grow-[0.65]"></div>
                <div className="flex-grow"></div>

                {/* Receipt Modal */}
                <div className="w-full md:w-3/4 lg:w-1/2 xl:w-1/2 absolute top-15 md:top-1/4 left-1/2 transform -translate-x-1/2 bg-white lg:rounded-md md:rounded-md sm:rounded-none shadow-xl overflow-auto z-10">
                    {/* Header Section */}
                    <div className="hidden sm:hidden md:flex lg:flex flex-wrap justify-between items-center bg-[#f5f5f5] px-4 sm:px-8 py-4 sm:py-6">
                        <img
                            className="h-6 sm:h-8"
                            src={BookStoreLogoLight}
                            alt="company logo"
                        />

                        <div className="flex items-center mt-4 sm:mt-0">
                            <h4 className="text-sm text-[#808080] sm:text-base">Order No:</h4>
                            <h2 className="font-semibold ml-2 text-sm sm:text-lg">
                                #{orderDetails.created}
                            </h2>
                        </div>
                    </div>

                    {/* Order Confirmation */}
                    <div className="px-4 sm:px-8 py-4 sm:py-6 bg-white">
                        <h3 className="font-semibold text-lg sm:text-2xl">
                            Yay! Your Order Is Confirmed
                        </h3>
                        <h5 className="font-medium mt-2 sm:mt-4 text-sm sm:text-base">
                            Hi {orderDetails.customer_details?.name || 'Bibliophile'},
                        </h5>
                        <p className="font-normal mt-2 sm:mt-4 text-sm sm:text-base leading-relaxed">
                            Thank you for your order. We will send you a
                            confirmation when your order ships. Below is your
                            receipt.
                        </p>

                        {/* Order Details Table */}
                        <div className="mt-2">
                            <TableContainer>
                                <Table
                                    sx={{
                                        '@media (max-width:600px)': {
                                            minWidth: '100%',
                                        },
                                    }}
                                    aria-label="Order Details"
                                >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                                                Description
                                            </TableCell>
                                            <TableCell
                                                align="right"
                                                sx={{ fontWeight: 'bold', fontSize: { xs: '0.875rem', sm: '1rem' } }}
                                            >
                                                Price
                                            </TableCell>

                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {products.map((item, id) => (
                                            <TableRow key={id}>
                                                <TableCell sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>{item.title} x 1</TableCell>
                                                <TableCell align="right" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                                                    {item.newPrice}
                                                </TableCell>

                                            </TableRow>
                                        ))}

                                        <TableRow>
                                            {/* <TableCell colSpan={2} /> */}
                                            <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                                                <div className="flex items-center gap-2">
                                                    <div>
                                                        Total
                                                    </div>
                                                    <Chip variant="outlined" color="green" value={orderDetails.payment_status} className="rounded-full" />
                                                </div>

                                            </TableCell>
                                            <TableCell align="right" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                                                <div className='flex items-center justify-end gap-2'>
                                                    <Chip variant="outlined" value={orderDetails.currency} className="rounded-full" />
                                                    <div>
                                                        {ccyFormat(invoiceSubtotal)}
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>

                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>

                        <div className="flex flex-col sm:flex-row mt-6 justify-between gap-5">
                            <div className='bg-[#f5f5f5] p-4 rounded-md flex-1'>
                                <h1 className='font-medium'>Shipping Address:</h1>
                                <p className='font-normal text-sm'>
                                    {orderDetails.shipping_details.name}, {orderDetails.shipping_details.address.line1}, {orderDetails.shipping_details.address.line2}, {orderDetails.shipping_details.address.city}, {orderDetails.shipping_details.address.state}, {orderDetails.shipping_details.address.country}, {orderDetails.shipping_details.address.postal_code}, {orderDetails.customer_details.phone}
                                </p>
                            </div>

                            <div className='bg-[#f5f5f5] p-4 rounded-md flex-1'>
                                <h1 className='font-medium'>Billing Address:</h1>
                                <p className='font-normal text-sm'> {orderDetails.customer_details.name}, {orderDetails.customer_details.address.line1}, {orderDetails.customer_details.address.line2}, {orderDetails.customer_details.address.city}, {orderDetails.customer_details.address.state}, {orderDetails.customer_details.address.country}, {orderDetails.customer_details.address.postal_code}</p>
                            </div>
                        </div>

                        <div className='mt-5'>
                            <h1 className='font-medium text-[#808080]'>Hope to see you soon,</h1>
                            <p className='font-medium '>BookStore Team</p>
                        </div>
                    </div>

                    {/* Footer Section */}
                    <div className="px-4 py-2 sm:py-4 text-center bg-[#f5f5f5] rounded-b-md">
                        <p className="text-xs sm:text-sm">
                            Thank you for shopping with us! <Link className="text-[#1c5bad]" to="/">Back to Home</Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderHistoryReceipt;
