import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "./authService";

const storedUser = JSON.parse(localStorage.getItem("user")) || null;

export const registerUser = createAsyncThunk(
  "/auth/registerUser",
  async (formData, thunkAPI) => {
    try {
      const data = await authService.register(formData);
      return data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        "Something went wrong";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "/auth/loginUser",
  async (formData, thunkAPI) => {
    try {
      const data = await authService.login(formData);
      return data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        "Something went wrong";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getEmployeesList = createAsyncThunk(
  "/auth/employees",
  async (_, thunkAPI) => {
    try {
      const { page, search, designation, sortBy, sortOrder } =
        thunkAPI.getState().auth;
      const data = await authService.getEmployeesList(
        page,
        search,
        designation,
        sortBy,
        sortOrder
      );
      return data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        "Something went wrong";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const loadDesignations = createAsyncThunk(
  "admin/loadDesignations",
  async (_, thunkAPI) => {
    try {
      return await authService.fetchDesignations();
    } catch {
      return thunkAPI.rejectWithValue("Failed to fetch designations");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "/auth/logoutUser",
  async (_, thunkAPI) => {
    try {
      const data = await authService.logout();
      return data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        "Something went wrong";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedUser,
    employees: [],
    designations: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    sortBy: "createdAt",
    sortOrder: "desc",
    search: "",
    message: "",
    designation: "",
    total: 0,
    page: 1,
    totalPages: 1,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    },
    setDesignation: (state, action) => {
      state.designation = action.payload;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setSort: (state, action) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = action.payload.message;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.message = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadDesignations.fulfilled, (state, action) => {
        state.designations = action.payload;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isError = false;
        state.isSuccess = true;
        state.message = action.payload.message;

        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.message = action.payload;
      })
      .addCase(getEmployeesList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getEmployeesList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.employees = action.payload.employees;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
        state.isError = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isSuccess = false;
        state.isError = false;
        state.message = "";
        localStorage.removeItem("user");
      });
  },
});

export const { logout, setPage, setSearch, setSort,setSortOrder, setDesignation } =
  authSlice.actions;
export default authSlice.reducer;
