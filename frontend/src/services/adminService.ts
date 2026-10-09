import api from './api';

export const getStats = async () => {
  const res = await api.get('/admin/stats');
  return res.data;
};

export const getAdminUsers = async (page = 1) => {
  const res = await api.get('/admin/users', { params: { page } });
  return res.data;
};

export const getAdminProviders = async (page = 1) => {
  const res = await api.get('/admin/providers', { params: { page } });
  return res.data;
};

export const verifyProvider = async (id: string) => {
  const res = await api.patch(`/admin/providers/${id}/verify`);
  return res.data;
};

export const banUser = async (id: string) => {
  const res = await api.patch(`/admin/users/${id}/ban`);
  return res.data;
};

export const getAdminBookings = async (page = 1) => {
  const res = await api.get('/admin/bookings', { params: { page } });
  return res.data;
};