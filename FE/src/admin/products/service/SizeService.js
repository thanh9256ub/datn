import axios from "axios";

const BASE_URL = 'http://localhost:8080/size';

export const getSizes = () => {
    return axios.get(BASE_URL);
}

export const createSize = (size) => {
    return axios.post(`${BASE_URL}/add`, size)
}
