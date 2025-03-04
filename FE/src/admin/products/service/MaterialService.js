import axios from "axios";

const BASE_URL = 'http://localhost:8080/material';

export const getMaterials = () => {
    return axios.get(BASE_URL);
}

export const createMaterial = (material) => {
    return axios.post(`${BASE_URL}/add`, material)
}