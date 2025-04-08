import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080'; // Thay thế bằng URL của backend

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // Sửa từ 'tokenClient' -> 'token'
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Interceptor response
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            // Xử lý khi token hết hạn
            localStorage.removeItem('token');
            window.location.href = '/login'; // Redirect về trang login
        }
        return Promise.reject(error);
    }
);
export const checkStockAvailability = async (items) => {
    try {
        console.log('Items being sent to check stock:', items);
        const response = await api.post('/product-detail/check-stock', items);
        console.log('API response (check stock):', response.data);
        return response.data.data || {}; 
    } catch (error) {
        console.error('Error checking stock availability:', {
            url: error.config?.url,
            status: error.response?.status,
            errorData: error.response?.data,
            requestData: error.config?.data
        });
        throw new Error(error.response?.data?.message || 'Không thể kiểm tra tồn kho');
    }
};
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
export const fetchRelatedProducts = async (productId) => {
    try {
        const response = await api.get(`/product-detail/${productId}/related`);
        const relatedData = response.data.data;

        // Lọc bỏ các bản chi tiết trùng id sản phẩm
        const uniqueRelatedProducts = [];
        const seenProductIds = new Set();

        // Duyệt qua dữ liệu và chỉ lấy một bản chi tiết cho mỗi sản phẩm
        relatedData.forEach(item => {
            const productId = item.product.id;
            if (!seenProductIds.has(productId)) {
                uniqueRelatedProducts.push({
                    id: item.id,
                    product: {
                        id: item.product.id,
                        productName: item.product.productName,
                        mainImage: item.product.mainImage,
                        brand: {
                            brandName: item.product.brand?.brandName || 'Unknown'
                        }
                    },
                    price: item.price,
                    originalPrice: item.originalPrice
                });
                seenProductIds.add(productId);  // Đánh dấu rằng đã lấy chi tiết của sản phẩm này
            }
        });

        // Chỉ lấy 4 sản phẩm đầu tiên sau khi đã lọc
        return uniqueRelatedProducts.slice(0, 4);
    } catch (error) {
        console.error("Error fetching related products:", error);
        return [];
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

        const response = await api.get(`/product-detail/find-by-attributes?productId=${productId}&colorId=${colorId}&sizeId=${sizeId}`)

        console.log('API res (product detail by attributes):', response.data);
        return response.data.data || null; // Trả về null nếu không có dữ liệu
    } catch (error) {
        console.error('Error in fetchProductDetailByAttributes:', error);
        return null; // Trả về null thay vì ném lỗi
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

// export const getCartDetails = async (customerId) => {
//     try {
//         const response = await api.get(`/cart-details/cart/${customerId}`);
//         return response.data.data || [];
//     } catch (error) {
//         console.error("Error fetching cart details:", error);
//         return [];
//     }
// };
export const getCartDetails = async (cartId) => {
    try {
        const response = await api.get(`/cart-details/cart/${cartId}`);
        console.log("API res (cart details):", response.data);
        // Đảm bảo luôn trả về object hoặc mảng hợp lệ
        return response.data || { data: [] };
    } catch (error) {
        console.error("Error fetching cart details:", error);
        return { data: [] }; // Trả về mặc định nếu lỗi
    }
};
export const removeFromCartApi = async (cartDetailId) => {
    try {
        const response = await api.delete(`/cart-details/${cartDetailId}`);
        console.log("API res (remove from cart):", response.data);
        return response.data;
    } catch (error) {
        console.error("Error removing from cart:", error);
        throw error;
    }
};



export const updateCartQuantity = async (cartDetailId, quantity) => {
    try {
        const response = await api.put(`/cart-details/update-quantity/${cartDetailId}`, { quantity });
        console.log("API res (update cart quantity):", response.data);
        return response.data.data || response.data;
    } catch (error) {
        console.error("Error updating cart quantity:", error);
        throw error;
    }
};
export const fetchCustomerProfile = async (token) => {
    try {
        const response = await axios.get('http://localhost:8080/authCustomer/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('Profile API response:', response.data);

        // Kiểm tra cấu trúc response
        if (response.data?.customerId || response.data?.data?.customerId) {
            return response.data.data || response.data;
        }
        throw new Error('Invalid profile response structure');
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
    }
};
// Lấy hoặc tạo giỏ hàng theo customerId
export const getOrCreateCart = async (customerId) => {
    try {
        const response = await api.get(`carts/get-or-create/${customerId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    // Authorization header sẽ được tự động thêm bởi interceptor từ AuthContext
                }
            }
        );

        // Xử lý response theo cấu trúc API của bạn
        if (response.data?.status === 200) {
            return response.data.data; // Trả về cartResponse
        }

        // Xử lý các trường hợp lỗi từ API
        if (response.data?.status === 401) {
            throw new Error('Unauthorized: Please login again');
        }
        if (response.data?.status === 403) {
            throw new Error(response.data.message || 'Token expired or invalid');
        }

        throw new Error(response.data?.message || 'Failed to get cart');
    } catch (error) {
        console.error('Cart API Error:', {
            url: error.config?.url,
            status: error.response?.status,
            data: error.response?.data
        });
        throw error;
    }
};

// Các hàm API hiện có giữ nguyên, chỉ bổ sung những hàm cần thiết
export const getTokenCustomer = async (email, password) => {
    const body = { email, password };
    try {
        const response = await axios.post(`${API_BASE_URL}/authCustomer/token`, body);
        console.log('API res (customer token):', response);

        // Kiểm tra mã trạng thái HTTP thay vì response.data.status
        if (response.status !== 200) {
            throw new Error(response.data.message || 'Đăng nhập thất bại từ server');
        }

        return response.data; // Trả về toàn bộ response.data
    } catch (error) {
        console.error('Error fetching customer token:', error.response?.data || error.message);
        throw error.response?.data?.message || error.message || 'Lỗi không xác định';
    }
};

export const createOrder = async (cartId, orderData) => {
    try {
        const response = await api.post(`/order/checkout/${cartId}`, orderData);
        console.log('Create Order Response:', response.data);
        return response;
    } catch (error) {
        console.error('Error creating order:', error.response?.data || error.message);
        throw error;
    }
};
export const createGuestOrder = async (orderData) => {
    try {
        const response = await api.post('/order/checkout/guest', orderData);
        console.log('API res (create guest order):', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating guest order:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            errorData: error.response?.data,
        });
        throw new Error(error.response?.data?.message || 'Lỗi khi tạo đơn hàng cho khách vãng lai');
    }
};
export const clearCartOnServer = async (cartId) => {
    try {
        const response = await api.delete(`/carts/${cartId}`);
        console.log('API res (clear cart):', response.data);
        return response.data;
    } catch (error) {
        console.error('Error clearing cart on server:', error);
        throw error;
    }
};
export const fetchOrderByCode = async (orderCode) => {
    try {
      const response = await axios.get(`/order/code/${orderCode}`);
      return response.data.data; // Giả sử API trả về data trong property data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không tìm thấy đơn hàng');
    }
  };
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
  export const sendOrderConfirmationEmail = async (email, orderCode, customerName, totalAmount, paymentMethod) => {
    try {
        const payload = {
            email,
            orderCode,
            customerName,
            totalAmount,
            paymentMethod
        };
        console.log('Sending order confirmation email with payload:', payload);
        const response = await api.post('/mail/send-order-confirmation', payload);
        console.log('API res (send order confirmation email):', response.data);
        return response.data;
    } catch (error) {
        console.error('Error sending order confirmation email:', {
            url: error.config?.url,
            status: error.response?.status,
            errorData: error.response?.data,
            requestData: error.config?.data
        });
        throw new Error(error.response?.data?.message || 'Không thể gửi email xác nhận đơn hàng');
    }
};
export const checkPaymentAndOrder = async (orderId, orderData) => {
    try {
        const response = await api.post(`/counter/casso/check-payment-and-order?orderId=${orderId}`, orderData);
        console.log('API res (check payment and order):', response.data);
        return response.data; // Trả về dữ liệu từ API
    } catch (error) {
        console.error('Error checking payment and ordering:', {
            url: error.config?.url,
            status: error.response?.status,
            errorData: error.response?.data,
            requestData: error.config?.data
        });
        throw new Error(error.response?.data?.message || 'Không thể kiểm tra thanh toán và đặt hàng');
    }
};