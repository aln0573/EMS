import axiosIntance from "../../app/axiosInstance"

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
        const response = await axiosIntance.post("/auth/login", formData)
        return response.data
    } catch (error) {
        throw error
    }
}


const  authService = { register, login }

export default authService