import API from './api';

export const notificationService = {
  getNotifications: () => API.get('/notifications'),
  getUnreadCount: () => API.get('/notifications/unread-count'),
  markAsRead: (id) => API.put(`/notifications/${id}/read`),
};
