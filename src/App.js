import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import Dashboard from "./pages/Dashboard/Dashboard";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./components/ProtectedRoute";
import Signup from "./pages/Signup/Signup";
import Add from "./pages/Add/Add";
import Exchange from "./pages/Exchange/Exchange";
import Hearts from "./pages/Hearts/Hearts";
import Account from "./pages/Account/Account";
import Redeem from "./pages/Redeem/Redeem";
import Layout from "./components/Layout";
import "./App.scss";

const App = () => (
    <BrowserRouter>
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/hearts"
                    element={
                        <ProtectedRoute>
                            <Hearts />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/add"
                    element={
                        <ProtectedRoute>
                            <Add />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/exchange"
                    element={
                        <ProtectedRoute>
                            <Exchange />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/account"
                    element={
                        <ProtectedRoute>
                            <Account />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/redeem"
                    element={
                        <ProtectedRoute name="redeem">
                            <Redeem />
                        </ProtectedRoute>
                    }
                />
            </Route>
        </Routes>
    </BrowserRouter>
);

export default App;
