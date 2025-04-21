import axios from 'axios'

const BASE_URL = 'http://localhost:8080/product-detail';

export const createProductDetail = (productId, listVariant) => {
    return axios.post(`${BASE_URL}/add-multiple/${productId}`, listVariant);
}

export const getProductDetailByProductId = (id) => {
    return axios.get(`${BASE_URL}/${id}`)
}

export const getBinDetails = (id) => {
    return axios.get(`${BASE_URL}/bin-details/${id}`)
}

export const updateProductDetail = (pdId, productDetail) => {
    return axios.put(`${BASE_URL}/${pdId}`, productDetail);
}

export const updateProductDetails = (pId, pds) => {
    console.log("Dữ liệu gửi lên:", pds);
    return axios.put(`${BASE_URL}/${pId}/update-list`, pds);
}

export const updateQR = async (pdId) => {
    try {
        const response = await axios.patch(`${BASE_URL}/${pdId}/update-qr`);
        console.log("Cập nhật QR thành công:", response.data);
        return response.data?.data?.qr || null;
    } catch (error) {
        console.error("Lỗi khi cập nhật QR:", error);
        return null;
    }
};

export const deleteOrRestoreProductDetails = (ids) => {
    return axios.post(`${BASE_URL}/delete-or-restore`, ids);
};

export const deleteOrRestoreProductDetail = (id) => {
    return axios.patch(`${BASE_URL}/update-status/${id}`)
}
