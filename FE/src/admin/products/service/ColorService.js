import axios from "axios";

const apiColor = 'http://localhost:8080/color';

export const getColors = () => {
    return axios.get(apiColor);
}