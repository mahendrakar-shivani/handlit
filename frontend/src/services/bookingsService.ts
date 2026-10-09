import api from './api';

export const createBooking = async (data: {
  providerId: string;
  serviceId: string;
  scheduledAt: string;
  address: string;
  totalAmount: number;
}) => {
  const res = await api.post('/bookings', data);
  return res.data;
};

export const getMyBookings = async (params?: {
  status?: string;
  page?: number;
  limit?: number;
}) => {
  const res = await api.get('/bookings', { params });
  return res.data;
};

export const getBookingById = async (id: string) => {
  const res = await api.get(`/bookings/${id}`);
  return res.data;
};

export const cancelBooking = async (id: string) => {
  const res = await api.patch(`/bookings/${id}/cancel`);
  return res.data;
};