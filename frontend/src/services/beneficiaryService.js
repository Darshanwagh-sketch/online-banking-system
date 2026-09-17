import API from './api';

export const beneficiaryService = {
  getBeneficiaries: () => API.get('/beneficiaries'),
  addBeneficiary: (data) => API.post('/beneficiaries', data),
  deleteBeneficiary: (id) => API.delete(`/beneficiaries/${id}`),
};
