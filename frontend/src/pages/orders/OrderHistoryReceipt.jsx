import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useFetchSessionDetailsQuery } from '../../redux/features/stripe/stripeSlice';
import { useAddOrderMutation } from '../../redux/features/orders/orderSlice';

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
                    address: {
                        city: orderDetails.customer_details?.address?.city,
                        country: orderDetails.customer_details?.address?.country,
                        line1: orderDetails.customer_details?.address?.line1,
                        line2: orderDetails.customer_details?.address?.line2,
                        postal_code: orderDetails.customer_details?.address?.postal_code,
                        state: orderDetails.customer_details?.address?.state,
                    },
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
                    address: {
                        city: orderDetails.shipping_details?.address?.city,
                        country: orderDetails.shipping_details?.address?.country,
                        line1: orderDetails.shipping_details?.address?.line1,
                        line2: orderDetails.shipping_details?.address?.line2,
                        postal_code: orderDetails.shipping_details?.address?.postal_code,
                        state: orderDetails.shipping_details?.address?.state,
                    },
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

    return (
        <div>
            <h1>Order Receipt</h1>
            <pre>{JSON.stringify(orderDetails, null, 2)}</pre>
        </div>
    );
};

export default OrderHistoryReceipt;
