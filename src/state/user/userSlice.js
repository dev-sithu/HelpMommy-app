import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {api} from "../../helpers/api";
import {storeItem, storeItemEncrypted} from "../../helpers/storage";
import config from "../../config";

const initialState = {
    visiblePassword: false,
    loading: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        togglePassword: (state, action) => {
            state.visiblePassword = action.payload;
        },
    },
    extraReducers: builder => {
        builder
            // Login
            .addCase(userLogin.pending, state => {
                state.loading = true;
            })
            .addCase(userLogin.fulfilled, (state, action) => {
                const { result } = action.payload;
                state.loading = false;

                if (result && result.data.id) {
                    storeItemEncrypted(config.userStoreKey, result.data);
                    storeItem(`${config.storePrefix}token`, result.meta.token);
                    storeItem(`${config.storePrefix}key`, result.meta.key);
                    console.log(result.meta);
                }
            })
            .addCase(userLogin.rejected, state => {
                state.loading = false;
                console.log("userLogin.rejected");
            })
            // Register
            .addCase(userRegister.pending, state => {
                state.loading = true;
            })
            .addCase(userRegister.fulfilled, (state, action) => {
                const { result } = action.payload;
                state.loading = false;

                if (result && result.data.id) {
                    storeItemEncrypted(config.userStoreKey, result.data);
                }
            })
            .addCase(userRegister.rejected, state => {
                state.loading = false;
                console.log("userRegister.rejected");
            })
            // Update Account
            .addCase(userUpdate.pending, state => {
                state.loading = true;
            })
            .addCase(userUpdate.fulfilled, (state, action) => {
                const { result } = action.payload;
                state.loading = false;

                if (result && result.data.id) {
                    storeItemEncrypted(config.userStoreKey, result.data);
                }
            })
            .addCase(userUpdate.rejected, state => {
                state.loading = false;
                console.log("userUpdate.rejected");
            })
            // Get user account by account id
            .addCase(userAccount.pending, state => {
                state.loading = true;
            })
            .addCase(userAccount.fulfilled, (state, action) => {
                const { result } = action.payload;
                if (result) {
                    storeItemEncrypted(config.userStoreKey, result.data);
                }
                state.loading = false;
            })
            .addCase(userAccount.rejected, state => {
                state.loading = false;
                console.log("userAccount.rejected");
            })
            // Refresh Token
            .addCase(userRefreshToken.pending, state => {
                state.loading = true;
            })
            .addCase(userRefreshToken.fulfilled, (state, action) => {
                const { result } = action.payload;
                state.loading = false;

                if (result && result.data.id) {
                    storeItemEncrypted(config.userStoreKey, result.data);
                    storeItem(`${config.storePrefix}token`, result.meta.token);
                    storeItem(`${config.storePrefix}key`, result.meta.key);
                    console.log(result.meta);
                }
            })
            .addCase(userRefreshToken.rejected, state => {
                state.loading = false;
                console.log("userLogin.rejected");
            })
        ;
    }
});

export const userRefreshToken = createAsyncThunk(
    "user/token/refresh",
    async () => await api("auth/token/refresh", "POST")
);

export const userLogin = createAsyncThunk(
    "user/login",
    async data => await api("auth/login", "POST", data)
);

export const userRegister = createAsyncThunk(
    "user/register",
    async data => await api("users", "POST", data)
);

export const userUpdate = createAsyncThunk(
    "user/update",
    async ({ id, data }) => await api(`users/${id}`, "POST", data)
);

export const userAccount = createAsyncThunk(
    "user/account",
    async accId => await api(`account/${accId}`)
);

export const {togglePassword} = userSlice.actions;

export default userSlice.reducer;
