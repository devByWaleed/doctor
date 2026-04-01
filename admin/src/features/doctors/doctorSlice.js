import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-toastify'

const initialState = {
    doctorProfile: null,
    doctorToken: localStorage.getItem('doctorToken') || "",
    doctorAppointments: [],
    doctorDashData: false,
    doctorError: null,
    doctorLoading: false
}

export const backendURL = import.meta.env.VITE_BACKEND_URL
export const currency = "SGD"


// API calling method
export const getDoctorAppointments = createAsyncThunk(
    "doctor/getDoctorAppointments",
    async (doctorToken, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(
                backendURL + "/api/doctor/appointments",
                { headers: { doctorToken } }
            );

            // If failed
            if (!data.success) {
                toast.error(data.message);
                return rejectWithValue(data.message);
            }

            console.log(data.appointments)
            return data.appointments;
        } catch (error) {
            // Handling Error
            toast.error(error.message);
            return rejectWithValue(error.message);
        }
    }
);


export const completeAppointment = createAsyncThunk(
    "doctor/completeAppointment",
    async ({ doctorToken, appointmentId }, { dispatch, rejectWithValue }) => {
        try {
            const { data } = await axios.post(
                backendURL + "/api/doctor/complete-appointment",
                { appointmentId },
                { headers: { doctorToken } }
            );

            // If failed
            if (!data.success) {
                toast.error(data.message);
                return rejectWithValue(data.message);
            }
            dispatch(getDoctorAppointments(doctorToken))
            toast.success(data.message)
        } catch (error) {
            // Handling Error
            toast.error(error.message);
            return rejectWithValue(error.message);
        }
    }
);


export const cancelAppointment = createAsyncThunk(
    "doctor/cancelAppointment",
    async ({ doctorToken, appointmentId }, { dispatch, rejectWithValue }) => {
        try {
            const { data } = await axios.post(
                backendURL + "/api/doctor/cancel-appointment",
                { appointmentId },
                { headers: { doctorToken } }
            );

            // If failed
            if (!data.success) {
                toast.error(data.message);
                return rejectWithValue(data.message);
            }
            dispatch(getDoctorAppointments(doctorToken))
            toast.success(data.message)
        } catch (error) {
            // Handling Error
            toast.error(error.message);
            return rejectWithValue(error.message);
        }
    }
);


export const getDashData = createAsyncThunk(
    "doctor/getDashData",
    async (doctorToken, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(
                backendURL + "/api/doctor/dashboard",
                { headers: { doctorToken } }
            );

            // If failed
            if (!data.success) {
                toast.error(data.message);
                return rejectWithValue(data.message);
            }

            console.log(data.dashData)
            return data.dashData
        } catch (error) {
            // Handling Error
            toast.error(error.message);
            return rejectWithValue(error.message);
        }
    }
);


export const getProfileData = createAsyncThunk(
    "doctor/getProfileData",
    async (doctorToken, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(
                backendURL + "/api/doctor/profile",
                { headers: { doctorToken } }
            );

            // If failed
            if (!data.success) {
                toast.error(data.message);
                return rejectWithValue(data.message);
            }

            console.log(data.profileData)
            return data.profileData
        } catch (error) {
            // Handling Error
            toast.error(error.message);
            return rejectWithValue(error.message);
        }
    }
);


export const doctorSlice = createSlice({
    name: 'doctor',
    initialState,
    reducers: {
        doctorSignInStart: (state) => {
            state.doctorLoading = true
        },
        doctorSignInSuccess: (state, action) => {
            state.doctorToken = action.payload.token
            state.doctorLoading = false
            state.doctorError = null
        },
        doctorSignInFailure: (state, action) => {
            state.doctorError = action.payload
            state.doctorLoading = false
        },
        // This is how you "set" the token globally
        setDoctorToken: (state, action) => {
            state.doctorToken = action.payload
        },
    },
    // Passing doctor data to redux
    extraReducers: (builder) => {
        builder
            .addCase(getDoctorAppointments.pending, (state) => {
                state.doctorLoading = true;
                state.doctorError = null;
            })
            .addCase(getDoctorAppointments.fulfilled, (state, action) => {
                state.doctorLoading = false;
                state.doctorAppointments = action.payload;
            })
            .addCase(getDoctorAppointments.rejected, (state, action) => {
                state.doctorLoading = false;
                state.doctorError = action.payload;
            })
            .addCase(completeAppointment.pending, (state) => {
                state.doctorLoading = true;
                state.doctorError = null;
            })
            .addCase(completeAppointment.fulfilled, (state, action) => {
                state.doctorLoading = false;
            })
            .addCase(completeAppointment.rejected, (state, action) => {
                state.doctorLoading = false;
                state.doctorError = action.payload;
            })
            .addCase(cancelAppointment.pending, (state) => {
                state.doctorLoading = true;
                state.doctorError = null;
            })
            .addCase(cancelAppointment.fulfilled, (state, action) => {
                state.doctorLoading = false;
            })
            .addCase(cancelAppointment.rejected, (state, action) => {
                state.doctorLoading = false;
                state.doctorError = action.payload;
            })
            .addCase(getDashData.pending, (state) => {
                state.doctorLoading = true;
                state.doctorError = null;
            })
            .addCase(getDashData.fulfilled, (state, action) => {
                state.doctorLoading = false;
                state.dashData = action.payload;
            })
            .addCase(getDashData.rejected, (state, action) => {
                state.doctorLoading = false;
                state.doctorError = action.payload;
            })
            .addCase(getProfileData.pending, (state) => {
                state.doctorLoading = true;
                state.doctorError = null;
            })
            .addCase(getProfileData.fulfilled, (state, action) => {
                state.doctorLoading = false;
                state.doctorProfile = action.payload;
            })
            .addCase(getProfileData.rejected, (state, action) => {
                state.doctorLoading = false;
                state.doctorError = action.payload;
            })
    }
})

// Action creators are generated for each case reducer function
export const { doctorSignInStart, doctorSignInSuccess, doctorSignInFailure, setDoctorToken } = doctorSlice.actions

export default doctorSlice.reducer