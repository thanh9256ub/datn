import axios from "axios";

const apiBrands = 'http://localhost:8080/brand';

export const getBrands = () => {
    return axios.get(apiBrands);
}