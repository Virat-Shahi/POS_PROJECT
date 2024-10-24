
// import React, { useEffect, useState } from 'react'
// import MenuForm from './MenuForm';
// import menuStore from '../Store/menuStore';

// const Menu = () => {
//     const menuItems = menuStore(state => state.menuItems);
//     const actionMenu = menuStore(state => state.actionMenu);
//     const actionDeleteMenu = menuStore(state => state.actionDeleteMenu);
//     const categories = menuStore(state => state.categories);
//     const getCategories = menuStore(state => state.getCategories);
//     const [currentCategory, setCurrentCategory] = useState("All");
//     const [searchTerm, setSearchTerm] = useState("")

//     useEffect(() => {
//         actionMenu();
//         getCategories();
//     }, []);
    
//     const hdlDelete = async (id) => {
//         await actionDeleteMenu(id);
//     }

//     const hdlCategory = (category) => {
//         setCurrentCategory(category);
//     }

//     const hdlSearch = (e) => {
//         setSearchTerm(e.target.value)
//     }

//     let filteredItems = menuItems;
//     if (currentCategory !== "All") {
//         filteredItems = menuItems.filter(item => item.category.name === currentCategory);
//     }

//     if(searchTerm){
//         filteredItems = filteredItems.filter(item => 
//             item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             item.description.toLowerCase().includes(searchTerm.toLowerCase())
//         );
//     }

//     return (
//         <div className="p-6 bg-red-50">
//             <h2 className="text-3xl font-bold mb-8 text-red-800">Menu Management</h2>
//             <MenuForm />

//             <div className="flex items-center space-x-4 mb-8 bg-white p-2 rounded-lg shadow-md">
//                 <input
//                     type="text"
//                     onChange={hdlSearch}
//                     value={searchTerm}
//                     placeholder="Search menu items..."
//                     className="flex-grow px-4 py-2 text-red-800 bg-transparent border-none focus:outline-none focus:ring-0"
//                 />
//                 <button
//                     onClick={() => hdlCategory("All")}
//                     className={`px-4 py-2 rounded-md font-semibold transition duration-300 
//                         ${currentCategory === "All"
//                             ? 'bg-red-500 text-white hover:bg-red-600'
//                             : 'bg-red-100 text-red-800 hover:bg-red-200'}`}
//                 >All</button>
//                 {categories.map((category) => (
//                     <button
//                         key={category.id}
//                         onClick={() => hdlCategory(category.name)}
//                         className={`px-4 py-2 rounded-md font-semibold transition duration-300 
//                             ${category.name === currentCategory
//                                 ? 'bg-red-500 text-white hover:bg-red-600'
//                                 : 'bg-red-100 text-red-800 hover:bg-red-200'}`}
//                     >{category.name}</button>
//                 ))}
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {filteredItems.map(item => (
//                     <div key={item.id} className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
//                         <img src={item.imageUrl} alt={item.name} className="w-full h-48 object-cover" />
//                         <div className="p-4">
//                             <div className="flex justify-between items-start mb-3">
//                                 <h3 className="text-xl font-semibold text-red-600">{item.name}</h3>
//                                 <span className="text-lg font-bold text-red-500">฿{item.price.toFixed(2)}</span>
//                             </div>
//                             <p className="text-gray-600 mb-3">{item.description}</p>
//                             <div className="flex justify-between items-center">
//                                 <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">{item.category?.name}</span>
//                                 <button onClick={() => hdlDelete(item.id)}
//                                     className="bg-red-500 hover:bg-red-600 text-white py-2 px-5 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-300 shadow-md">
//                                     Delete Item
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     )
// }

// export default Menu

import React, { useEffect, useState } from 'react'
import MenuForm from './MenuForm';
import menuStore from '../Store/menuStore';
import MenuEditForm from './MenuEditForm';


const Menu = () => {
    const menuItems = menuStore(state => state.menuItems);
    const actionMenu = menuStore(state => state.actionMenu);
    const actionDeleteMenu = menuStore(state => state.actionDeleteMenu);
    const categories = menuStore(state => state.categories);
    const getCategories = menuStore(state => state.getCategories);
    const [currentCategory, setCurrentCategory] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [editingItem, setEditingItem] = useState(null); // Only new state we need

    useEffect(() => {
        actionMenu();
        getCategories();
    }, []);
    
    const hdlDelete = async (id) => {
        await actionDeleteMenu(id);
    }

    const hdlCategory = (category) => {
        setCurrentCategory(category);
    }

    const hdlSearch = (e) => {
        setSearchTerm(e.target.value)
    }

    let filteredItems = menuItems;
    if (currentCategory !== "All") {
        filteredItems = menuItems.filter(item => item.category.name === currentCategory);
    }

    if(searchTerm){
        filteredItems = filteredItems.filter(item => 
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    return (
        <div className="p-6 bg-red-50">
            <h2 className="text-3xl font-bold mb-8 text-red-800">Menu Management</h2>
            <MenuForm />

            <div className="flex items-center space-x-4 mb-8 bg-white p-2 rounded-lg shadow-md">
                <input
                    type="text"
                    onChange={hdlSearch}
                    value={searchTerm}
                    placeholder="Search menu items..."
                    className="flex-grow px-4 py-2 text-red-800 bg-transparent border-none focus:outline-none focus:ring-0"
                />
                <button
                    onClick={() => hdlCategory("All")}
                    className={`px-4 py-2 rounded-md font-semibold transition duration-300 
                        ${currentCategory === "All"
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'}`}
                >All</button>
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => hdlCategory(category.name)}
                        className={`px-4 py-2 rounded-md font-semibold transition duration-300 
                            ${category.name === currentCategory
                                ? 'bg-red-500 text-white hover:bg-red-600'
                                : 'bg-red-100 text-red-800 hover:bg-red-200'}`}
                    >{category.name}</button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map(item => (
                    <div key={item.id} className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <img src={item.imageUrl} alt={item.name} className="w-full h-48 object-cover" />
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-xl font-semibold text-red-600">{item.name}</h3>
                                <span className="text-lg font-bold text-red-500">฿{item.price.toFixed(2)}</span>
                            </div>
                            <p className="text-gray-600 mb-3">{item.description}</p>
                            <div className="flex justify-between items-center">
                                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">{item.category?.name}</span>
                                <div className="space-x-2">
                                    <button 
                                        onClick={() => setEditingItem(item)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => hdlDelete(item.id)}
                                        className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {editingItem && (
                <MenuEditForm
                    item={editingItem} 
                    onClose={() => setEditingItem(null)} 
                />
            )}
        </div>
    )
}

export default Menu