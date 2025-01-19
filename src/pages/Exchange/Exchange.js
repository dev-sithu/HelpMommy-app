import Header from "../../components/Header/Header";
import Navbar from "../../components/Navbar/Navbar";
import Error from "../../components/Error";
import {Button, Card, CardContent, TextField, Typography} from "@mui/material";
import {useForm} from "react-hook-form";
import {useEffect} from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import WalletIcon from "@mui/icons-material/Wallet";
import {getItemDecrypted} from "../../helpers/storage";
import {toast} from "react-toastify";
import {getConfig} from "../../helpers/common";
import NoHeart from "../../components/NoHeart/NoHeart";
import Loading from "../../components/Loading";
import {useDispatch, useSelector} from "react-redux";
import {fetchUserRatings} from "../../state/user/userRatingsSlice";
import {exchange, setBalanceAmount, setBalanceHearts} from "../../state/user/exchangeSlice";
import {exchangeAmount} from "../../state/store";
import {useAccountData} from "../../hooks/useAccountData";

// eslint-disable-next-line
const Exchange = () => {
    const config = getConfig();
    const user = getItemDecrypted(config.userStoreKey);
    const { totalHearts, amount, loading } = useSelector(state => state.userRatings);
    const { balanceHearts, balanceAmount, amountReceived, loading: saveLoading } = useSelector(state => state.exchange);
    const dispatch = useDispatch();

    const {
        register,
        setError,
        formState: {errors},
        handleSubmit,
        reset
    } = useForm();

    useAccountData();

    useEffect(() => {
        if (user) {
            dispatch(fetchUserRatings(user.id)).then(() => {
                dispatch(setBalanceHearts(totalHearts));
                dispatch(setBalanceAmount(amount));
            });
        }
    }, [totalHearts, amount]);

    const onSubmit = async data => {
        dispatch(exchange({ id: user.id, data })).then(response => {
            const { result, error } = response.payload;
            if (result && result.data.id) {
                reset();
                toast.success(`Congrats! You got ${data.hearts * config.exchangeRate} ${config.currencyUnit}.`, config.toastOptions);
            } else if (error) {
                error.map(err => setError(err.field, {type: "custom", message: err.message}));
            }
        });
    };

    return (
        <>
            {(loading || saveLoading) && <Loading/>}
            <Header title="အသည်းနှင့်မုန့်ဖိုးလဲလှယ်ရန်" customClass="my"/>
            <div className="container">
                {!loading ?
                    <>
                        <Card className="mb-2">
                            <CardContent>
                                <Typography variant="subtitle1" component="div">
                                    <FavoriteIcon/> <span className="my">အသည်းလက်ကျန်စုစုပေါင်း <strong>{balanceHearts} ခု</strong></span>
                                </Typography>
                                <Typography variant="subtitle1" component="div">
                                    <WalletIcon/> <span className="my">တန်ဖိုးငွေ</span> <strong>{balanceAmount.toLocaleString()} {config.currencyUnit}</strong>
                                </Typography>
                            </CardContent>
                        </Card>
                        { totalHearts >= config.minHeart ?
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="form-control">
                                    <div className="label paragraph my">မုန့်ဖိုးနှင့်လဲမည့်အသည်းအရေအတွက်ထည့်ရန်</div>
                                    <Error field={errors.hearts}/>
                                    <TextField label="No. of Hearts to be exchanged"
                                               {...register("hearts", {
                                                   required: "မုန့်ဖိုးနှင့်လဲမည့်အသည်းအရေအတွက်ကိုထည့်ပေးပါ",
                                                   min: {
                                                       value: config.minHeart,
                                                       message: `အနည်းဆုံး အသည်းအခု ${config.minHeart} ထည့်ရန်လိုပါသည်`
                                                   },
                                                   max: {
                                                       value: totalHearts,
                                                       message: `အများဆုံး အသည်း ${totalHearts} ခုပဲ လဲလို့ရပါမည်`
                                                   },
                                               })}
                                               inputProps={{
                                                   type: "number",
                                                   inputMode: "numeric",
                                                   pattern: "[0-9]*",
                                                   autoFocus: true
                                               }}
                                               required fullWidth id="outlined-name" variant="outlined"
                                               onChange={e => dispatch(exchangeAmount(e.target.value))}
                                    />
                                </div>
                                <div className="form-control">
                                    <div className="label paragraph my">ရရှိမည့်မုန့်ဖိုး</div>
                                    <Typography variant="h5" component="div">
                                        {(amountReceived).toLocaleString()} {config.currencyUnit}
                                    </Typography>
                                </div>
                                <div className="form-control">
                                    <div className="label paragraph my">မှတ်ချက်</div>
                                    <TextField label="Remarks"
                                               {...register("remarks")}
                                               multiline fullWidth rows={2}/>
                                </div>
                                <div className="form-control">
                                    <Button onClick={handleSubmit(onSubmit)}
                                            disabled={loading}
                                            className="margin-button"
                                            variant="contained"
                                            size="large"
                                            fullWidth={true}>
                                        <span className="my">လဲမယ်</span>
                                    </Button>
                                </div>
                            </form>
                            :
                            <NoHeart msg={`အနည်းဆုံး အသည်း (${config.minHeart})ခု ရှိရန်လိုပါသည်။`} />
                        }
                    </>
                    : ""
                }
            </div>
            <Navbar/>
        </>
    );
};

export default Exchange;
