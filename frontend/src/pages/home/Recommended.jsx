import BookCard from '../books/BookCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { Navigation } from 'swiper/modules'
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation'
import '../../App.css';
import { useFetchAllBooksQuery } from '../../redux/features/book/bookSlice';

const Recommended = () => {

    const { data: books = [] } = useFetchAllBooksQuery();

    const filteredBooks = books.filter(books => books.trending == true);

    return (
        <div className='py-16'>
            <h2 className='text-3xl font-semibold mb-6'>
                Recommended
            </h2>

            <Swiper
                slidesPerView={1}
                spaceBetween={30}
                navigation={true}
                breakpoints={{
                    500: {
                        slidesPerView: 1,
                        spaceBetween: 20,
                    },
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 40,
                    },
                    1024: {
                        slidesPerView: 2,
                        spaceBetween: 50,
                    },
                    1180: {
                        slidesPerView: 3,
                        spaceBetween: 50,
                    }
                }}
                modules={[Pagination, Navigation]}
                className="mySwiper">
                {
                    filteredBooks.length > 0 && filteredBooks.map((book, index) => (
                        <SwiperSlide key={index} className='px-4 py-4 rounded-md'>
                            <BookCard key={index} book={book} />
                        </SwiperSlide>
                    ))

                }
            </Swiper>
        </div>
    )
}

export default Recommended