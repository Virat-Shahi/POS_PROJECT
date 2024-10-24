import React, { useEffect, useState } from 'react'
import orderStore from '../Store/orderStore'
import useUserStore from '../Store/userStore'
import { format } from 'date-fns'

const OrderHistory = () => {
  const [orders, setOrders] = useState([])
  const getOrders = orderStore((state) => state.getOrders)
  const tableOrders = orderStore((state) => state.tableOrders)
  const token = useUserStore((state) => state.token)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const fetchingOrder = await getOrders(token)
        setOrders(fetchingOrder)
      } catch (error) {
        console.log("Error Fetching Orders:", error)
      }
    };

    fetchOrders()
  }, [getOrders, token])

  // Convert tableOrders object to an array for rendering

  return (

<div className="container mx-auto p-6">
  <h1 className="text-4xl font-bold text-red-800 mb-8">Order History</h1>
  {orders.length === 0 ? (
    <div className="text-center text-gray-500">
      <p>No orders yet. Start by placing an order!</p>
    </div>
  ) : (
    <div className="space-y-8">
      {orders.map((order) => (
        <div key={order.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Order Header */}
          <div className="p-5 bg-red-50 border-b border-red-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xl font-bold text-red-600">Order #{order.id}</p>
                <p className="text-sm text-gray-500">{format(new Date(order.orderDate), 'PPpp')}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-red-600">Total : ฿{order.totalAmount.toFixed(2)}</p>
                <p className="text-lg text-gray-600 font-mono">Table {order.tableId}</p>
              </div>
            </div>
            <p className="mt-3 font-bold text-md text-gray-600">
              Payment Status: <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${order.payment?.status === 'COMPLETED' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              {order.payment?.status === 'COMPLETED' ? '✔ PAID' : '✖ PENDING'}
              </span>
            </p>
          </div>

          {/* Order Details */}
          <div className="p-5">
            <h3 className="text-lg font-semibold text-red-800 mb-3">Order Details</h3>
            <table className="min-w-full text-left">
              <thead>
                <tr>
                  <th className="py-2">Item</th>
                  <th className="py-2 text-right">Quantity</th>
                  <th className="py-2 text-right">Price</th>
                </tr>
              </thead>
              <tbody>
                {order.orderItems.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="py-2">{item.menuItem.name}</td>
                    <td className="py-2 text-right">{item.quantity}</td>
                    <td className="py-2 text-right">฿{(item.quantity * item.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

  );
};

export default OrderHistory;
