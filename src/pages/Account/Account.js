import Header from "../../components/Header/Header";
import Navbar from "../../components/Navbar/Navbar";
import Error from "../../components/Error";
import {Alert, Button, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField} from "@mui/material";
import {useForm} from "react-hook-form";
import FormControl from "@mui/material/FormControl";
import {Lock, Visibility, VisibilityOff} from "@mui/icons-material";
import {getItemDecrypted} from "../../helpers/storage";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import {getConfig} from "../../helpers/common";
import Loading from "../../components/Loading";
import TrialWarning from "../../components/TrialWarning";
import {useDispatch, useSelector} from "react-redux";
import {togglePassword, userUpdate} from "../../state/user/userSlice";
import {useAccountData, useClearAccountData} from "../../hooks/useAccountData";

// eslint-disable-next-line
const Account = () => {
    const config = getConfig();
    const user = getItemDecrypted(config.userStoreKey);
    const navigate = useNavigate();
    const loading = useSelector(state => state.user.loading);
    const visiblePassword = useSelector(state => state.user.visiblePassword);
    const dispatch = useDispatch();
    const {
        register,
        setError,
        formState: {errors},
        handleSubmit
    } = useForm();

    useAccountData();

    const handleClickShowPassword = () => dispatch(togglePassword(!visiblePassword));

    const handleMouseDownPassword = e => e.preventDefault();

    const onSubmit = async data => {
        dispatch(userUpdate({ id: user.id, data })).then(response => {
            const { result, error } = response.payload;
            if (error) {
                error.map(err => setError(err.field, {type: "custom", message: err.message}));
            } else {
                if (result && result.data.id) {
                    toast.success("အကောင့်အချက်အလက်ကိုပြင်ပြီးပါပြီ", config.toastOptions);
                }
            }
        });
    };

    const logout = () => {
        useClearAccountData();
        navigate("/login");
    };

    return (
        <>
            {loading && <Loading/>}
            <Header title="အကောင့်အချက်အလက်ပြင်ရန်" customClass="my"/>
            { user &&
                <div className="container">
                    <TrialWarning user={user}/>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-control mb-2  text-right">
                            Account ID: <strong>{user.account_id}</strong>
                        </div>
                        <div className="form-control">
                            <Error field={errors.name} />
                            <TextField {...register("name", {required: "အမည်အပြည့်အစုံဖြည့်ပေးပါ"})}
                                       required fullWidth
                                       id="outlined-name" label="Full Name" variant="outlined"
                                       defaultValue={user.full_name} />
                        </div>

                        <Alert severity="info" icon={<Lock fontSize="inherit" />}>Login Information Below</Alert>

                        <div className="form-control">
                            <Error field={errors.username} />
                            <TextField {...register("username", {required: "username ကို ဖြည့်ပေးပါ"})}
                                       required fullWidth
                                       id="outlined-username" label="Username" variant="outlined" autoComplete="off"
                                       defaultValue={user.username} />
                        </div>
                        <div className="form-control">
                            <Error field={errors.password} />
                            <FormControl variant="outlined" fullWidth>
                                <InputLabel htmlFor="outlined-password">Password</InputLabel>
                                <OutlinedInput
                                    {...register("password", {
                                        minLength: {
                                            value: 8,
                                            message: "အနည်းဆုံးစာလုံးရေ(၈)လုံးရိုက်ထည့်ပေးပါ"
                                        }
                                    })}
                                    id="outlined-password" label="Password" required
                                    type={visiblePassword ? "text" : "password"}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {visiblePassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                            <small className="tip my">(Password အသစ်ပြောင်းချင်မှသာ ရိုက်ထည့်ရန်)</small>
                        </div>
                        <div className="form-control">
                            <Button onClick={handleSubmit(onSubmit)}
                                    disabled={loading}
                                    className="margin-button"
                                    variant="contained"
                                    size="large"
                                    fullWidth={true}>
                                <span className="my">ပြင်မယ်</span>
                            </Button>
                        </div>
                    </form>
                    <p className="text-center">
                        <a href="#" className="my" onClick={logout}>ထွက်မယ်</a>
                    </p>
                </div>
            }
            <Navbar />
        </>
    );
};

export default Account;
