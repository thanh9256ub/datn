import axios from "axios";

const BASE_URL = 'http://localhost:8080/vouchers'

export const createVoucher = (v) => {
    return axios.post(`${BASE_URL}/add`, v);
}

export const getVouchers = () => {
    return axios.get(`${BASE_URL}/list`)
}