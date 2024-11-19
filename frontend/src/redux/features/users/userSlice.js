import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import getBaseUrl from '../../../utils/baseUrl'

const baseQuery = fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/users`,
    credentials: 'include',
    prepareHeaders: (Headers) => {
        const token = localStorage.getItem('token');
        if (token) {
            Headers.set('Authorization', `Bearer ${token}`)
        }
        return Headers;
    }
})

const usersApi = createApi({
    reducerPath: 'userApi',
    baseQuery,
    tagTypes: ['Users'],
    endpoints: (builder) => ({
        fetchAllUsers: builder.query({
            query: () => "/getAllUsers",
            providesTags: ["Users"]
        }),
        fetchUserByEmail: builder.query({
            query: (email) => `/getUser/${email}`,
            providesTags: (results, error, email) => [{ type: "Users", email }]
        }),
        addUser: builder.mutation({
            query: (newUser) => ({
                url: "/createUser",
                method: 'POST',
                body: newUser
            }),
            invalidatesTags: ["Users"]
        })
    })
})

export const { useFetchAllUsersQuery, useFetchUserByEmailQuery, useAddUserMutation } = usersApi;
export default usersApi;