import axios from "axios";

const BASE_URL = 'http://localhost:8080/size';

export const getSizes = () => {
    let token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return axios.get(BASE_URL);
}

export const getActive = () => {
    return axios.get(`${BASE_URL}/active`)
}

export const createSize = (size) => {
    return axios.post(`${BASE_URL}/add`, size)
}

export const updateSize = (id, size) => {
    return axios.put(`${BASE_URL}/edit/${id}`, size)
}

export const updateStatus = (id) => {
    return axios.patch(`${BASE_URL}/update-status/${id}`)
}