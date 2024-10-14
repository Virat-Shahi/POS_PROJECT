import { Outlet } from "react-router-dom";
import Header from "./Components/Header";
import Login from "./Pages/Login";

function App() {
  return (
    <div className="App min-h-screen bg-red-100">
      <Header />
      <main className="container mx-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default App;