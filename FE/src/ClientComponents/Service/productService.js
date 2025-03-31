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
        const response = await api.get('/products/list'); // Thay thế endpoint tương ứng
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
export const fetchSizesByColor = async (productId, colorId) => {
    try {
        const response = await api.get(`/product-detail/sizes-by-color/${productId}/${colorId}`); // Gọi API với colorId
        console.log("API res (sizes by color):", response.data);
        return Array.isArray(response.data.data) ? response.data.data : [];
    } catch (error) {
        console.error('Error fetching sizes by color:', error);
        return []; // Trả về mảng rỗng nếu có lỗi
    }
};
export const fetchProvinces = async () => {
    try {
        const response = await axios.get('/counter/provinces');
        console.log('Provinces data:', response.data);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching provinces:', error);
        // Trả về mảng rỗng nếu có lỗi để không làm crash ứng dụng
        return [];
    }
};

// Lấy danh sách quận/huyện theo tỉnh
export const fetchDistricts = async (provinceId) => {
    try {
        const response = await api.get(`/counter/districts?provinceId=${provinceId}`);
        console.log('Districts data:', response.data);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching districts:', error);
        throw error;
    }
};

// Lấy danh sách phường/xã theo quận
export const fetchWards = async (districtId) => {
    try {
        const response = await api.get(`/counter/wards?districtId=${districtId}`);
        console.log('Wards data:', response.data);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching wards:', error);
        throw error;
    }
};
export const fetchShippingFee = async (shippingData) => {
    try {
        const response = await api.post('/counter/get-price', shippingData);

        // Đảm bảo response có cấu trúc hợp lệ
        if (!response) {
            throw new Error('Không có response từ API');
        }

        console.log('API Response:', {
            status: response.status,
            data: response.data,
            config: response.config
        });

        return {
            status: response.status,
            data: response.data || {}, // Luôn trả về object
            headers: response.headers
        };
    } catch (error) {
        console.error('API Error Details:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            errorData: error.response?.data
        });
        throw new Error(`Lỗi API: ${error.message}`);
    }
};
export const fetchProductDetailByAttributes = async (productId, colorId, sizeId) => {
    try {
        if (!productId || !colorId || !sizeId) {
            throw new Error('Thiếu thông tin bắt buộc: productId, colorId, sizeId');
        }

        const response = await api.get('/product-detail/find-by-attributes', {
            params: { productId, colorId, sizeId }
        });

        if (!response.data.data) {
            throw new Error('Không tìm thấy thông tin sản phẩm');
        }

        return response.data.data;
    } catch (error) {
        console.error('Error in fetchProductDetailByAttributes:', error);
        throw new Error(error.response?.data?.message || 'Lỗi khi lấy thông tin sản phẩm');
    }
};

export const apiAddToCart = async (cartData) => {
    try {
        console.log("Sending cart data:", cartData);
        const response = await api.post('/cart-details/add', cartData);
        return response.data;
    } catch (error) {
        console.error("API Error Details:", {
            url: error.config?.url,
            status: error.response?.status,
            errorData: error.response?.data
        });
        throw error;
    }
};

export const getCartDetails = async (customerId) => {
    try {
        const response = await api.get(`/cart-details/cart/${customerId}`);
        return response.data.data || [];
    } catch (error) {
        console.error("Error fetching cart details:", error);
        return [];
    }
};