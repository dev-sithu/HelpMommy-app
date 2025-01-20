import {useEffect} from "react";
import {fetchSettings} from "../state/setting/settingSlice";
import {userAccount, userRefreshToken} from "../state/user/userSlice";
import {getItem, getItemDecrypted, removeItem} from "../helpers/storage";
import config from "../config";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";

export const useClearAccountData = () => {
    removeItem(config.userStoreKey);
    removeItem(`${config.storePrefix}key`);
    removeItem(`${config.storePrefix}token`);
};

export const useAccountData = () => {
    const user = getItemDecrypted(config.userStoreKey);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Layout useEffect - Start");

        dispatch(fetchSettings());

        if (user) {
            const fetchAccountData = async () => {
                const response = await dispatch(userAccount(user.account_id));
                const {error} = response.payload;

                if (error) {
                    console.log(error.status);
                    if (error.status === 401) {
                        console.log("auth failed");
                        useClearAccountData();
                        navigate("/login");
                    } else if (error.status === 403 && getItem(`${config.storePrefix}key`)) {
                        console.log("trying refresh token");
                        // try to re-authenticate
                        const res = await dispatch(userRefreshToken());
                        const {error: err} = res.payload;
                        if (err) {
                            console.log("refresh token failed");
                            useClearAccountData();
                            navigate("/login");
                        }
                    }
                }
            };

            fetchAccountData().then(() => console.log("Layout useEffect - End"));
        }
    }, []);
};
