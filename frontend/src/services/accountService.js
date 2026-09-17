import API from './api';

export const accountService = {
  getAccounts: () => API.get('/accounts'),
  getAccountById: (id) => API.get(`/accounts/${id}`),
  createAccount: (data) => API.post('/accounts', data),
};
