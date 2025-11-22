import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import authService from './authService'

export const registerUser = createAsyncThunk(
    '/auth/registerUser',
    async (formData, thunkAPI) => {
        try {
            const data = await authService.register(formData)
            return data
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || "Something went wrong"
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const loginUser = createAsyncThunk(
    '/auth/loginUser',
    async (formData, thunkAPI) => {
        try {
            const data = await authService.login(formData)
            return data
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || "Something went wrong"
            return thunkAPI.rejectWithValue(message)
        }
    }
)


const authSlice = createSlice({
    name: "auth",
    initialState: {
        user:  null,
        isLoading: false,
        isError: false,
        isSuccess: false,
        message: ""
    },
    reducers: {
        logout: (state) => {
            state.user = null
        }
    },
    extraReducers: (builder) => {
        builder 
          .addCase(registerUser.pending, (state) => {
            state.isLoading = true
          })
          .addCase(registerUser.fulfilled, (state, action) => {
            state.isLoading = false
            state.user = action.payload
            state.isError = false
            state.isSuccess = true
            state.message = action.payload.message
            
          })
          .addCase(registerUser.rejected, (state, action) => {
            state.isError = true
            state.isLoading = false
            state.message = action.payload
          })
          .addCase(loginUser.pending, (state) => {
            state.isLoading = true
          })
          .addCase(loginUser.fulfilled, (state, action) => {
            state.isLoading = false
            state.user = action.payload
            state.isError = false
            state.isSuccess = true
            state.message = action.payload.message
            
          })
          .addCase(loginUser.rejected, (state, action) => {
            state.isError = true
            state.isLoading = false
            state.message = action.payload
          })  
    }
})

export const { logout } = authSlice.actions
export default authSlice.reducer