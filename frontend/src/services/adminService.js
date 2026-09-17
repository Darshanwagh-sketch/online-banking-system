import API from './api';

export const adminService = {
  getUsers: () => API.get('/admin/users'),
  createUser: (data, role) => API.post(`/admin/users?role=${role}`, data),
  updateUserStatus: (userId, enabled) => API.put(`/admin/users/${userId}/status?enabled=${enabled}`),
  assignRole: (userId, role) => API.put(`/admin/users/${userId}/role?role=${role}`),
  getAuditLogs: () => API.get('/admin/audit-logs'),
};
