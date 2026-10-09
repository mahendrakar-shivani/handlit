import api from './api';

export const createReview = async (data: {
  bookingId: string;
  providerId: string;
  rating: number;
  comment?: string;
}) => {
  const res = await api.post('/reviews', data);
  return res.data;
};