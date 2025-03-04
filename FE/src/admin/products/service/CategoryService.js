import axios from "axios";

const BASE_URL = 'http://localhost:8080/category';

export const getCategorys = () => {
    return axios.get(BASE_URL);
}

export const createCategory = (cate) => {
    return axios.post(`${BASE_URL}/add`, cate)
}