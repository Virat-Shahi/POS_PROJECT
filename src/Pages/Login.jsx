import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../Pictures/Logo.png';
import useUserStore from '../Store/userStore';



const Login = () => {
    const navigate = useNavigate()
    const actionLogin = useUserStore((state) => state.actionLogin);
    const [input, setInput] = useState({
        email: '',
        password: '',
    })



    const handleChange = (e) => {
        console.log(e.target.name, e.target.value)
        setInput({
            ...input,
            [e.target.name]: e.target.value
        })
    }



    const hdlLogin = async (e) => {
            e.preventDefault();
            await actionLogin(input)
            navigate('/')
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-red-800">
            <div className="bg-white p-8 rounded-lg shadow-md w-96 flex flex-col items-center">
                {/* Logo centered above the login heading */}
                <img src={Logo} alt="Logo" className="h-20 w-auto mb-4" />
                <h2 className="text-3xl font-bold mb-6 text-center text-red-600">Login</h2>
                <form onSubmit={hdlLogin} className="w-full">
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
                            Email or Username
                        </label>
                        <input
                            onChange={handleChange}
                            type="text"
                            name="email"
                            value={input.email}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Enter your Username or Email"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                            Password
                        </label>
                        <input
                            onChange={handleChange}
                            type="password"
                            name="password"
                            value={input.password}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Enter your password"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                        >
                            Sign In
                        </button>
                    </div>
                </form>
                {/* <p className="mt-4 text-center text-sm text-gray-600">
                    Don't have an account? <Link to="/register" className="text-red-500 hover:underline">Register here</Link>
                </p> */}
            </div>
        </div>
    );
};

export default Login;