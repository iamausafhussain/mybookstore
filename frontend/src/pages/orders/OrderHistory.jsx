import { useFetchOrdersByEmailQuery } from '../../redux/features/orders/orderSlice'
import { useAuth } from '../../context/AuthContext'

const OrderHistory = () => {
  const { currentUser } = useAuth();
  const { data: prevOrders = [], isLoading, isError } = useFetchOrdersByEmailQuery(currentUser?.email, {
    skip: !currentUser?.email,
  });

  console.log('order-history: ', prevOrders)

  return (
    <>
      {
        isLoading
          ? (<p>Loading...</p>)
          : (prevOrders.length == 0 ? <p>You haven't ordered yet!</p> : <p>Orders</p>)
      }
    </>
  )
}

export default OrderHistory