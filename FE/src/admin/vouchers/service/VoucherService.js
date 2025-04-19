import axios from "axios";

const BASE_URL = 'http://localhost:8080/vouchers'

export const createVoucher = (v) => {
    return axios.post(`${BASE_URL}/add`, v);
}

export const getVouchers = () => {
    return axios.get(`${BASE_URL}/list`)
}

export const getVoucherById = (id) => {
    return axios.get(`${BASE_URL}/${id}`);
}

export const updateVoucher = (id, voucher) => {
    return axios.put(`${BASE_URL}/edit/${id}`, voucher);
}

export const deleteOrRestoreVoucher = (vcIds) => {
    return axios.patch(`${BASE_URL}/delete-or-restore`, vcIds)
}

export const getBin = () => {
    return axios.get(`${BASE_URL}/bin`)
}

export const getActive = () => {
    return axios.get(`${BASE_URL}/active`)
}