import axios from "axios";

const BASE_URL = 'http://localhost:8080/brand';

export const getBrands = () => {
    return axios.get(BASE_URL);
}

export const createBrand = (brand) => {
    return axios.post(`${BASE_URL}/add`, brand)
}