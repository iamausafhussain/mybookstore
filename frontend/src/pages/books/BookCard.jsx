import React, { useState } from 'react'
import { FiShoppingCart } from 'react-icons/fi'
import { getImageUrl } from '../../utils/getImageUrl'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../redux/features/cart/cartSlice'
import { Button } from '@headlessui/react'
import { useSnackbar } from '../../context/SnackbarContext'


const BookCard = ({ book }) => {
    const dispatch = useDispatch();
    const showSnackbar = useSnackbar();

    const handleAddToCart = (product) => {
        dispatch(addToCart(product))
        showSnackbar('Book added to Cart', 'success')
    }

    return (
        <div className="rounded-lg transition-shadow duration-300">
            <div
                className="flex flex-col sm:flex-row sm:items-center sm:h-72  sm:justify-center gap-4">
                <div className="sm:h-72 sm:flex-shrink-0 border rounded-md">
                    <Link to={`books/${book._id}`}>
                        <img
                            src={`${getImageUrl(book.coverImage)}`}
                            alt=""
                            className="w-full bg-cover p-2 rounded-md cursor-pointer hover:scale-105 transition-all duration-200" />
                    </Link>
                </div>

                <div className='sm:h-72 flex flex-col justify-between'>
                    <Link to={`books/${book._id}`}>
                        <h3 className="text-xl font-semibold hover:text-blue-600 mb-3">
                            {book.title}
                        </h3>
                    </Link>
                    <p className="text-gray-600 mb-5">{book.description.length > 80 ? `${book.description.slice(0, 80)}...` : book.description}</p>
                    <p className="font-medium mb-5"> ${`${book.newPrice}`}
                        <span className="line-through font-normal ml-2">${`${book.oldPrice}`}</span>
                    </p>
                    <Button
                        onClick={() => handleAddToCart(book)}
                        className="rounded bg-[#4D47C3] hover:bg-[#3833a0] py-2 px-4 text-sm text-white flex items-center justify-center gap-1"
                       >
                        <FiShoppingCart />
                        <span>Add to Cart</span>
                    </Button>
                </div>
            </div>

            

        </div>
    )
}

export default BookCard