import React, { useState } from 'react';
import { X } from 'lucide-react';

const PaymentOptions = ({ onClose, totalAmount }) => {
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [showQRCode, setShowQRCode] = useState(false);

    const hdlQRclick = () => {
        setSelectedMethod('QR');
        setShowQRCode(true);
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
            </div>
        </div>
    );
};

export default PaymentOptions;