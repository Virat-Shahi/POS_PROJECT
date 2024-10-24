import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../Pictures/Logo.png';
import useUserStore from '../Store/userStore';
const Header = () => {
    const actionLogout = useUserStore((state) => state.actionLogout);
    const navigate = useNavigate();

    const handleLogout = () => {
        actionLogout();
        console.log('Logout clicked');
        navigate('/login');
    };

    return (
        <header className="bg-red-800 text-white shadow-md">
            <div className="container mx-auto px-6 py-5 flex justify-between items-center">
                {/* Logo image */}
                <img src={Logo} alt="Logo" className="h-20 w-30" />
                <nav>
                    <ul className="flex space-x-8 text-2xl font-medium">
                        <li>
                            <Link 
                                to="/" 
                                className="px-4 py-2 text-white rounded-md hover:bg-red-600 hover:shadow-lg transition-all duration-300"
                            >
                                Tables
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/menu" 
                                className="px-4 py-2 text-white rounded-md hover:bg-red-600 hover:shadow-lg transition-all duration-300"
                            >
                                Menu
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/order-history" 
                                className="px-4 py-2 text-white rounded-md hover:bg-red-600 hover:shadow-lg transition-all duration-300"
                            >
                                Order History
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/dashboard" 
                                className="px-4 py-2 text-white rounded-md hover:bg-red-600 hover:shadow-lg transition-all duration-300"
                            >
                                Dashboard
                            </Link>
                        </li>
                    </ul>
                </nav>
                <button
                    onClick={handleLogout}
                    className="bg-white text-black font-bold py-2 px-4 rounded-md hover:bg-gray-200 hover:shadow-lg transition-all duration-300"
                >
                    Logout
                </button>
            </div>
        </header>
    );
};

export default Header;
