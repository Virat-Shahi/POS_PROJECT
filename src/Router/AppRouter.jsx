import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';

import TableManagement from '../Table/TableManagement';
import Dashboard from '../Dashboard';
import TableOrder from '../Table/TableOrder';
import Menu from '../Menu/Menu';
import OrderHistory from '../Order/OrderHistory';
import Login from '../Pages/Login';
import App from '../App';
import Register from '../Pages/Register';
import useUserStore from '../Store/userStore';

const ProtectedRoute = () => {
    const user = useUserStore((state) => state.user);
    console.log('user', user);
    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

const AppRouter = () => {
    const router = createBrowserRouter([
        {
            path: '/login',
            element: <Login />,
        },
        {
            path: '/register',
            element: <Register />,
        },
        {
            path: '/',
            element: <ProtectedRoute />,
            children: [
                {
                    element: <App />,
                    children: [
                        { index: true, element: <TableManagement /> },
                        { path: 'dashboard', element: <Dashboard /> },
                        { path: 'table/:tableId', element: <TableOrder /> },
                        { path: 'menu', element: <Menu /> },
                        { path: 'order-history', element: <OrderHistory /> },
                    ]
                }
            ]
        },
        {
            path: '*',
            element: <Navigate to="/" replace />
        }
    ]);

    return <RouterProvider router={router} />;
}

export default AppRouter;