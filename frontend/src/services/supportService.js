import API from './api';

export const supportService = {
  getTickets: () => API.get('/support/tickets'),
  createTicket: (data) => API.post('/support/tickets', data),
};
