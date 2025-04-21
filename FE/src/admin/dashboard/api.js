  import axios from 'axios';
  
  export const API_BASE_URL = 'http://localhost:8080';
  
  
  
  
  export const fetchDashboardStatus5 = () =>
    axios.get(`${API_BASE_URL}/order/dashboard-status5`);
  
  export const fetchDashboardStatus2 = () =>
    axios.get(`${API_BASE_URL}/order/dashboard-status2`);
  
  export const fetchDashboardProduct = () =>
    axios.get(`${API_BASE_URL}/order/dashboard-product`);
  
  export const fetchDashboardRevenue = () =>
    axios.get(`${API_BASE_URL}/order/dashboard-revenue`);