import {ToastContainer} from "react-toastify";
import {Outlet, useNavigate} from "react-router-dom";
import {getItemDecrypted, removeItem} from "../helpers/storage";
import config from "../config";
import {useDispatch} from "react-redux";
import {useEffect} from "react";
import {userAccount} from "../state/user/userSlice";
import {fetchSettings} from "../state/setting/settingSlice";

const Layout = () => {
    const user = getItemDecrypted(config.userStoreKey);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchSettings());
        if (user) {
            dispatch(userAccount(user.account_id)).then(response => {
                const { error } = response.payload;
                if (error && (error.status === 401 || error.status === 403)) {
                    removeItem(config.userStoreKey);
                    navigate("/login");
                }
            });
        }
    }, [user, navigate]);

    return (
        <div className="app">
            <ToastContainer/>
            <Outlet/>
        </div>
    );
};

export default Layout;
