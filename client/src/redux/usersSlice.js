import { createSlice } from "@reduxjs/toolkit";

const usersSlice = createSlice({
    name: 'users',
    initialState: {
        user: null,
        loading: false,
    },
    reducers: {
        SetUser: (state, action) => {
            state.user = action.payload;
        },
        SetLoading: (state, action) => {
            state.loading = action.payload;
        },
        LogoutUser: (state) => {
            state.user = null;
            localStorage.removeItem("token");
        }
    }
});

export const { SetUser, SetLoading, LogoutUser } = usersSlice.actions;
export default usersSlice.reducer;
