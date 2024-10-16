
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import menuStore from '../Store/menuStore';
import orderStore from '../Store/orderStore';
import useUserStore from '../Store/userStore';
import Order from '../Order/Order';

const TableOrder = () => {
    const { tableId } = useParams();
    const navigate = useNavigate();
    const actionMenu = menuStore((state) => state.actionMenu);
    const menuItems = menuStore((state) => state.menuItems);
    const categories = menuStore((state) => state.categories);
    const getCategories = menuStore((state) => state.getCategories);
    const addToOrder = orderStore((state) => state.addToOrder);
    const [currentCategory, setCurrentCategory] = useState('All');

    useEffect(() => {
        actionMenu();
        getCategories();
    }, []);

    const hdlCategory = (category) => {
        setCurrentCategory(category);
    };

    const handleExit = () => {
        navigate('/'); // Assuming '/' is the route for the table page
    };

    const hdlAddToOrder = (item) => {
        addToOrder(tableId,item);
    };
    
    let filteredItems = menuItems;
    if (currentCategory !== 'All') {
        filteredItems = menuItems.filter(
            (item) => item.category?.name === currentCategory
        );
    }



    return (
        <div className="flex flex-col p-6 bg-red-50 min-h-screen">
            {/* Exit button */}
            <div className="mb-4">
                <button
                    onClick={handleExit}
                    className="bg-red-100 hover:bg-red-200 text-red-400 font-bold py-4 px-6 text-xl rounded-full transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                    Exit to Table View
                </button>
            </div>

            <div className="flex flex-col md:flex-row">
                {/* Left section: Menu */}
                <div className="w-full md:w-3/4 pr-0 md:pr-8 mb-8 md:mb-0">
                    <h2 className="text-3xl font-bold mb-8 text-red-800 text-center">
                        Menu for Table {tableId}
                    </h2>

                    {/* Category Buttons */}
                    <div className="flex justify-start md:justify-center flex-wrap gap-2 mb-8 overflow-x-auto pb-2">
                        <button
                            onClick={() => hdlCategory('All')}
                            className={`px-4 py-2 rounded-full font-semibold transition duration-300 whitespace-nowrap
                            ${currentCategory === 'All'
                                    ? 'bg-red-500 text-white hover:bg-red-600'
                                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                                }`}
                        >
                            All
                        </button>

                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => hdlCategory(category.name)}
                                className={`px-4 py-2 rounded-full font-semibold transition duration-300 whitespace-nowrap
                                ${category.name === currentCategory
                                        ? 'bg-red-500 text-white hover:bg-red-600'
                                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                                    }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>

                    {/* Menu Items */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredItems.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
                            >
                                {item.imageUrl && (
                                    <img
                                        src={'https://i.postimg.cc/DZC7JFCd/Untitled-design.png'}
                                        alt={item.name}
                                        className="w-full h-48 object-cover"
                                    />
                                )}
                                <div className="p-4 flex-grow flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-xl font-semibold text-red-600 mb-2">{item.name}</h3>
                                        <p className="text-gray-600 mb-2">{item.description}</p>
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-lg font-bold text-red-500">
                                                ฿{item.price.toFixed(2)}
                                            </span>
                                            <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">
                                                {item.category?.name}
                                            </span>
                                        </div>
                                        <button onClick={() => hdlAddToOrder(item)}
                                            className="w-full mt-3 bg-red-500 hover:bg-red-600 text-white py-3 text-xl font-bold px-4 rounded transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-300">
                                            Add to Order
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right section: Current Order */}
                <Order />
            </div>
        </div>
    );
};

export default TableOrder;


