import React, { useState } from 'react'
import orderStore from '../Store/orderStore';
import useUserStore from '../Store/userStore';
import { useParams } from 'react-router-dom';
import tableStore from '../Store/tableStore';
import { toast } from 'react-toastify';
import PaymentOptions from '../Payment/PaymentOptions';


const Order = () => {

  const { tableId } = useParams();
  const createOrder = orderStore((state => state.actionCreateOrder))
  const tableOrders = orderStore((state) => state.tableOrders[tableId]) || [];
  const token = useUserStore((state) => state.token);
  const increaseQuantity = orderStore((state) => state.increaseQuantity);
  const decreaseQuantity = orderStore((state) => state.decreaseQuantity);
  const actionUpdateTable = tableStore((state) => state.actionUpdateTable);
  const removeItem = orderStore((state) => state.removeItem)
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const processPayment = orderStore((state) => state.processPayment)

  const hdlPlaceOrder = (token, tableId, tableOrders) => {
    try {
      // Validation If no items in the order
      if (!tableOrders || tableOrders.length === 0) {
        toast.error("Cannot place an empty order. Please add items to your order.")
        return;
      }
      // Place the order
      const order = createOrder(token, tableId, tableOrders)

      // Update table status to occupied
      if (order) {
        actionUpdateTable(tableId, true);
        // Show a success message
        toast.success("Order placed successfully and table marked as occupied.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Error placing order. Please try again.");
    }
  }

  const hdlRemoveItem = (tableId, itemId) => {
    removeItem(tableId, itemId)
    toast.success("Item removed from the order.")
  }

  const hdlCheckout = () => {
    if (tableOrders && tableOrders.length > 0) {
      setShowPaymentOptions(true)
    }
    else {
      toast.error("Cannot checkout an empty order. Please add items to your order.")
    }
  }

  const hdlPayment = (paymentMethod) => {
    if(tableOrders.length === 0){
      toast.error("Cannot checkout an empty order. Please add items to your order.")
    }

    // Assuming the first order in tableOrders is the current order
    const currentOrder = tableOrders[0];
    const orderId = currentOrder.id;
    const amount = currentOrder.totalAmount
  

  if(!orderId){
    toast.error("Cannot checkout an empty order. Please add items to your order.")
    return
  }

  const result = processPayment(tableId,orderId,paymentMethod,amount)
  if(result.error){
    toast.error(result.error)
  } else {
    toast.success("Payment processed successfully.")
    setShowPaymentOptions(false)
  }


  const totalAmount = tableOrders?.reduce((acc, item) => acc + (item.price * item.quantity), 0)
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
                  <button
                    onClick={() => hdlRemoveItem(tableId, item.id)}
                    className="ml-2 bg-red-100 text-red-600 hover:bg-red-200 font-bold py-1 px-2 rounded"
                  >
                    x
                  </button>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <p className="text-lg font-semibold">Total:</p>
                  <p className="text-xl font-bold text-red-600">
                    ฿{totalAmount.toFixed(2)}
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
      <div className='w-full'>
        <div className='mt-8 bg-white p-6 rounded-lg shadow-md'>
          <h2 className='text-red-800 text-2xl font-bold' >Order Summary: </h2>

          <p className='text-red-600 text-xl mt-3 font-semibold'>Total: ฿{totalAmount.toFixed(2)}</p>
          <button onClick={hdlCheckout}
            className="w-full mt-4 bg-red-600 hover:bg-green-500 text-white py-3 text-xl font-bold px-4 rounded-xl transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-300">
            Check Out
          </button>
        </div>

      </div>
      {
        showPaymentOptions && <PaymentOptions
          onClose={() => setShowPaymentOptions(false)}
          totalAmount={totalAmount} />
      }
    </div>
  )
}
}
export default Order
