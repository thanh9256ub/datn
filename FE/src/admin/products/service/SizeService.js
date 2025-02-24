import axios from "axios";

const apiSize = 'http://localhost:8080/size';

export const getSizes = () => {
    return axios.get(apiSize);
}