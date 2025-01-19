import {ToastContainer} from "react-toastify";
import {Outlet} from "react-router-dom";

const Layout = () => (
    <div className="app">
        <ToastContainer/>
        <Outlet/>
    </div>
);

export default Layout;
