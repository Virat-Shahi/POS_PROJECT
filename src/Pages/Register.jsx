import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import useUserStore from '../Store/userStore';

const Register = () => {
    const actionRegister = useUserStore((state) => state.actionRegister);
    const [input, setInput] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    })
    const clearInput = {
        email: '',
        password: '',
        confirmPassword: '',
    }

    const hdlChange = (e) => {
        console.log(e.target.name, e.target.value)
        setInput({...input,[e.target.name]:e.target.value})
    }

    const hdlRegister = (e) => {
        e.preventDefault()
        actionRegister(input)
        setInput(clearInput)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-red-800">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-3xl font-bold mb-6 text-center text-red-600">Register</h2>
                <form onSubmit={hdlRegister}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                            Email
                        </label>
                        <input
                            onChange={hdlChange}
                            type="email"
                            name="email"
                            value={input.email}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                            Password
                        </label>
                        <input
                            onChange={hdlChange}
                            type="password"
                            name="password"
                            value={input.password}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Enter your password"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
                            Confirm Password
                        </label>
                        <input
                            onChange={hdlChange}
                            type="password"
                            name="confirmPassword"
                            value={input.confirmPassword}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Confirm your password"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                        >
                            Register
                        </button>
                    </div>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account? <Link to="/login" className="text-red-500 hover:underline">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
