import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-toastify'

const initialState = {
    Admin: null,
    adminToken: localStorage.getItem('adminToken') || "",
    doctors: [],
    appointments: [],
    error: null,
    loading: false
}

export const backendURL = import.meta.env.VITE_BACKEND_URL
export const currency = "Rs"

// API calling method
export const getAllAppointments = createAsyncThunk(
    "user/getAllAppointments",
    async (adminToken, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(
                backendURL + "/api/admin/appointments",
                { headers: { adminToken } }
            );

            // If failed
            if (!data.success) {
                toast.error(data.message);
                return rejectWithValue(data.message);
            }

            return data.appointments;
        } catch (error) {
            // Handling error
            toast.error(error.message);
            return rejectWithValue(error.message);
        }
    }
);

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
        setDoctors: (state, action) => {
            state.doctors = action.payload
        },
    },
    // Passing profile data to redux
    extraReducers: (builder) => {
        builder
            .addCase(getAllAppointments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllAppointments.fulfilled, (state, action) => {
                state.loading = false;
                state.appointments = action.payload;
            })
            .addCase(getAllAppointments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
})

// Action creators are generated for each case reducer function
export const { signInStart, signInSuccess, signInFailure, setAdminToken, setDoctors } = adminSlice.actions

export default adminSlice.reducer