import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token dynamically
API.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('securebank_user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global Error Interceptor
API.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('securebank_user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    const data = error.response?.data;
    let message = data?.message || error.message || 'An error occurred';
    if (data?.validationErrors && Object.keys(data.validationErrors).length > 0) {
      const fieldDetails = Object.entries(data.validationErrors)
        .map(([field, msg]) => `• ${field.toUpperCase()}: ${msg}`)
        .join('\n');
      message = `Validation Failed:\n${fieldDetails}`;
    }
    const errObj = new Error(message);
    errObj.validationErrors = data?.validationErrors || {};
    return Promise.reject(errObj);
  }
);

export default API;
