import axios from 'axios'

const apiProducts = 'http://localhost:8080/products';

export const getProducts = () => {
    return axios.get(apiProducts);
}

export const createProduct = (product) => {
    return axios.post(`${apiProducts}/add`, product);
}
