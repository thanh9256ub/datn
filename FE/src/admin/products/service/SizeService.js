import axios from "axios";

const BASE_URL = 'http://localhost:8080/size';

export const getSizes = () => {
    let token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return axios.get(BASE_URL);
}

export const createSize = (size) => {
    return axios.post(`${BASE_URL}/add`, size)
}
