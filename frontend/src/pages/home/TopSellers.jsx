import { useState } from 'react'
import BookCard from '../books/BookCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { Navigation } from 'swiper/modules'
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation'
import '../../App.css';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import {
  ChevronDownIcon,
} from '@heroicons/react/16/solid'
import { useFetchAllBooksQuery } from '../../redux/features/book/bookSlice';

const categories = ["Choose a genre", "Business", "Fiction", "Horror", "Adventure"]

const TopSellers = () => {

  const { data: books = [] } = useFetchAllBooksQuery();
  const [selectedCategory, setSelectedCategory] = useState("Choose a genre");

  const filteredBooks = selectedCategory === "Choose a genre" ? books : books.filter(books => books.category === selectedCategory.toLowerCase())

  return (
    <div className='py-10'>
      <h2 className='text-3xl font-semibold mb-6'>
        Top Sellers
      </h2>

      {/* Category filter */}
      
      <Menu as="div" className="relative inline-block text-left py-4">
        <div>
          <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            {selectedCategory}
            <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-gray-400" />
          </MenuButton>
        </div>

        <MenuItems
          anchor="bottom start"
          transition
          className="absolute right-0 z-10 mt-2 w-56  rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
        >
          <div className="py-1">
            {
              categories.map((category, index) => (
                <MenuItem key={index}>
                  <a
                    onClick={() => (setSelectedCategory(category))}
                    className="block px-4 py-2 font-primary text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                  >
                    {category}
                  </a>
                </MenuItem>
              ))
            }
            
          </div>
        </MenuItems>
      </Menu>

      {/* Slider */}

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
            slidesPerView: 1,
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
              <BookCard book={book} />
            </SwiperSlide>
          ))

        }
      </Swiper>

    </div>
  )
}

export default TopSellers