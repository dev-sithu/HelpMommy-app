import Header from "../../components/Header/Header";
import Navbar from "../../components/Navbar/Navbar";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {Button} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import HeartBrokenIcon from "@mui/icons-material/HeartBroken";
import {Link} from "react-router-dom";
import "./Dashboard.scss";
import {getItemDecrypted} from "../../helpers/storage";
import Loading from "../../components/Loading";
import NoHeart from "../../components/NoHeart/NoHeart";
import WalletIcon from "@mui/icons-material/Wallet";
import TrialWarning from "../../components/TrialWarning";
import {getConfig} from "../../helpers/common";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetchUserTodayJobs} from "../../state/user/userJobsSlice";
import {fetchUserRatings} from "../../state/user/userRatingsSlice";
import {useAccountData} from "../../hooks/useAccountData";

const Dashboard = () => {
    const config = getConfig();
    const user = getItemDecrypted(config.userStoreKey);
    const loadingUser = useSelector(state => state.user.loading);
    const { todayJobs, loading: loadingJobs } = useSelector(state => state.userJobs);
    const { totalHearts, todayHearts, amount, loading: loadingRatings } = useSelector(state => state.userRatings);
    const dispatch = useDispatch();

    useAccountData();

    useEffect(() => {
        if (user) {
            dispatch(fetchUserTodayJobs(user.id));
            dispatch(fetchUserRatings(user.id));
        }
    }, []);

    const isLoading = loadingUser || loadingJobs || loadingRatings;

    return (
        <>
            {isLoading && <Loading/>}
            <Header title="Help Mommy"/>
            <div className="container">
                { user &&
                    <div>
                        <TrialWarning user={user}/>
                        <div className="card">
                            <div className="user-name">Welcome {user.full_name}</div>
                            {!isLoading ?
                                <div>
                                    <div className="user-hearts">
                                        <FavoriteIcon/>
                                        <strong>{totalHearts} heart{totalHearts > 1 ? "s " : " "}</strong>
                                    </div>
                                    <div className="user-hearts">
                                        <WalletIcon/>
                                        {amount.toLocaleString()} {config.currencyUnit}
                                    </div>
                                </div>
                                : ""
                            }
                            <Button variant="outlined" size="small" component={Link} to="/add"
                                    startIcon={<AddCircleOutlineIcon/>}>
                                Add Hearts
                            </Button>
                        </div>
                    </div>
                }
                {todayJobs.length ?
                    <div className="card">
                        <h4 className="margin-top-none">
                            {todayHearts} heart{todayHearts > 1 ? "s " : " "}
                            ({ (todayHearts * config.exchangeRate).toLocaleString() } { config.currencyUnit }) earned today
                        </h4>
                        <ul className="list">
                        {todayJobs.map(job => (
                            <li key={job.id}>
                                <span className="list-item">
                                    <span>{job.name}</span>
                                    <span>{job.rating} { job.rating > 0 ? <FavoriteIcon/> : <HeartBrokenIcon/> }</span>
                                </span>
                            </li>
                        ))}
                        </ul>
                    </div>
                    :
                    !isLoading && <NoHeart msg="ဒီနေ့ သင် အသည်းမရရှိသေးပါ။" />
                }
            </div>
            <Navbar/>
        </>
    );
};

export default Dashboard;
