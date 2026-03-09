import { configureStore } from '@reduxjs/toolkit';
import adminReducer from '../features/admin/adminSlice';
// import doctorsReducer from '../features/doctors/doctorsSlice';
// import appointmentsReducer from '../features/appointments/appointmentsSlice';

export const store = configureStore({
    reducer: {
        admin: adminReducer,
        // doctors: doctorsReducer,
        // appointments: appointmentsReducer
    },
    // Redux Toolkit automatically adds thunk middleware and devTools
});

export default store;