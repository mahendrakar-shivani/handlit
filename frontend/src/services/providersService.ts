import api from './api';

export const getProviders = async (params?: {
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const res = await api.get('/providers', { params });
  return res.data;
};

export const getProviderById = async (id: string) => {
  const res = await api.get(`/providers/${id}`);
  return res.data;
};

export const getProviderReviews = async (providerId: string) => {
  const res = await api.get(`/reviews/provider/${providerId}`);
  return res.data;
};