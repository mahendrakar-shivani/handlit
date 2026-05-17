import api from './api';

export const createOrder = async (bookingId: string) => {
  const res = await api.post('/payments/create-order', { bookingId });
  return res.data;
};

export const verifyPayment = async (data: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) => {
  const res = await api.post('/payments/verify', data);
  return res.data;
};

export const getPaymentByBooking = async (bookingId: string) => {
  const res = await api.get(`/payments/booking/${bookingId}`);
  return res.data;
};