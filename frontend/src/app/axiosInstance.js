import axios from 'axios'

const axiosIntance = axios.create({
    baseURL: "http://localhost:4001/api",
    withCredentials: true,
})

export default axiosIntance