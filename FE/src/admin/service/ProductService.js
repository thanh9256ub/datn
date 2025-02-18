import axios from 'axios'

const apiProduct = 'http://local:8080/products';

export const getProducts = () => {
    return axios.get(apiProduct);
}