import axios from "axios";

const BASE_URL = 'http://localhost:8080/material';

export const getMaterials = () => {
    let token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return axios.get(BASE_URL);
}

export const createMaterial = (material) => {
    return axios.post(`${BASE_URL}/add`, material)
}

export const updateMaterial = (id, material) => {
    return axios.put(`${BASE_URL}/edit/${id}`, material)
}
