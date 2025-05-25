import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080'; // Thay thế bằng URL của backend

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Hàm lấy danh sách đơn hàng từ backend
export const fetchOrders = async () => {
    try {
        const response = await api.get('/order'); // Thay thế endpoint tương ứng
        return response.data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
};// Hàm lọc đơn hàng
export const filterOrders = async ({ search, minPrice, maxPrice, startDate, endDate, status }) => {
    try {
        const params = {
            search: search || undefined,
            minPrice: minPrice || undefined,
            maxPrice: maxPrice || undefined,
            status: status || undefined,
        };

        if (startDate) {
            params.startDate = `${startDate}T00:00:00`;
        }
        if (endDate) {
            params.endDate = `${endDate}T23:59:59`;
        }

        const response = await api.get('/order/filter', { params });
        console.log('API raw response:', response);
        console.log('API response.data:', response.data);
        console.log('Is response.data an array?', Array.isArray(response.data));

        const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
        console.log('Parsed data:', data);
        console.log('Is parsed data an array?', Array.isArray(data));

        return data;
    } catch (error) {
        console.error('Error filtering orders:', error);
        return [];
    }
};
// Hàm cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (id, newStatus) => {
    try {
        const response = await api.put(`/order/${id}/status`, null, {
            params: { newStatus } // Gửi newStatus qua query params
        });
        console.log('Update Order Status Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating order status:', error.response?.data || error.message);
        throw error;
    }
};
// Hàm lấy danh sách OrderDetail theo orderID
export const fetchOrderDetailsByOrderId = async (orderId) => {
    try {
        const response = await api.get(`/order-detail/order/${orderId}`);
        console.log('Raw API response:', response);

        // Kiểm tra và chuẩn hóa dữ liệu
        let details = Array.isArray(response.data) ? response.data : [];

        // Tính toán totalPrice nếu null
        details = details.map(item => ({
            ...item,
            totalPrice: item.totalPrice || (item.price * item.quantity)
        }));

        return details;
    } catch (error) {
        console.error('Error fetching order details:', error);
        throw error;
    }
};

// Hàm cập nhật toàn bộ danh sách OrderDetail cho một orderId
export const updateOrderDetails = async (orderId, items) => {
    try {
        const response = await api.put(`/counter/update-order-details/${orderId}`, items);
        console.log('Update Order Details Response:', response.data);
        return response.data.data; // Trả về danh sách OrderDetailResponse từ ApiResponse
    } catch (error) {
        console.error('Error updating order details:', error.response?.data || error.message);
        throw error;
    }
};
export const updateOrder = async (id, orderData) => {
    try {
        const response = await api.put(`/order/${id}/update-shipping-and-total`, orderData);
        console.log('Update Order Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating order:', error.response?.data || error.message);
        throw error;
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

// Cập nhật địa chỉ cho đơn hàng
export const updateOrderAddress = async (orderId, addressData) => {
    try {
        const response = await api.post(`/counter/${orderId}/update-address`, addressData);
        return response.data;
    } catch (error) {
        console.error('Error updating address:', error);
        throw error;
    }
};
export const updateCustomerInfo = async (orderId, customerData) => {
    try {
        const response = await api.put(`/order/${orderId}/customer-info`, customerData);

        // Đảm bảo API không redirect hoặc làm gì đó khiến trang reload
        if (response.status >= 200 && response.status < 300) {
            return response.data;
        }

        throw new Error(response.data?.message || 'Cập nhật thất bại');
    } catch (error) {
        console.error('API Error:', {
            url: error.config?.url,
            data: error.config?.data,
            status: error.response?.status,
            error: error.response?.data || error.message
        });
        throw error;
    }
};
export const fetchOrderHistory = async (orderId) => {
    try {
        const response = await api.get(`/order-history/order/${orderId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching order history:', error);
        throw error;
    }
};

// Tạo mới lịch sử đơn hàng
export const createOrderHistory = async (historyData) => {
    try {
        const response = await api.post('/order-history/add', historyData);
        return response.data;
    } catch (error) {
        console.error('Error creating order history:', error);
        throw error;
    }
};
export const updateOrderNote = async (id, noteData) => {
    try {
        const response = await api.put(`/order/${id}/note`, noteData);
        console.log('Update Order Note Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating order note:', error.response?.data || error.message);
        throw error;
    }
};
export const restoreProductQuantity = async (productDetailId, quantity) => {
    try {
        const response = await api.put(`/product-detail/${productDetailId}/restore`, { quantity });
        console.log('Restore Product Quantity Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error restoring product quantity:', error.response?.data || error.message);
        throw error;
    }
};
export const updateOrderTotalPrice = async (orderId, additionalPayment) => {
    try {
        const response = await api.put(`/order/${orderId}/update-total-price`, additionalPayment);
        console.log('API res (update order total price):', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating order total price:', {
            url: error.config?.url,
            status: error.response?.status,
            errorData: error.response?.data,
        });
        throw new Error(error.response?.data?.message || 'Không thể cập nhật tổng tiền thanh toán');
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

export default api;