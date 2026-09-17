import API from './api';

export const transactionService = {
  deposit: (accountId, data) => API.post(`/accounts/${accountId}/deposit`, data),
  withdraw: (accountId, data) => API.post(`/accounts/${accountId}/withdraw`, data),
  transfer: (data) => API.post('/transactions/transfer', data),
  getTransactions: (page = 0, size = 10) => API.get(`/transactions?page=${page}&size=${size}`),
};
