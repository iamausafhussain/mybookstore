import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
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

const OrderHistoryReceipt = () => {
    const { session_id } = useParams();

    const { data: orderDetails, isLoading, isError } = useFetchSessionDetailsQuery(session_id, {
        skip: !session_id,
    });

    const [addOrder] = useAddOrderMutation();

    useEffect(() => {
        if (orderDetails && !isLoading && !isError) {
            const order = {
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

            addOrder(order)
                .unwrap()
                .then((res) => {
                    console.log('Order added successfully: ', res);
                })
                .catch((err) => {
                    console.error('Failed to add order: ', err);
                });
        }
    }, [orderDetails, isLoading, isError, addOrder]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error fetching order details.</div>;
    }

    if (!orderDetails) {
        return <div>No order details found.</div>;
    }

    const TAX_RATE = 0.07;

    function ccyFormat(num) {
        return `${num.toFixed(2)}`;
    }

    function priceRow(qty, unit) {
        return qty * unit;
    }

    function createRow(desc, qty, unit) {
        const price = priceRow(qty, unit);
        return { desc, qty, unit, price };
    }

    const rows = [
        createRow('Paperclips (Box)', 100, 1.15),
        createRow('Paper (Case)', 10, 45.99),
        createRow('Waste Basket', 2, 17.99),
    ];

    const invoiceSubtotal = rows.reduce((sum, row) => sum + row.price, 0);
    const invoiceTaxes = TAX_RATE * invoiceSubtotal;
    const invoiceTotal = invoiceSubtotal + invoiceTaxes;

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
                            <h4 className="text-sm sm:text-base">Order No:</h4>
                            <h2 className="font-semibold ml-2 text-sm sm:text-lg">
                                {orderDetails.created}
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
                                <Table sx={{ minWidth: 700 }} aria-label="Order Details">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Description</TableCell>
                                            <TableCell align="right">Quantity</TableCell>
                                            <TableCell align="right">Unit Price</TableCell>
                                            <TableCell align="right">Total</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows.map((row) => (
                                            <TableRow key={row.desc}>
                                                <TableCell>{row.desc}</TableCell>
                                                <TableCell align="right">{row.qty}</TableCell>
                                                <TableCell align="right">{ccyFormat(row.unit)}</TableCell>
                                                <TableCell align="right">{ccyFormat(row.price)}</TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow>
                                            <TableCell rowSpan={3} />
                                            <TableCell colSpan={2}>Subtotal</TableCell>
                                            <TableCell align="right">
                                                {ccyFormat(invoiceSubtotal)}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Tax</TableCell>
                                            <TableCell align="right">{`${(TAX_RATE * 100).toFixed(0)}%`}</TableCell>
                                            <TableCell align="right">
                                                {ccyFormat(invoiceTaxes)}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell colSpan={2}>Total</TableCell>
                                            <TableCell align="right">{ccyFormat(invoiceTotal)}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>

                        <div className="flex flex-col sm:flex-row mt-6 justify-between gap-5">
                            <div className='bg-[#f5f5f5] p-4 rounded-md flex-1'>
                                <h1 className='font-medium'>Shipping Address:</h1>
                                <p className='font-normal text-sm'>No - 10 A, Street Name, Area Name, City Name, State name, country</p>
                            </div>

                            <div className='bg-[#f5f5f5] p-4 rounded-md flex-1'>
                                <h1 className='font-medium'>Billing Address:</h1>
                                <p className='font-normal text-sm'>No - 10 A, Street Name, Area Name, City Name, State name, country</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer Section */}
                    <div className="px-4 py-2 sm:py-4 text-center bg-[#f5f5f5] rounded-b-md">
                        <p className="text-xs sm:text-sm">
                            Thank you for shopping with us!
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderHistoryReceipt;
