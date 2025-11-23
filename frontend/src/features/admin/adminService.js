import axiosIntance from "../../app/axiosInstance";

const fetchEmployees = async (params) => {
  console.log("Fetching employees with params:", params);
  const response = await axiosIntance.get("/employees", { params });
  return response.data;
};

const fetchDesignations = async () => {
  const response = await axiosIntance.get("/designations");
  return response.data.designations;
};

const adminService = { fetchEmployees, fetchDesignations };
export default adminService;
