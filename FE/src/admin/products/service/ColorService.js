import axios from "axios";

const BASE_URL = 'http://localhost:8080/color';

export const getColors = () => {
    let token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return axios.get(BASE_URL);
}

export const getActive = () => {
    return axios.get(`${BASE_URL}/active`)
}

export const createColor = (color) => {
    return axios.post(`${BASE_URL}/add`, color)
}

export const updateColor = (id, color) => {
    return axios.put(`${BASE_URL}/edit/${id}`, color)
}

export const updateStatus = (id) => {
    return axios.patch(`${BASE_URL}/update-status/${id}`)
}