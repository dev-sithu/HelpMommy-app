import FavoriteIcon from "@mui/icons-material/Favorite";
import HeartBrokenIcon from "@mui/icons-material/HeartBroken";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import useLongPress from "../../hooks/useLongPress";
import moment from "moment";
import "./ListCard.scss";
import {toast} from "react-toastify";
import {useDispatch, useSelector} from "react-redux";
import {deleteUserJob, hideDeleteIcon, showDeleteIcon} from "../../state/user/jobCardSlice";
import {useEffect, useState} from "react";
import {getConfig} from "../../helpers/common";
import {getItemDecrypted} from "../../helpers/storage";

const ListCard = props => {
    const config = getConfig();
    const user = getItemDecrypted(config.userStoreKey);
    const {title, hearts, index} = props;
    const [jobs, setJobs] = useState([]);
    const deleteIcon = useSelector(state => state.jobCard.deleteIcon);
    const dispatch = useDispatch();

    const removeJob = id => {
        setJobs(jobs.filter(job => parseInt(job.id) !== parseInt(id)));
    };

    const onLongPress = () => {
        dispatch(showDeleteIcon());
    };

    const onClick = () => {
        dispatch(hideDeleteIcon());
    };

    const longPressEvent = useLongPress(onLongPress, onClick, {
        shouldPreventDefault: true,
        delay: 1000,
    });

    useEffect(() => {
        setJobs(props.jobs); // set to this component state
    }, [props]);

    const doDelete = async id => {
        dispatch(deleteUserJob({ id, userId: user.id })).then(response => {
            const { result, error } = response.payload;

            if (error) {
                let errMsg = "";
                error.map(err => errMsg += " " + err.message);
                toast.error(errMsg, config.toastOptions);
            } else {
                if (result) {
                    toast.success("Deleted.", config.toastOptions);
                    removeJob(id);
                }
            }
        });
    };

    return (
        <div>
        {jobs.length > 0 &&
            <div>
                <h4 className={index ? "margin-top-none" : ""}>
                    <time>{moment(title).format("MMM D, YYYY (ddd)")}</time>
                    <span>{hearts} <FavoriteIcon/></span>
                </h4>
                <div className="card">
                    <ul className="list">
                    {jobs.map(job => (
                        <li key={job.id}>
                            <span className={deleteIcon ? "delete-action show" : "delete-action"}
                                  onClick={() => doDelete(job.id)}>
                                <DeleteForeverIcon />
                            </span>
                            <span className="list-item unselectable" {...longPressEvent}>
                                <span className="my">{job.name}</span>
                                <span>{job.rating} { job.rating > 0 ? <FavoriteIcon/> : <HeartBrokenIcon/> }</span>
                            </span>
                        </li>
                    ))}
                    </ul>
                </div>
            </div>
        }
        </div>
    );
};

export default ListCard;
