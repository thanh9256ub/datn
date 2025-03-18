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
        const response = await api.get('/order/filter', {
            params: {
                orderCode: orderCode || undefined,
                minPrice: minPrice || undefined,
                maxPrice: maxPrice || undefined,
                startDate: startDate || undefined,
                endDate: endDate || undefined,
                status: status || undefined
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error filtering orders:', error);
        throw error;
    }
};
// Hàm cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (id, newStatus) => {
    try {
        const response = await api.put(`/order/${id}/status`, null, {
            params: { newStatus }, // Truyền tham số newStatus qua query params
        });
        return response.data; // Trả về dữ liệu từ backend
    } catch (error) {
        console.error('Error updating order status:', error);
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

export default api;