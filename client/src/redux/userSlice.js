import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-toastify'

const initialState = {
    user: null,
    userToken: localStorage.getItem('userToken') || "",
    doctors: [],
    error: null,
    loading: false
}

export const backendURL = import.meta.env.VITE_BACKEND_URL
export const currency = "Rs"

// API calling method
export const loadUserProfileData = createAsyncThunk(
    "user/loadUserProfileData",
    async (userToken, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(
                backendURL + "/api/user/get-profile",
                { headers: { userToken } }
            );

            // If failed
            if (!data.success) {
                toast.error(data.message);
                return rejectWithValue(data.message);
            }

            // If succeed
            toast.success(data.message);    // Can be removed
            return data.userData;
        } catch (error) {
            // Handling error
            toast.error(error.message);
            return rejectWithValue(error.message);
        }
    }
);


export const getDoctorsData = createAsyncThunk(
    "user/getDoctorsData",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(backendURL + "/api/doctor/list");

            if (data.success === false) {
                toast.error(data.message);
                return rejectWithValue(data.message);
            }
            return data.doctors;

        } catch (error) {
            toast.error(error.message);
            return rejectWithValue(error.message);
        }
    }
);


export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true
        },
        signInSuccess: (state, action) => {
            state.userToken = action.payload.token
            state.user = action.payload.userData
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
    // Passing profile data to redux
    extraReducers: (builder) => {
        builder
            .addCase(loadUserProfileData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadUserProfileData.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(loadUserProfileData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getDoctorsData.pending, (state) => {
                state.loading = true;
            })
            .addCase(getDoctorsData.fulfilled, (state, action) => {
                state.loading = false;
                state.doctors = action.payload;
            })
            .addCase(getDoctorsData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
})

// Action creators are generated for each case reducer function
export const { signInStart, signInSuccess, signInFailure, setUserToken, setUserData } = userSlice.actions

export default userSlice.reducer