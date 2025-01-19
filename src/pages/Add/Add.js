import {useEffect} from "react";
import {Controller, useForm} from "react-hook-form";
import {Box, Button, FormControl, TextField} from "@mui/material";
import Autocomplete, {autocompleteClasses} from "@mui/material/Autocomplete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import HeartBrokenIcon from "@mui/icons-material/HeartBroken";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import Header from "../../components/Header/Header";
import Navbar from "../../components/Navbar/Navbar";
import Error from "../../components/Error";
import Loading from "../../components/Loading";
import dayjs from "dayjs";
import {useDispatch, useSelector} from "react-redux";
import {changeJobAutocompleteKey, fetchJobs, saveJob, setJobDate} from "../../state/job/jobSlice";
import {getConfig} from "../../helpers/common";
import {getItemDecrypted} from "../../helpers/storage";
import {toast} from "react-toastify";
import {useAccountData} from "../../hooks/useAccountData";

const Add = () => {
    const config = getConfig();
    const user = getItemDecrypted(config.userStoreKey);
    const { loading, jobs, jobAutocompleteKey, date } = useSelector(state => state.job);
    const dispatch = useDispatch();
    const {
        register,
        control,
        setError,
        formState: {errors},
        handleSubmit
    } = useForm();
    const today = dayjs();

    useAccountData();

    useEffect(() => {
        dispatch(fetchJobs());
    }, []);

    const onSubmit = async data => {
        dispatch(saveJob({
            id: user.id,
            data
        })).then(response => {
            const { result, error } = response.payload;
            if (result && result.data.id) {
                const { rating } = result.data;
                if (rating > 0) {
                    toast.success(`Congrats! You got ${rating} hearts.`, config.toastOptions);
                } else {
                    toast.error(`Oops! You lost ${Math.abs(rating)} hearts.`, config.toastOptions);
                }

                dispatch(changeJobAutocompleteKey());
            } else if (error) {
                error.map(err => setError(err.field, { type: "custom", message: err.message }));
            }
        });
    };

    return (
        <>
            {loading && <Loading/>}
            <Header title="အသည်းရယူရန်" customClass="my"/>
            <div className="container">
            { jobs ?
                <form onSubmit={handleSubmit(onSubmit)}>
                    <p className="my">အမေ့ကိုကူညီခဲ့တဲ့အလုပ်ကိုရွေးထည့်ပြီး <FavoriteIcon/> ရယူပါ</p>
                    <div className="form-control">
                        <Error field={errors.job_id} />
                        <FormControl fullWidth>
                            <Controller
                                name="job_id"
                                control={control}
                                rules={{ required: "အလုပ်တစ်ခုကိုရွေးပေးပါ" }}
                                render={({ field }) => {
                                    const { onChange } = field;
                                    return (
                                        <Autocomplete
                                            id="job-select"
                                            key={jobAutocompleteKey}
                                            options={jobs}
                                            autoHighlight
                                            getOptionLabel={option => option.name}
                                            renderOption={(props, option) => {
                                                const { key, ...otherProps } = props; // to solve Warning: A props object containing a "key" prop is being spread into JSX: React keys must be passed directly to JSX without using spread:
                                                return (
                                                    <Box sx={{
                                                            borderRadius: "5px",
                                                            margin: "5px",
                                                            [`&.${autocompleteClasses.option}`]: {
                                                                display: "flex",
                                                                justifyContent: "space-between",
                                                                padding: "8px",
                                                            },
                                                        }}
                                                         component="li"
                                                         key={key}
                                                         {...otherProps}>
                                                        <span className="my">{option.name}</span>
                                                        <span className="hearts">
                                                        {
                                                            [...Array(Math.abs(option.rating))].map((x, i) => {
                                                                if (option.rating > 0) {
                                                                    return <FavoriteIcon key={i}/>;
                                                                } else {
                                                                    return <HeartBrokenIcon key={i}/>;
                                                                }
                                                            })
                                                        }
                                                        </span>
                                                    </Box>
                                                );
                                            }}
                                            renderInput={params => (
                                                <TextField
                                                    {...params}
                                                    label="Job"
                                                    inputProps={{
                                                        ...params.inputProps,
                                                        autoComplete: "off" // disable autocomplete and autofill
                                                    }}
                                                />
                                            )}
                                            onChange={(event, data) => {
                                                onChange(data ? data.id : null);
                                            }}
                                        />
                                    );
                                }}
                            />
                        </FormControl>
                    </div>
                    <div className="form-control">
                        <Error field={errors.activity_date} />
                        <LocalizationProvider
                            dateAdapter={AdapterDayjs}>
                            <DatePicker
                                {...register("activity_date", {required: "Select a date."})}
                                label="Date of the job"
                                format="DD/MM/YYYY"
                                onChange={value => dispatch(setJobDate(value))}
                                slotProps={{
                                    textField: {
                                        ...register("activity_date", {required: "Select a date."}),
                                        fullWidth: true,
                                        value: date
                                    },
                                }}
                                maxDate={today}
                                defaultValue={date}
                            />
                        </LocalizationProvider>
                    </div>
                    <Button fullWidth
                            variant="contained"
                            size="large"
                            color="success"
                            startIcon={<AddCircleOutlineIcon/>}
                            onClick={handleSubmit(onSubmit)}
                    >
                        Add Hearts
                    </Button>
                </form>
                : ""
            }
            </div>
            <Navbar/>
        </>
    );
};

export default Add;
