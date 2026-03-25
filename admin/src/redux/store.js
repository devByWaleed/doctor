import { configureStore } from '@reduxjs/toolkit';
import adminReducer from '../features/admin/adminSlice';
import doctorReducer from '../features/doctors/doctorSlice';

export const store = configureStore({
    reducer: {
        admin: adminReducer,
        doctor: doctorReducer,
    },
    // Redux Toolkit automatically adds thunk middleware and devTools
});

export default store;