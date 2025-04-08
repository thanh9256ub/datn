import axios from "axios";

const BASE_URL = 'http://localhost:8080/material';

export const getMaterials = () => {
    let token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return axios.get(BASE_URL);
}

export const getActive = () => {
    return axios.get(`${BASE_URL}/active`)
}

export const createMaterial = (material) => {
    return axios.post(`${BASE_URL}/add`, material)
}

export const updateMaterial = (id, material) => {
    return axios.put(`${BASE_URL}/edit/${id}`, material)
}

export const updateStatus = (id) => {
    return axios.patch(`${BASE_URL}/update-status/${id}`)
}
