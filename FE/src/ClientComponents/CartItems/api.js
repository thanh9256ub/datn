import axios from 'axios';

export const API_BASE_URL = 'http://localhost:8080';
export const fetchProducts = () => axios.get(`${API_BASE_URL}/product-detail`);