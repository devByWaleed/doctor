import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'


const initialState = {
    User: null,
    userToken: localStorage.getItem('userToken') || "",
    doctors: [],
    error: null,
    loading: false
}


export const fetchUserProfile = createAsyncThunk(
    "user/fetchUserProfile",
    async (userToken, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(
                import.meta.env.VITE_BACKEND_URL + "/api/user/get-profile",
                { headers: { userToken } }
            );

            if (!data.success) {
                toast.error(data.message);
                return rejectWithValue(data.message);
            }

            toast.success(data.message);
            return data.userData;
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
        },
        setUserData: (state, action) => {
            // state.userData = { ...initialState.userData, ...action.payload }
            state.userData = action.payload
        },
        setDoctors: (state, action) => {
            state.doctors = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.userData = action.payload; // Fixed: Direct assignment
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
})

// Action creators are generated for each case reducer function
export const { signInStart, signInSuccess, signInFailure, setUserToken, setUserData, setDoctors } = userSlice.actions

export default userSlice.reducer