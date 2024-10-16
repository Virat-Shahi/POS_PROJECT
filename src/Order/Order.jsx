import React, { useState } from 'react'
import orderStore from '../Store/orderStore';
import useUserStore from '../Store/userStore';
import { useParams } from 'react-router-dom';
import tableStore from '../Store/tableStore';

const Order = () => {

  const { tableId } = useParams();
  const createOrder = orderStore((state => state.actionCreateOrder))
  const tableOrders = orderStore((state) => state.tableOrders[tableId]);
  const token = useUserStore((state) => state.token);
  const increaseQuantity = orderStore((state) => state.increaseQuantity);
  const decreaseQuantity = orderStore((state) => state.decreaseQuantity);
  const actionUpdateTable = tableStore((state) => state.actionUpdateTable);


  //   const hdlPlaceOrder = (token, tableId, order) => {
  //     console.log(token)
  //     createOrder(token, tableId, order)
  // }

  const hdlPlaceOrder = (token, tableId, tableOrders) => {
    try {
      const order = createOrder(token, tableId, tableOrders)

      if (order) {
        // Update table status to occupied
        actionUpdateTable(tableId, true);
        // Show a success message
        alert("Order placed successfully and table marked as occupied.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Error placing order. Please try again.");
    }
  }
  // console.log(tableOrders)
  return (
    <div className="w-full md:w-1/4 md:sticky md:top-6 md:self-start">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-red-800">Current Order</h2>
        <div className="space-y-4">
          {tableOrders?.length === 0 ? (
            <p className="text-gray-600">No items in the order yet.</p>
          ) : (
            <>
              {tableOrders?.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200">
                  <div className="flex-grow">
                    <p className="font-semibold text-red-600">{item.name}</p>
                    <p className="text-sm text-gray-500">฿{item.price}</p>

                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => decreaseQuantity(tableId, item.id)}
                      className="bg-red-100 text-red-600 hover:bg-red-200 font-bold py-1 px-2 rounded"
                    >
                      -
                    </button>
                    <span className="font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => increaseQuantity(tableId, item.id)}
                      className="bg-red-100 text-red-600 hover:bg-red-200 font-bold py-1 px-2 rounded"
                    >
                      +
                    </button>
                  </div>
                  <p className="font-bold text-red-500 ml-4 w-20 text-right">฿{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <p className="text-lg font-semibold">Total:</p>
                  <p className="text-xl font-bold text-red-600">
                    ฿{tableOrders?.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </>
          )}
          <button
            onClick={() => hdlPlaceOrder(token, tableId, tableOrders)}
            className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white py-3 text-xl font-bold px-4 rounded transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  )
}

export default Order
