import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {api} from "../../helpers/api";

const initialState = {
    deleteIcon: false,
    loading: false,
};

export const deleteUserJob = createAsyncThunk(
    "user/deleteUserJob",
    async ({id, userId}) => await api(`/users/${userId}/jobs/${id}`, "POST")
);

const jobCardSlice = createSlice({
    name: "jobCard",
    initialState,
    reducers: {
        showDeleteIcon: state => {
            state.deleteIcon = true;
        },
        hideDeleteIcon: state => {
            state.deleteIcon = false;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(deleteUserJob.pending, state => {
                state.loading = true;
            })
            .addCase(deleteUserJob.fulfilled, state => {
                state.loading = false;
            })
            .addCase(deleteUserJob.rejected, state => {
                state.loading = false;
                console.log("deleteUserJob.rejected");
            })
        ;
    }
});

export const {
    showDeleteIcon,
    hideDeleteIcon
} = jobCardSlice.actions;

export default jobCardSlice.reducer;
