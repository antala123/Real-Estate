import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    currentUser: null,
    error: null,
    loading: false
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        allError: (state) => {
            state.error = null;
        },
        signInStart: (state) => {
            state.loading = true;
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInFaliure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        updateUserInStart: (state) => {
            state.loading = true;
        },
        updateUserInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        updateUserInFaliure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        deleteUserInStart: (state) => {
            state.loading = true;
        },
        deleteUserInSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        deleteUserInFaliure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        signoutUserInStart: (state) => {
            state.loading = true;
        },
        signoutUserInSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        signoutUserInFaliure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        }
    }
})

export const { signInStart, signInSuccess, signInFaliure, allError, updateUserInStart,
    updateUserInSuccess, updateUserInFaliure, deleteUserInStart,
    deleteUserInSuccess, deleteUserInFaliure, signoutUserInStart, signoutUserInSuccess, signoutUserInFaliure } = userSlice.actions;
export default userSlice.reducer;