import {useForm} from "react-hook-form";
import {Link, useNavigate} from "react-router-dom";
import {Button, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import LoginIcon from "@mui/icons-material/Login";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import Error from "../../components/Error";
import Loading from "../../components/Loading";
import {useDispatch, useSelector} from "react-redux";
import {togglePassword, userLogin} from "../../state/user/userSlice";

const Login = () => {
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

    const handleClickShowPassword = () => dispatch(togglePassword(!visiblePassword));

    const handleMouseDownPassword = e => e.preventDefault();

    const onSubmit = async data => {
        dispatch(userLogin(data)).then(result => {
            const { error } = result.payload;
            if (error) {
                error.map(err => setError(err.field, {type: "custom", message: err.message}));
            } else {
                navigate("/dashboard");
            }
        });
    };

    return (
        <>
            {loading && <Loading/>}
            <div className="container">
                <div className="text-center">
                    <LoginIcon fontSize="large" className="rounded-icon icon-primary"/>
                </div>
                <h2 className="text-center">Login</h2>
                <div className="form-control">
                    <Error field={errors.username} />
                    <TextField {...register("username", {required: "Enter username."})}
                        id="outlined-username" label="Username" variant="outlined" required fullWidth />
                </div>
                <div className="form-control">
                    <Error field={errors.password} />
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel htmlFor="outlined-password">Password</InputLabel>
                        <OutlinedInput
                            {...register("password", {required: "Enter a password with min 8 characters."})}
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
                </div>
                <div className="form-control">
                    <Button onClick={handleSubmit(onSubmit)}
                        className="margin-button" variant="contained" size="large" fullWidth={true}>
                        <span className="my">အကောင့်ဝင်ရန်</span>
                    </Button>
                </div>
                {/*<div className="text-center">*/}
                {/*    <Link to="/signup" className="my">အကောင့်မရှိသေးရင် အကောင့်အသစ်ဖွင့်ရန်</Link>*/}
                {/*</div>*/}
            </div>
        </>
    );
};

export default Login;

