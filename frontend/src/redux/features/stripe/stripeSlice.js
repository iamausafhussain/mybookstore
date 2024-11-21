import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import getBaseUrl from '../../../utils/baseUrl'

const baseQuery = fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/stripe`,
    credentials: 'include',
    prepareHeaders: (Headers) => {
        const token = localStorage.getItem('token');
        if (token) {
            Headers.set('Authorization', `Bearer ${token}`)
        }
        return Headers;
    }
})

const stripeApi = createApi({
    reducerPath: 'stripeApi',
    baseQuery,
    tagTypes: ["Stripe"],
    endpoints: (builder) => ({
        createCheckoutSession: builder.mutation({
            query: (newPayment) => ({
                url: `/create-checkout-session`,
                headers: { "Content-Type": "application/json" },
                method: "POST",
                body: newPayment
            }),
            invalidatesTags: ["Books"]
        }),
        fetchSessionDetails: builder.query({
            query: (session_id) => `/retrieve-session/${session_id}`,
            providesTags: (results, error, session_id) => [{type: 'Stripe', session_id}]
        })
    })
})

export const { useCreateCheckoutSessionMutation, useFetchSessionDetailsQuery } = stripeApi
export default stripeApi;