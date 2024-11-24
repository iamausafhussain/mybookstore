import { useEffect, useState } from 'react';
import { useFetchOrdersByEmailQuery } from '../../redux/features/orders/orderSlice'
import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'
import bookApi from '../../redux/features/book/bookSlice';
import { useDispatch } from 'react-redux';
import { getImageUrl } from '../../utils/getImageUrl';
import { Chip } from "@material-tailwind/react";

const OrderHistory = () => {
  const dispatch = useDispatch();
  const [productsData, setProductsData] = useState({}); // To store fetched products
  const { currentUser } = useAuth();
  const {
    data: prevOrders = [],
    isLoading,
    isError,
  } = useFetchOrdersByEmailQuery(currentUser?.email, {
    skip: !currentUser?.email,
  });

  const fetchBookFromIds = async (productIds) => {
    try {
      const productPromises = productIds.map((id) =>
        dispatch(bookApi.endpoints.fetchBookById.initiate(id)).unwrap()
      );
      const products = await Promise.all(productPromises);
      console.log('products', products)
      return products;
    } catch (error) {
      console.error('Error fetching books:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchAllOrdersProducts = async () => {
      const allProductsData = {};
      for (const order of prevOrders.order) {
        const products = await fetchBookFromIds(order.product_ids);
        allProductsData[order.id] = products; // Group products by order ID
      }
      setProductsData(allProductsData);
    };

    fetchAllOrdersProducts();
  }, [prevOrders]);

  console.log('productsData: ', productsData)

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error fetching orders.</p>;
  }

  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : prevOrders.length === 0 ? (
        <p>You haven't ordered yet!</p>
      ) : (
        <>
          <div>
            <h1 className="font-medium text-2xl text-center md:text-left">Recent Orders</h1>
            <div className="mt-8">
              <div className="w-full flex flex-wrap gap-4">
                {prevOrders.order.map((order) => {

                  const formattedDate = new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(new Date(order.createdAt));

                  return (
                    <Link
                      to={`/order_history/${order.id}`}
                      key={order.id}
                      className="flex flex-col md:flex-row w-full h-auto md:h-[220px] items-start md:items-center justify-between border border-gray-300 rounded-md bg-gray-50 font-primary bg-gradient-to-t from-white via-white to-purple-50 p-4"
                    >
                      {/* Image Section */}
                      <div className="flex-shrink-0 mb-4 md:mb-0">
                        {productsData[order.id] ? (
                          <img
                            src={`${getImageUrl(productsData[order.id][0].coverImage)}`}
                            alt=""
                            className="w-32 h-32 md:w-24 md:h-24 rounded-md object-contain"
                          />
                        ) : (
                          <p>Loading products...</p>
                        )}
                      </div>

                      {/* Order Details Section */}
                      <div className="flex-grow text-sm md:ml-4">
                        <p className="font-medium">Order ID: #{order.created}</p>
                        <p className="mt-1">Total Items: {productsData[order.id]?.length || 0}</p>
                        <p className="mt-1">
                          Order Status:
                          <Chip size="sm" variant="outlined" color="green" value={order.payment_status == 'paid' ? 'confirm' : 'pending'} className="ml-1 rounded-full inline-flex items-center whitespace-nowrap" />
                        </p>
                        <p className="mt-1">Order Date: {formattedDate}</p>
                        <p className="mt-1">Delivery Date: Not yet Shipped</p>
                        <p className="mt-1">Payment:
                          <Chip size="sm" variant="outlined" color="green" value={order.payment_status} className="ml-1 rounded-full inline-flex items-center whitespace-nowrap" />
                        </p>
                        <p className="mt-1">Total Amount:
                          <Chip size="sm" variant="outlined" color="green" value={order.currency} className="ml-1 mr-1 rounded-full inline-flex items-center whitespace-nowrap" />
                          {order.amount_total}
                        </p>
                      </div>

                      {/* Customer Details Section */}
                      <div className="w-full md:w-1/2 mt-4 md:mt-0 text-sm text-gray-700 flex flex-wrap font-medium">
                        <p className="w-full">Customer Email: {order.customer_details.email}</p>

                        <p className="mt-1 w-full font-medium">
                          Customer Address: {order.customer_details.phone},{" "}
                          {order.customer_details.address.line1},{" "}
                          {order.customer_details.address.line2},{" "}
                          {order.customer_details.address.city},{" "}
                          {order.customer_details.address.country},{" "}
                          {order.customer_details.address.state},{" "}
                          {order.customer_details.address.postal_code}
                        </p>

                        <p className="mt-1 w-full font-medium">
                          Shipping Address: {order.shipping_details.address.line1},{" "}
                          {order.shipping_details.address.line2},{" "}
                          {order.shipping_details.address.city},{" "}
                          {order.shipping_details.address.country},{" "}
                          {order.shipping_details.address.state},{" "}
                          {order.shipping_details.address.postal_code}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default OrderHistory