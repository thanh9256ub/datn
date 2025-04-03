import axios from "axios";

const BASE_URL = 'http://localhost:8080/category';

export const getCategories = () => {
    let token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return axios.get(BASE_URL);
}

export const getActive = () => {
    return axios.get(`${BASE_URL}/active`)
}

export const createCategory = (cate) => {
    return axios.post(`${BASE_URL}/add`, cate)
}

export const updateCategory = (id, cate) => {
    return axios.put(`${BASE_URL}/edit/${id}`, cate)
}

export const updateStatus = (id) => {
    return axios.patch(`${BASE_URL}/update-status/${id}`)
}