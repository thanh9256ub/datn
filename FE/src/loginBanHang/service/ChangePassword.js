import axios from "axios";


export const ListChangePassword = async (oldPassword, newPassword) => {
    let token = localStorage.getItem('token');
    const body = {
        oldPassword: oldPassword,
        newPassword: newPassword
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const response = await axios.post("http://localhost:8080/employee/change-password",body)
    return response.data
}