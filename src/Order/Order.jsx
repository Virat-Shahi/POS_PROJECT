import React, { useEffect, useState } from 'react'
import orderStore from '../Store/orderStore';
import useUserStore from '../Store/userStore';
import { useParams } from 'react-router-dom';
import tableStore from '../Store/tableStore';
import { toast } from 'react-toastify';
import PaymentOptions from '../Payment/PaymentOptions';


const Order = (props) => {
  const {isModified,setIsModified} = props

  const { tableId } = useParams();
  const createOrder = orderStore((state => state.actionCreateOrder))
  const tableOrders = orderStore((state) => state.tableOrders[tableId]) || [];
  const token = useUserStore((state) => state.token);
  const increaseQuantity = orderStore((state) => state.increaseQuantity);
  const decreaseQuantity = orderStore((state) => state.decreaseQuantity);
  const actionUpdateTable = tableStore((state) => state.actionUpdateTable);
  const removeItem = orderStore((state) => state.removeItem)
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const initiatePayment = orderStore((state) => state.initiatePayment);
  const processPayment = orderStore((state) => state.processPayment);
  const actionUpdateOrder = orderStore((state) => state.actionUpdateOrder);
  const hdlPlaceOrder = async (token, tableId, tableOrders) => {
    try {
      // Validation If no items in the order
      if (!tableOrders || tableOrders.length === 0) {
        toast.error("Cannot place an empty order. Please add items to your order.")
        return;
      }
      // Place the order
      const order = await createOrder(token, tableId, tableOrders)
      console.log(order)

      if (order) {
        // Update table status to occupied
        actionUpdateTable(tableId, true);
        // Set the current order ID
        setCurrentOrderId(order.id)
        // Reset the modified flag
        setIsModified(false);
        console.log("Current Order ID set to:", order.id);
        toast.success("Order placed successfully and table marked as occupied.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Error placing order. Please try again.");
    }
  }

  const hdlUpdateOrder = async () => {
    try {
      if (!currentOrderId) {
        toast.error("Cannot find order Id. Please add items in order first.")
        return
      }
      if (!tableOrders || tableOrders.length === 0) {
        toast.error("Cannot update an empty order. Please add items to your order.")
        return
      }
      if (!isModified) {
        toast.info("No changes detected in the order.")
        return
      }
      const result = await actionUpdateOrder(token, currentOrderId, tableId, tableOrders)
      if (result) {
        toast.success("Order updated successfully.")
        setIsModified(false); // Reset the modified flag after successful update
      } else {
        toast.error("Failed to update order. Please try again.")
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error(`Error updating order: ${error.message}`);
    }
  }

  const hdlRemoveItem = (tableId, itemId) => {
    removeItem(tableId, itemId)
    setIsModified
    toast.success("Item removed from the order.")
  }

  const hdlIncreaseQuantity = (tableId, itemId) => {
    increaseQuantity(tableId, itemId);
    setIsModified(true);
  }

  const hdlDecreaseQuantity = (tableId, itemId) => {
    decreaseQuantity(tableId, itemId);
    setIsModified(true);
  }


  const hdlCheckout = () => {
    if (tableOrders && tableOrders.length > 0) {
      setShowPaymentOptions(true)
    }
    else {
      toast.error("Cannot checkout an empty order. Please add items to your order.")
    }
  }


  const totalAmount = tableOrders?.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const hdlInitiatePayment = async (paymentMethod) => {
    if (!tableOrders && tableOrders.length > 0) {
      toast.error("Cannot checkout an empty order. Please add items to your order.")
    }

    if (!currentOrderId) {
      toast.error("Cannot find order Id. Please add items in order first.")
      return
    }

    try {
      const paymentId = await initiatePayment(tableId, currentOrderId, paymentMethod, totalAmount)
      console.log(paymentId)
      if (!paymentId) {
        toast.error("An error occurred while initiating payment. Please try again.")
        return
      }
      toast.success("Payment processed successfully.")
      return paymentId
    } catch (error) {
      console.error("Error initiating payment:", error);
      toast.error("An error occurred while initiating payment. Please try again.");
    }

  }

  const hdlProcessPayment = async (paymentId) => {
    try {
      const success = await processPayment(tableId, currentOrderId, paymentId)
      console.log("SOmething here", success)
      if (success) {
        toast.success("Payment processed successfully.")
      }
      else {
        toast.error("An error occurred while processing payment. Please try again.")
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("An error occurred while processing payment. Please try again.");
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
                      onClick={() => hdlDecreaseQuantity(tableId, item.id)}
                      className="bg-red-100 text-red-600 hover:bg-red-200 font-bold py-1 px-2 rounded"
                    >
                      -
                    </button>
                    <span className="font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => hdlIncreaseQuantity(tableId, item.id)}
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
          <button
            onClick={() => hdlUpdateOrder(token, currentOrderId, tableId, tableOrders)}
            disabled={!currentOrderId || !isModified}
            className={`w-full py-3 text-xl font-bold px-4 rounded transition duration-300 
              ${currentOrderId && isModified
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
          >
            Update Order
          </button>
        </div>
      </div>
      <div className='w-full'>
        <div className='mt-8 bg-white p-6 rounded-lg shadow-md'>
          <h2 className='text-red-800 text-2xl font-bold' >Order Summary: </h2>

          <p className='text-red-600 text-xl mt-3 font-semibold'>Total: ฿{totalAmount.toFixed(2)}</p>
          <button
            onClick={hdlCheckout}
            disabled={tableOrders?.length === 0}
            className={`w-full mt-4 ${tableOrders?.length > 0
              ? "bg-red-600 hover:bg-green-500"
              : "bg-gray-400 cursor-not-allowed"
              } text-white py-3 text-xl font-bold px-4 rounded-xl transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-300`}
          >
            Check Out
          </button>
        </div>

      </div>
      {
        showPaymentOptions && <PaymentOptions
          onClose={() => setShowPaymentOptions(false)}
          totalAmount={totalAmount}
          hdlInitiatePayment={hdlInitiatePayment}
          hdlProcessPayment={hdlProcessPayment} />
      }
    </div>


  )
}

export default Order
