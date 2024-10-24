import React, { useEffect, useState } from 'react'
import orderStore from './Store/orderStore'
import useUserStore from './Store/userStore'
import tableStore from './Store/tableStore'
import {format } from 'date-fns'
const Dashboard = () => {
    const [orders,setOrders] = useState([])
    const getOrders = orderStore((state) => state.getOrders)
    const token = useUserStore((state) => state.token)
    const tables = tableStore((state) => state.tables)
    const fetchTables = tableStore((state) => state.actionGetTables)


    useEffect(() => {
        const fetchData = async () => {
            try {
                const ordersData = await getOrders(token)
                setOrders(ordersData)  
                console.log(ordersData)
                // Fetch Latest tables Data
                await fetchTables()
            } catch (error) {
                console.log("Error fetching dashboard Data:", error)
            }
        }
        fetchData();

    },[getOrders,fetchTables,token])


    // Calculate Summary Metrics with null checks
const totalRevenue = orders.reduce((total, order) => total + (order.totalAmount || 0), 0);
const averageOrder = orders.length > 0 ? orders.reduce((total, order)=> total + (order.totalAmount || 0), 0) / orders.length : 0
const totalOrders = orders.length
const totalTables = tables.length
const occupiedTables = tables.filter(table => table.isOccupied).length
    return (
        <div className='p-6'>
            <h1 className='text-3xl font-bold text-red-800 mb-6'>Dashboard</h1>

            {/* {SUMMARY CARDS} */}
            <div className="flex flex-wrap gap-4 mb-8">
                <div className="w-full md:w-[calc(50%-8px)] lg:w-[calc(25%-12px)] bg-white p-6 rounded-lg shadow-md border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
                    <p className="text-2xl font-bold text-red-600 mt-2">฿{totalRevenue.toFixed(2)}</p>
                </div>

                <div className="w-full md:w-[calc(50%-8px)] lg:w-[calc(25%-12px)] bg-white p-6 rounded-lg shadow-md border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Average Order</h3>
                    <p className="text-2xl font-bold text-red-600 mt-2">฿{averageOrder.toFixed(2)}</p>
                </div>

                <div className="w-full md:w-[calc(50%-8px)] lg:w-[calc(25%-12px)] bg-white p-6 rounded-lg shadow-md border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
                    <p className="text-2xl font-bold text-red-600 mt-2">{totalOrders}</p>
                </div>

                <div className="w-full md:w-[calc(50%-8px)] lg:w-[calc(25%-12px)] bg-white p-6 rounded-lg shadow-md border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Tables Status</h3>
                    <p className="text-2xl font-bold text-red-600 mt-2">
                        {occupiedTables} / {totalTables}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Tables Occupied</p>
                </div>
            </div>

            <div>
                <div className="bg-white rounded-lg shadow-md border border-gray-100 mb-8">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800">Tables Status</h2>
                    </div>
                    <div className="p-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">

                        {tables.map ((table)=> (
                            <div key={table.id}
                                className={`p-4 rounded-lg border ${table.isOccupied
                                        ? 'bg-red-50 border-red-200'
                                        : 'bg-green-50 border-green-200'
                                    }`}
                            >
                                <p className='text-lg font-semibold'>Table {table.id}</p>
                                <p className={`text-sm ${table.isOccupied
                                        ? 'text-red-600'
                                        : 'text-green-600'
                                    }`}>
                                    {table.isOccupied ? 'Occupied' : 'Available'}
                                </p>

                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-lg shadow-md border border-gray-100">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
                    </div>
                    <div className="overflow-x-auto">
                        {orders.length > 0 ? (
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="text-left p-4 text-sm font-medium text-gray-500">Order ID</th>
                                        <th className="text-left p-4 text-sm font-medium text-gray-500">Date</th>
                                        <th className="text-left p-4 text-sm font-medium text-gray-500">Table</th>
                                        <th className="text-right p-4 text-sm font-medium text-gray-500">Amount</th>
                                        <th className="text-right p-4 text-sm font-medium text-gray-500">Status</th>
                                        <th className="text-right p-4 text-sm font-medium text-gray-500">Items</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {orders
                                    .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)) // Sort by newest first
                                    .slice(0, 5)
                                    .map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50">
                                            <td className="p-4">#{order.id}</td>
                                            <td className="p-4">{format(new Date(order.orderDate), 'MMM dd, yyyy HH:mm')}</td>
                                            <td className="p-4">Table {order.table.id}</td>
                                            <td className="p-4 text-right font-medium">฿{order.totalAmount.toFixed(2)}</td>
                                            <td className="p-4 text-right">
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${order.payment?.status === 'COMPLETED'
                                                        ? 'bg-green-100 text-green-600'
                                                        : 'bg-red-100 text-red-600'
                                                    }`}>
                                                    {order.payment?.status === 'COMPLETED' ? 'PAID' : 'PENDING'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right text-gray-500">
                                                {order.orderItems.length || 0} items
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                No recent orders available
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
