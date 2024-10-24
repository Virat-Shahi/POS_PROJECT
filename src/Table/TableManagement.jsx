
// export default TableManagement;
import React, { useEffect } from 'react';
import tableStore from '../Store/tableStore';
import { TableIcon, Guests } from '../Icons/icon';
import { Link } from 'react-router-dom';
// import orderStore from '../Store/orderStore';

const TableManagement = () => {
    const tables = tableStore((state) => state.tables);
    const actionGetTables = tableStore((state) => state.actionGetTables);
    // const resetOrder = orderStore((state) => state.resetOrder);
    
    useEffect(() => {
        actionGetTables();
    }, []);

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-4xl font-bold mb-8 text-gray-800">Table Management</h1>
            <div className="flex flex-wrap -mx-3">
                {tables.map((table) => (
                    <Link
                        key={table.id}
                        to={`/table/${table.id}`}
                        className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-3 mb-6"
                    >
                        <div className={`flex flex-col items-center justify-center p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer ${table.isOccupied ? 'bg-red-100' : 'bg-green-100'}`}>
                            <TableIcon width="120" height="120" />
                            <div className="mt-4 text-center">
                                <span className="text-2xl font-bold">Table {table.id}</span>
                                <div className="flex items-center justify-center mt-2">
                                    <span className="text-2xl mr-2">{table.capacity}</span>
                                    <Guests width="40" height="50" />
                                </div>
                                <p className={`mt-2 text-3xl font-bold ${table.isOccupied ? 'text-red-600' : 'text-green-600'}`}>
                                    {table.isOccupied ? 'Occupied' : 'Available'}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default TableManagement;
