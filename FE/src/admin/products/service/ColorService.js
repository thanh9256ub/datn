import axios from "axios";

const BASE_URL = 'http://localhost:8080/color';

export const getColors = () => {
    return axios.get(BASE_URL);
}

export const createColor = (color) => {
    return axios.post(`${BASE_URL}/add`, color)
}
