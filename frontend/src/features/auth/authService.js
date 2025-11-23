import axiosIntance from "../../app/axiosInstance";

const register = async (formData) => {
  try {
    const response = await axiosIntance.post("/auth/register", formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const login = async (formData) => {
  try {
    const response = await axiosIntance.post("/auth/login", formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getEmployeesList = async (
  page = 1,
  search = "",
  designation = "",
  sortBy = "createdAt",
  sortOrder = "desc"
) => {
  try {
    const response = await axiosIntance.get(`/auth/employees`, {
      params: { page, search, sortBy,designation, sortOrder },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};  

const fetchDesignations = async () => {
  const response = await axiosIntance.get("/auth/designations");
  return response.data.designations;
};

const logout = async () => {
  try {
    const response = await axiosIntance.post("/auth/logout");
    return response.data;
  } catch (error) {
    throw error;
  }
};

const authService = {
  register,
  login,
  getEmployeesList,
  logout,
  fetchDesignations,
};

export default authService;
