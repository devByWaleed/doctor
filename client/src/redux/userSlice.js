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


// API calling method
export const loadUserProfileData = createAsyncThunk(
    "user/loadUserProfileData",
    async (userToken, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(
                import.meta.env.VITE_BACKEND_URL + "/api/user/get-profile",
                { headers: { userToken } }
            );

            // If failed
            if (!data.success) {
                toast.error(data.message);
                return rejectWithValue(data.message);
            }

            // If succeed
            toast.success(data.message);
            return data.userData;
        } catch (error) {
            // Handling error
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
        },
        setDoctors: (state, action) => {
            state.doctors = action.payload
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
            });
    }
})

// Action creators are generated for each case reducer function
export const { signInStart, signInSuccess, signInFailure, setUserToken, setUserData, setDoctors } = userSlice.actions

export default userSlice.reducer