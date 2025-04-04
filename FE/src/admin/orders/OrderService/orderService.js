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
export const filterOrders = async ({ orderCode, minPrice, maxPrice, startDate, endDate, status }) => {
    try {
        // Format dates to match backend expectations
        const params = {
            orderCode: orderCode || undefined,
            minPrice: minPrice || undefined,
            maxPrice: maxPrice || undefined,
            status: status || undefined
        };

        // Only include dates if they are provided
        if (startDate) {
            params.startDate = `${startDate}T00:00:00`; // Add time component for LocalDateTime
        }
        if (endDate) {
            params.endDate = `${endDate}T23:59:59`; // Add time component for LocalDateTime
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
        console.log('Raw API Response:', response.data); // Thêm log để kiểm tra
        return response.data;
    } catch (error) {
        console.error('Error fetching order details by order ID:', error);
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
        const response = await api.put(`/edit/${id}`, orderData);
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
export default api;