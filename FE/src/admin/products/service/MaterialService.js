import axios from "axios";

const apiMaterials = 'http://localhost:8080/material';

export const getMaterials = () => {
    return axios.get(apiMaterials);
}