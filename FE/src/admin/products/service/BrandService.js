import axios from "axios";

const BASE_URL = 'http://localhost:8080/brand';

export const getBrands = () => {
    let token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return axios.get(BASE_URL);
}

export const getActive = () => {
    return axios.get(`${BASE_URL}/active`)
}

export const createBrand = (brand) => {
    return axios.post(`${BASE_URL}/add`, brand)
}

export const updateBrand = (id, brand) => {
    return axios.put(`${BASE_URL}/edit/${id}`, brand)
}

export const updateStatus = (id) => {
    return axios.patch(`${BASE_URL}/update-status/${id}`)
}