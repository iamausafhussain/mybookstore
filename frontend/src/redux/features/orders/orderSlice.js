import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import getBaseUrl from '../../../utils/baseUrl'

const baseQuery = fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/orders`,
    credentials: 'include',
    prepareHeaders: (Headers) => {
        const token = localStorage.getItem('token');
        if (token) {
            Headers.set('Authorization', `Bearer ${token}`)
        }
        return Headers;
    }
})

const ordersApi = createApi({
    reducerPath: 'orderApi',
    baseQuery,
    tagTypes: ['Orders'],
    endpoints: (builder) => ({
        fetchAllOrders: builder.query({
            query: () => "/getOrders",
            providesTags: ["Orders"]
        }),
        fetchOrdersByEmail: builder.query({
            query: (email) => `/getOrder/${email}`,
            providesTags: (results, error, email) => [{ type: "Orders", email }]
        }),
        addOrder: builder.mutation({
            query: (newOrder) => ({
                url: '/createOrder',
                method: 'POST',
                body: newOrder
            }),
            invalidatesTags: ["Orders"]
        })
    })
})

export const { useFetchAllOrdersQuery, useAddOrderMutation, useFetchOrdersByEmailQuery } = ordersApi
export default ordersApi;
