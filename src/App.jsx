import { Outlet } from "react-router-dom";
import Header from "./Components/Header";
import Login from "./Pages/Login";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    <div className="App min-h-screen bg-red-100">
      <Header />
      <main className="container mx-auto p-8">
        <Outlet />
      </main>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;