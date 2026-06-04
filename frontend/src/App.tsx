import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Members from "./pages/Members";
import Borrow from "./pages/Borrow";
import Returns from "./pages/Returns";
import { ToastContainer } from "react-toastify";

import "./App.css";

function App() {
    return (
        <BrowserRouter>

            <nav className="navbar navbar-expand-lg navbar-custom p-3">

                <Link to="/">Dashboard</Link>

                <Link to="/books">Books</Link>

                <Link to="/members">Members</Link>

                <Link to="/borrow">Borrow</Link>
                <Link to="/returns">Borrow History</Link>

            </nav>

            <Routes>

                <Route
                    path="/"
                    element={<Dashboard />}
                />

                <Route
                    path="/books"
                    element={<Books />}
                />

                <Route
                    path="/members"
                    element={<Members />}
                />

                <Route
                    path="/borrow"
                    element={<Borrow />}
                />

                <Route
                    path="/returns"
                    element={<Returns />}
                />

            </Routes>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
            />
        </BrowserRouter>
    );
}

export default App;