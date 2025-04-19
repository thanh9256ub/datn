import axios from 'axios';

export const API_BASE_URL = 'http://localhost:8080';
export const VIETTEL_POST_API = 'https://partner.viettelpost.vn/v2/categories';

const defaultHeaders = { 'Content-Type': 'application/json' };

export const fetchCustomers = () => axios.get(`${API_BASE_URL}/customer/list`);
export const fetchCustomerAddresses = () => axios.get(`${API_BASE_URL}/address`);
export const fetchProvinces = () => axios.get(`${API_BASE_URL}/counter/provinces`);
export const fetchDistricts = (provinceId) => axios.get(`${API_BASE_URL}/counter/districts?provinceId=${provinceId}`);
export const fetchWards = (districtId) => axios.get(`${API_BASE_URL}/counter/wards?districtId=${districtId}`);
export const fetchPromoCodes = () => axios.get(`${API_BASE_URL}/vouchers/list`);
export const fetchOrderDetails = () => axios.get(`${API_BASE_URL}/order-detail`);
export const fetchOrders = () => axios.get(`${API_BASE_URL}/order`);
export const fetchProducts = () => axios.get(`${API_BASE_URL}/product-detail`);

export const fetchShippingFee = (body) =>
  axios.post(`${API_BASE_URL}/counter/get-price`, body, { headers: defaultHeaders });

export const addCustomer = (customer) =>
  axios.post(`${API_BASE_URL}/customer/addFast`, customer);

export const addInvoice = (invoice) =>
  axios.post(`${API_BASE_URL}/order/add`, invoice);

export const updateOrderStatus = (orderId, status) =>
  axios.put(`${API_BASE_URL}/order/edit/${orderId}`, { status });

export const addToCart = (orderId, productId, quantity) =>
  axios.get(`${API_BASE_URL}/counter/add-to-cart?orderID=${orderId}&productID=${productId}&purchaseQuantity=${quantity}`);

export const updateCartQuantity = (orderDetailID, productDetailID, quantity) =>
  axios.get(`${API_BASE_URL}/counter/update-quantity?orderDetailID=${orderDetailID}&productDetailID=${productDetailID}&quantity=${quantity}`);

export const confirmPayment = (orderId, body) =>
  axios.post(`${API_BASE_URL}/counter/comfirm/${orderId}`, body, { headers: defaultHeaders });

export const updatePromoCode = (promoId, promo) =>
  axios.put(`${API_BASE_URL}/vouchers/edit/${promoId}`, promo);

export const addOrderVoucher = (orderId, voucherId) =>
  axios.post(`${API_BASE_URL}/order-voucher/add`, { orderId, voucherId, status: 1 });

export const addCustomerAddress = (addressPayload) =>
  axios.post(`${API_BASE_URL}/address/add`, addressPayload);

export const checkVNPayPaymentStatus = (orderId) =>
  axios.get(`${API_BASE_URL}/vnpay/check-payment-status?orderId=${orderId}`);

export const generateZaloPayPayment = (body) =>
  axios.post(`${API_BASE_URL}/counter/zalopay/payment`, body, { headers: defaultHeaders });

export const checkZaloPayPaymentStatus = (transactionId) =>
  axios.get(`${API_BASE_URL}/counter/zalopay/check-payment-status?transactionId=${transactionId}`);

export const handleCassoWebhook = () =>
  axios.post(`https://oauth.casso.vn/v2/transactions`, {
    headers: {
      ...defaultHeaders,
      Authorization: 'Apikey AK_CS.2cb7a1d00c7e11f097089522635f3f80.vKo3BAFDtz8c3vnVSliZ9KKQ2mrvLufagmFwVu9mSmKHUlQmzLgmEzybGLns1tYUm1lX7DVn',
    },
  });

  export const fetchCassoTransactions = () =>
    axios.post(`${API_BASE_URL}/counter/casso/transactions`);
