import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useParams } from 'react-router-dom';
import tableStore from '../Store/tableStore';
import axios from 'axios';
import { toast } from 'react-toastify';
const PaymentOptions = ({ onClose, totalAmount, hdlInitiatePayment, hdlProcessPayment }) => {

    const { tableId } = useParams();
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [showQRCode, setShowQRCode] = useState(false);
    const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
    const [paymentId, setPaymentId] = useState(null);
    const actionUpdateTable = tableStore((state) => state.actionUpdateTable);

    const hdlQRclick = () => {
        setSelectedMethod('QR');
        setShowQRCode(true);
    }

    const hdlConfirmPayment = async () => {
        try {
            if (selectedMethod) {
                if(!paymentId) {
                    const id = await hdlInitiatePayment(selectedMethod);  // Show the confirmation modal
                    console.log("Confirm PaymentID:", id)
                    setPaymentId(id);  // Store the payment ID  
                }
                setShowPaymentConfirmation(true);
            }
        } catch (error) {
            console.log("Error initiating payment:", error)
        }
    }


    const hdlPaymentConfirmation = (received) => {
        if (received) {
            hdlProcessPayment(paymentId);
            actionUpdateTable(tableId, false);
            onClose();
        } else {
            setShowPaymentConfirmation(false);
            // Reset selected method if payment was not received
            setSelectedMethod(null);
        }
    }

    const resetPayment = async () => {
        try {
            if (paymentId) {
                // Make an API call to delete the payment
                await axios.delete(`http://localhost:3000/payment/${paymentId}`);
                setPaymentId(null);
                setSelectedMethod(null);
                toast.success("Payment deleted successfully");
                console.log("Payment deleted successfully");
            }
        } catch (error) {
            toast.error("Error deleting payment");
            console.log("Payment Deleted Successfully", error);
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className='text-2xl font-bold text-red-800'>Payment Options</h2>
                    <button onClick={onClose}
                        className='text-gray-500 hover:text-gray-700'>
                        <X size={24} />
                    </button>
                </div>
                <p className='text-xl font-semibold mb-4'>Total Amount: ฿{totalAmount.toFixed(2)}</p>

                <div>
                    <button onClick={() => setSelectedMethod('CASH')}
                        className={`w-full py-5 rounded-lg text-lg font-semibold transition-colors 
                    ${selectedMethod === 'CASH' ? 'bg-red-500 text-white' : 'bg-red-100 text-red-800 hover:bg-red-200'}`}>
                        Cash
                    </button>
                    <button onClick={hdlQRclick}
                        className={`mt-3 w-full py-5 rounded-lg text-lg font-semibold transition-colors 
                    ${selectedMethod === 'QR' ? 'bg-red-500 text-white' : 'bg-red-100 text-red-800 hover:bg-red-200'}`}>
                        QR SCAN
                    </button>
                </div>
                <button
                    onClick={hdlConfirmPayment}
                    className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white py-3 text-xl font-bold rounded transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-300"
                    disabled={!selectedMethod}
                >
                    Confirm Payment
                </button>

                {showQRCode && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-lg">
                            <h3 className="text-xl font-bold mb-4">Scan QR Code to Pay</h3>
                            <img src="https://i.postimg.cc/nLgmkM3J/QR-code.jpg" alt="QR Code" className="mb-4" />
                            <button
                                onClick={() => setShowQRCode(false)}
                                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
                            >
                                Close QR Code
                            </button>
                        </div>
                    </div>
                )}

                {showPaymentConfirmation && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                            <h3 className="text-2xl font-bold mb-6 text-red-600">Payment Received?</h3>
                            <div className="flex justify-between space-x-6">
                                <button
                                    onClick={() => hdlPaymentConfirmation(false)}
                                    className="w-full py-3 bg-red-500 text-white text-lg rounded hover:bg-red-600 transition duration-300"
                                >
                                    No
                                </button>
                                <button
                                    onClick={() => hdlPaymentConfirmation(true)}
                                    className="w-full py-3 bg-green-500 text-white text-lg rounded hover:bg-green-600 transition duration-300"
                                >
                                    Yes
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                
                {paymentId && !showPaymentConfirmation && (
                    <button
                        onClick={resetPayment}
                        className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded transition duration-300"
                    >
                        Reset Payment
                    </button>
                )}
            </div>
        </div>
    );
};

export default PaymentOptions;