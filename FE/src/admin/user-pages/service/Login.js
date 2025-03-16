import axios from "axios"
export const getToken = async (username, password) => {
    const body = {
        username: username,
        password: password
    }
    const response = await axios.post("http://localhost:8080/auth/token", body)
    return response
}