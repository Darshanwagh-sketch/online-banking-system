import API from './api';

export const authService = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getProfile: () => API.get('/users/profile'),
  updateProfile: (data) => API.put('/users/profile', data),
  changePassword: (data) => API.put('/users/change-password', data),
  logout: () => {
    localStorage.removeItem('securebank_user');
  },
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('securebank_user'));
  }
};
