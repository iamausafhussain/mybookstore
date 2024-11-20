import { getImageUrl } from '../../utils/getImageUrl'
import { useParams } from 'react-router-dom';
import { useFetchBookByIdQuery } from '../../redux/features/book/bookSlice';
import { FiShoppingCart } from 'react-icons/fi';
import { Button } from '@headlessui/react';
import { addToCart } from '../../redux/features/cart/cartSlice';
import { useDispatch } from 'react-redux';
import { useSnackbar } from '../../context/SnackbarContext'

const SingleBook = () => {

    const { id } = useParams();
    const { data: book = [], isLoading, isError } = useFetchBookByIdQuery(id);
    const dispatch = useDispatch();
    const showSnackbar = useSnackbar();

    const handleAddToCart = (product) => {
        dispatch(addToCart(product))
        showSnackbar('Item added to cart.', 'success')
    }

    if (isLoading) return <div>Loading...</div>
    if (isError) return <div>Error Occured in loading book info.</div>

    return (
        <div className="max-w-lg shadow-md p-5">
            <h1 className="text-2xl font-bold mb-6">{book.title}</h1>

            <div className=''>
                <div>
                    <img
                        src={`${getImageUrl(book.coverImage)}`}
                        alt={book.title}
                        className="mb-8"
                    />
                </div>

                <div className='mb-5'>
                    <p className="text-gray-700 mb-2"><strong>Author:</strong> {book.createdBy || 'admin'}</p>
                    <p className="text-gray-700 mb-4">
                        <strong>Published:</strong> {new Date(book?.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-gray-700 mb-4 capitalize">
                        <strong>Category:</strong> {book?.category}
                    </p>
                    <p className="text-gray-700"><strong>Description:</strong> {book.description}</p>
                </div>

                <Button
                    onClick={() => handleAddToCart(book)}
                    className="rounded bg-[#4D47C3] hover:bg-[#3833a0] py-2 px-4 text-sm text-white flex items-center justify-center gap-1"
                >
                    <FiShoppingCart />
                    <span>Add to Cart</span>
                </Button>
            </div>
        </div>
    )
}

export default SingleBook