import axios from 'axios';

// API Endpoints
export const API_BASE_URL = 'http://localhost:8080';
export const VIETTEL_POST_API = 'https://partner.viettelpost.vn/v2/categories';

// API Calls
export const fetchCustomers = () => axios.get(`${API_BASE_URL}/customer/list`);
export const fetchCustomerAddresses = () => axios.get(`${API_BASE_URL}/address`);
export const fetchProvinces = () => axios.get(`${VIETTEL_POST_API}/listProvinceById?provinceId=-1`);
export const fetchDistricts = (provinceId) => axios.get(`${VIETTEL_POST_API}/listDistrict?provinceId=${provinceId}`);
export const fetchWards = (districtId) => axios.get(`${VIETTEL_POST_API}/listWards?districtId=${districtId}`);
export const fetchPromoCodes = () => axios.get(`${API_BASE_URL}/voucher/list`);
export const fetchOrderDetails = () => axios.get(`${API_BASE_URL}/order-detail`);
export const fetchOrders = () => axios.get(`${API_BASE_URL}/order`);
export const fetchProducts = () => axios.get(`${API_BASE_URL}/product-detail`);
export const fetchShippingFee = (body) =>
  axios.post(`${API_BASE_URL}/counter/get-price`, body, {
    headers: { 'Content-Type': 'application/json' },
  });
export const addCustomer = (customer) => axios.post(`${API_BASE_URL}/customer/addFast`, customer);
export const addInvoice = (invoice) => axios.post(`${API_BASE_URL}/order/add`, invoice);
export const updateOrderStatus = (orderId, status) =>
  axios.put(`${API_BASE_URL}/order/edit/${orderId}`, { status });
export const addToCart = (orderId, productId, quantity) =>
  axios.get(`${API_BASE_URL}/counter/add-to-cart?orderID=${orderId}&productID=${productId}&purchaseQuantity=${quantity}`);
export const updateCartQuantity = (orderDetailID, productDetailID, quantity) =>
  axios.get(`${API_BASE_URL}/counter/update-quantity?orderDetailID=${orderDetailID}&productDetailID=${productDetailID}&quantity=${quantity}`);
export const confirmPayment = (orderId, body) =>
  axios.post(`${API_BASE_URL}/counter/comfirm/${orderId}`, body, {
    headers: { 'Content-Type': 'application/json' },
  });
export const updatePromoCode = (promoId, promo) =>
  axios.put(`${API_BASE_URL}/voucher/edit/${promoId}`, promo);
export const addOrderVoucher = (orderId, voucherId) =>
  axios.post(`${API_BASE_URL}/order-voucher/add`, {
    orderId,
    voucherId,
    status: 1,
  });
export const addCustomerAddress = (addressPayload) =>
  axios.post(`${API_BASE_URL}/address/add`, addressPayload);
