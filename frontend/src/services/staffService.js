import API from './api';

export const staffService = {
  getCustomers: () => API.get('/staff/customers'),
  getAccounts: () => API.get('/staff/accounts'),
  updateAccountStatus: (accountId, status) => API.put(`/staff/accounts/${accountId}/status?status=${status}`),
  getTransactions: () => API.get('/staff/transactions'),
  getAlerts: () => API.get('/staff/alerts'),
  getTickets: () => API.get('/support/tickets/all'),
  updateTicketStatus: (id, status) => API.put(`/support/tickets/${id}/status?status=${status}`),
};
