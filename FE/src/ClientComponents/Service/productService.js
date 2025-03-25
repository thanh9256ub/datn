import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080'; // Thay thế bằng URL của backend

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
export const fetchProducts = async () => {
    try {
        const response = await api.get('/products'); // Thay thế endpoint tương ứng
        console.log("API res:" + response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
};
export const fetchProductDetail = async () => {
    try {
        const response = await api.get('/product-detail'); // Thay thế endpoint tương ứng
        console.log("API res:" + response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
};
export const fetchProductById = async (productId) => {
    try {
        const response = await api.get(`/products/${productId}`);
        console.log("API res (product by id):", response.data);
        return response.data.data || response.data; // Điều chỉnh theo cấu trúc API
    } catch (error) {
        console.error('Error fetching product by id:', error);
        throw error;
    }
};
export const fetchProductDetailByProduct = async (productId) => {
    try {
        const response = await api.get(`/product-detail/${productId}`);
        console.log("API res (product details by productId):", response.data);
        // Đảm bảo luôn trả về mảng từ response.data.data
        return Array.isArray(response.data.data) ? response.data.data : [];
    } catch (error) {
        console.error('Error fetching product details by productId:', error);
        return []; // Trả về mảng rỗng nếu lỗi
    }
};
// Lấy danh sách màu của sản phẩm
export const fetchProductColorsByProduct = async (productId) => {
    try {
        const response = await api.get(`/product-color/${productId}`);
        console.log("API res (product colors by productId):", response.data);
        return Array.isArray(response.data.data) ? response.data.data : [];
    } catch (error) {
        console.error('Error fetching product colors by productId:', error);
        return [];
    }
};

// Lấy danh sách ảnh theo productColorId
export const fetchImagesByProductColor = async (productColorId) => {
    try {
        const response = await api.get(`/product-color/${productColorId}/images`);
        console.log("API res (images by productColorId):", response.data);
        return Array.isArray(response.data.data) ? response.data.data : [];
    } catch (error) {
        console.error('Error fetching images by productColorId:', error);
        return [];
    }
};