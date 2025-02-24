import axios from 'axios'

const apiProduct = 'http://localhost:8080/products';

export const getProducts = () => {
    return axios.get(apiProduct);
}