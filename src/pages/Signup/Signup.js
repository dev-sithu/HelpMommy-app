import {useForm} from "react-hook-form";
import {Button, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {Link, useNavigate} from "react-router-dom";
import Loading from "../../components/Loading";
import Error from "../../components/Error";
import {useDispatch, useSelector} from "react-redux";
import {togglePassword, userRegister} from "../../state/user/userSlice";

// eslint-disable-next-line
const Signup = () => {
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
        dispatch(userRegister(data)).then(result => {
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
                    <HowToRegIcon fontSize="large" className="rounded-icon icon-primary"/>
                </div>
                <h2 className="text-center">Create an Account</h2>
                <div className="form-control">
                    <Error field={errors.username} />
                    <TextField {...register("username", {required: "Enter a login username."})}
                        id="outlined-username" label="Login Username" variant="outlined" required fullWidth autoComplete="off" />
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
                    <Error field={errors.email} />
                    <TextField {...register("email", {required: "Enter an email address."})}
                               id="outlined-email" label="Email Address" variant="outlined" required fullWidth autoComplete="off" />
                </div>
                <div className="form-control">
                    <Button onClick={handleSubmit(onSubmit)} disabled={loading}
                        className="margin-button" variant="contained" size="large" fullWidth={true}>
                        <span className="my">အကောင့်ပြုလုပ်ရန်</span>
                    </Button>
                </div>
                <div className="text-center">
                    <Link to="/login" className="my">အကောင့်ရှိပြီးသားလား? အကောင့်ဝင်ရန်</Link>
                </div>
            </div>
        </>
    );
};

export default Signup;
