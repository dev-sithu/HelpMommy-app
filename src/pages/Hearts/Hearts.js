import Header from "../../components/Header/Header";
import Navbar from "../../components/Navbar/Navbar";
import ListCard from "../../components/ListCard/ListCard";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {Card, CardContent, Typography} from "@mui/material";
import {getItemDecrypted} from "../../helpers/storage";
import Loading from "../../components/Loading";
import NoHeart from "../../components/NoHeart/NoHeart";
import {getConfig} from "../../helpers/common";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetchUserJobs} from "../../state/user/userJobsSlice";
import {fetchUserRatings} from "../../state/user/userRatingsSlice";
import {useAccountData} from "../../hooks/useAccountData";

const Hearts = () => {
    const config = getConfig();
    const user = getItemDecrypted(config.userStoreKey);
    const { jobs: allJobs, loading } = useSelector(state => state.userJobs);
    const { ratings, totalHearts, amount } = useSelector(state => state.userRatings);
    const dispatch = useDispatch();

    useAccountData();

    useEffect(() => {
        if (user) {
            dispatch(fetchUserRatings(user.id));
            dispatch(fetchUserJobs(user.id));
        }
    }, []);

    return (
        <>
            {loading && <Loading/>}
            <Header title="အသည်းရရှိမှုမှတ်တမ်း" customClass="my"/>
            <div className="container">
                { totalHearts ?
                    <Card>
                        <CardContent>
                            <Typography variant="h6" component="div">
                                <span className="my">အသည်းစုစုပေါင်း</span> {totalHearts}<FavoriteIcon/>
                            </Typography>
                            <Typography variant="body1" className="mt-1">
                                <span className="my">တန်ဖိုးငွေ</span> <strong>{amount.toLocaleString()} {config.currencyUnit}</strong>
                            </Typography>
                        </CardContent>
                    </Card>
                    : ""
                }
                { allJobs.length ?
                    allJobs.map(([key, value]) => <ListCard key={key} title={key} hearts={ratings[key]?.ratings} jobs={value} />)
                    :
                    !loading && <NoHeart msg="နောက်ဆုံး (၇)ရက်အတွင်း သင် အသည်းမရရှိခဲ့ပါ။" />
                }
            </div>
            <Navbar/>
        </>
    );
};

export default Hearts;
