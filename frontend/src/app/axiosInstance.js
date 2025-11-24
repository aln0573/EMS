import axios from 'axios'

const axiosIntance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true,
})

export default axiosIntance