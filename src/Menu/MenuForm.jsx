import React, { useEffect, useState } from 'react';
import menuStore from '../Store/menuStore';

const MenuForm = () => {
    const actionAddmenu = menuStore(state => state.actionAddmenu);
    const getCategories = menuStore(state => state.getCategories);
    const categories = menuStore(state => state.categories);

    useEffect(() => {
        getCategories();
    }, []);

    const [newItems, setNewItems] = useState({
        name: "",
        description: "",
        price: "",
        categoryId: "",
        imageUrl: "",
    });

    const handleChange = (e) => {
        setNewItems(prevItems => ({
            ...prevItems,
            [e.target.name]: e.target.value
        }));
    }

    const hdlSubmit = async (e) => {
        e.preventDefault();
        try {
            await actionAddmenu({
                ...newItems,
                price: parseFloat(newItems.price),
                categoryId: parseInt(newItems.categoryId),
            });
            setNewItems({
                name: "",
                description: "",
                price: "",
                categoryId: "",
                imageUrl: "",
            });
            alert("Menu item added successfully!");
        } catch (error) {
            console.error("Error adding menu item:", error);
            alert("Error adding menu item. Please try again.");
        }
    };

    return (
        <form onSubmit={hdlSubmit} className='bg-white mb-8 p-6 rounded-lg shadow-md'>
            <h3 className="text-2xl font-bold mb-6 text-red-600">Add New Menu Item</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                    <label className="block text-gray-600 mb-2 font-medium">Item Name</label>
                    <input
                        type="text"
                        name="name"
                        value={newItems.name}
                        onChange={handleChange}
                        placeholder="Enter item name"
                        className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-red-300"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-600 mb-2 font-medium">Description</label>
                    <input
                        type="text"
                        name="description"
                        value={newItems.description}
                        onChange={handleChange}
                        placeholder="Enter item description"
                        className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-red-300"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-600 mb-2 font-medium">Price</label>
                    <input
                        type="number"
                        name="price"
                        value={newItems.price}
                        onChange={handleChange}
                        placeholder="Enter price"
                        className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-red-300"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-600 mb-2 font-medium">Category</label>
                    <select
                        name="categoryId"
                        value={newItems.categoryId}
                        onChange={handleChange}
                        className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-red-300"
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-gray-600 mb-2 font-medium">Image URL</label>
                    <input
                        type="text"
                        name="imageUrl"
                        value={newItems.imageUrl}
                        onChange={handleChange}
                        placeholder="Enter image URL"
                        className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-red-300"
                        required
                    />
                </div>
            </div>
            <button
                type="submit"
                className="mt-6 bg-red-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-red-600 transition-all focus:outline-none focus:ring-4 focus:ring-red-300"
            >
                Add Item
            </button>
        </form>
    );
};

export default MenuForm;