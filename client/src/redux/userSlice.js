import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    User: null,
    userToken: localStorage.getItem('userToken') || "",
    // doctors: [],
    error: null,
    loading: false
}


export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true
        },
        signInSuccess: (state, action) => {
            state.User = action.payload
            state.userToken = action.payload.token
            state.loading = false
            state.error = null
        },
        signInFailure: (state, action) => {
            state.error = action.payload
            state.loading = false
        },
        // This is how you "set" the token globally
        setUserToken: (state, action) => {
            state.userToken = action.payload
        }
    },
})

// Action creators are generated for each case reducer function
export const { signInStart, signInSuccess, signInFailure, setUserToken } = userSlice.actions

export default userSlice.reducer