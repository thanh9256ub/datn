import axios from 'axios'

const BASE_URL = 'http://localhost:8080/product-detail';

export const createProductDetail = (productId, listVariant) => {
    return axios.post(`${BASE_URL}/add-multiple/${productId}`, listVariant);
}

export const getProductDetailByProductId = (id) => {
    return axios.get(`${BASE_URL}/${id}`)
}

export const updateProductDetail = (pdId, quantity, statusPD) => {
    return axios.patch(`${BASE_URL}/${pdId}?quantity=${quantity}&&status=${statusPD}`);
}

export const updateProductDetails = (pId, pds) => {
    console.log("Dữ liệu gửi lên:", pds);
    return axios.put(`${BASE_URL}/${pId}`, pds);
}