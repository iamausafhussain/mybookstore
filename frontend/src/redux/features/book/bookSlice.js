import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import getBaseUrl from '../../../utils/baseUrl'

const baseQuery = fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/books`,
    credentials: 'include',
    prepareHeaders: (Headers) => {
        const token = localStorage.getItem('token');
        if (token) {
            Headers.set('Authorization', `Bearer ${token}`)
        }
        return Headers;
    }
})

const booksApi = createApi({
    reducerPath: 'bookApi',
    baseQuery,
    tagTypes: ["Books"],
    endpoints: (builder) => ({
        fetchAllBooks: builder.query({
            query: () => "/getBooks",
            providesTags: ["Books"]
        }),
        fetchBookById: builder.query({
            query: (id) => `/getBooks/${id}`,
            providesTags: (results, error, id) => [{ type: "Books", id }]
        }),
        fetchBooksByProductId: builder.mutation({
            query: (productIds) => ({
                url: "/getBooksByIds",
                method: "POST",
                body: productIds,
                headers: {
                    'Content-Type': 'application/json'
                }
            }),
            invalidatesTags: ["Books"]
        }),
        addBook: builder.mutation({
            query: (newBook) => ({
                url: `/createBook`,
                method: "POST",
                body: newBook
            }),
            invalidatesTags: ["Books"]
        }),
        updateBook: builder.mutation({
            query: ({ id, ...rest }) => ({
                url: `/updateBook/${id}`,
                method: "PUT",
                body: rest,
                headers: {
                    'Content-Type': 'application/json'
                }
            }),
            invalidatesTags: ["Books"]
        }),
        deleteBook: builder.mutation({
            query: (id) => ({
                url: `/deleteBook/${id}`,
                method: "DELETE",
            })
        }),
    })
})

export const {
    useFetchAllBooksQuery,
    useFetchBookByIdQuery,
    useFetchBooksByProductIdMutation,
    useAddBookMutation,
    useUpdateBookMutation,
    useDeleteBookMutation,
} = booksApi
export default booksApi;

