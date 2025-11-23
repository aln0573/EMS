import { configureStore } from '@reduxjs/toolkit'
import authSlice from '../features/auth/authSlice'
import adminSlice from '../features/admin/adminSlice'

const store = configureStore({
    reducer: {
        auth: authSlice,
        admin: adminSlice
    }
})

export default store