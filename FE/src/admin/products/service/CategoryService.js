import axios from "axios";

const apiCategorys = 'http://localhost:8080/category';

export const getCategorys = () => {
    return axios.get(apiCategorys);
}