import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    Admin: null,
    adminToken: localStorage.getItem('adminToken') || "",
    error: null,
    loading: false
}


export const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true
        },
        signInSuccess: (state, action) => {
            state.Admin = action.payload
            state.adminToken = action.payload.token
            state.loading = false
            state.error = null
        },
        signInFailure: (state, action) => {
            state.error = action.payload
            state.loading = false
        },
        // This is how you "set" the token globally
        setAdminToken: (state, action) => {
            state.adminToken = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { signInStart, signInSuccess, signInFailure, setAdminToken } = adminSlice.actions

export default adminSlice.reducer