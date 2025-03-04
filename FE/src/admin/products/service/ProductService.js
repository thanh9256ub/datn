import axios from 'axios'

const BASE_URL = 'http://localhost:8080/products';

export const getProducts = () => {
    return axios.get(BASE_URL);
}

export const createProduct = (product) => {
    return axios.post(`${BASE_URL}/add`, product);
}

export const updateStatus = (id, statusPro) => {
    return axios.patch(`${BASE_URL}/${id}?status=${statusPro}`);
}

export const getProductById = (id) => {
    return axios.get(`${BASE_URL}/${id}`)
}

export const updateProduct = (id, product) => {
    return axios.put(`http://localhost:8080/products/${id}`, product)
}