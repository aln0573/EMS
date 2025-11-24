import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminService from "./adminService";

export const loadEmployees = createAsyncThunk(
  "admin/loadEmployees",
  async (params, thunkAPI) => {
    try {
      return await adminService.fetchEmployees(params);
    } catch {
      return thunkAPI.rejectWithValue("Failed to fetch employees");
    }
  }
);

export const loadDesignations = createAsyncThunk(
  "admin/loadDesignations",
  async (_, thunkAPI) => {
    try {
      return await adminService.fetchDesignations();
    } catch {
      return thunkAPI.rejectWithValue("Failed to fetch designations");
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    employees: [],
    designations: [],
    total: 0,
    page: 1,
    totalPages: 1,

    search: "",
    designation: "",
    sortBy: "createdAt",
    sortOrder: "desc",

    isLoading: false,
  },
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setDesignation: (state, action) => {
      state.designation = action.payload;
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
      .addCase(loadEmployees.fulfilled, (state, action) => {
        state.employees = action.payload.employees;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(loadDesignations.fulfilled, (state, action) => {
        state.designations = action.payload;
      })
      .addCase(loadEmployees.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadEmployees.rejected, (state) => {
        state.isLoading = false;
        state.employees = [];
      });
  },
});

export const { setSearch, setDesignation, setSort, setPage,setSortOrder } =
  adminSlice.actions;

export default adminSlice.reducer;
