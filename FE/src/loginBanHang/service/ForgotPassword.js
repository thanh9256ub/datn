import axios from "axios";


export const ListForgotpassword = async (email) => {
    const body = {
       email:email
    }
    const response = await axios.post("http://localhost:8080/employee/forgot-password", body)
    return response.data
}