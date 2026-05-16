import api from './api';

export const getServices = async (params?: {
  categoryId?: string;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const res = await api.get('/services', { params });
  return res.data;
};

export const getServiceById = async (id: string) => {
  const res = await api.get(`/services/${id}`);
  return res.data;
};

export const getCategories = async () => {
  const res = await api.get('/categories');
  return res.data;
};