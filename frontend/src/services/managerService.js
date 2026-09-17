import API from './api';

export const managerService = {
  getPendingApprovals: () => API.get('/manager/approvals'),
  processApproval: (transactionId, approve) => API.post(`/manager/approvals/${transactionId}?approve=${approve}`),
  getAnalytics: () => API.get('/manager/analytics'),
};
