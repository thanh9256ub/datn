import axios from "axios"

export const getToken = async (username, password) => {
    const body = {
        username: username,
        password: password
    }
    const response = await axios.post("http://localhost:8080/auth/token", body,
        {
            headers: {
                Authorization: ""
            }
        }
    )
    return response
}

export const getTokenCustomer = async (email, password) => {
    const body = {
        email: email,
        password: password
    }
    const response = await axios.post("http://localhost:8080/authCustomer/token", body,
        {
            headers: {
                Authorization: ""
            }
        }
    )
    return response
}

export const registerCustomer = async (email, phone, fullName, gender, birthDate) => {
    const body = {
        email: email,
        phone: phone,
        fullName: fullName,
        gender: gender,
        birthDate: birthDate

    }
    const response = await axios.post("http://localhost:8080/authCustomer/register", body,
        {
            headers: {
                Authorization: ""
            }
        }
    )
    return response
}