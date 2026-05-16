import api from './api';

export const changePassword = async (data: {
  oldPassword: string;
  newPassword: string;
}) => {
  const res = await api.post('/auth/change-password', data);
  return res.data;
};

export const updateProfile = async (data: {
  name?: string;
  phone?: string;
}) => {
  const res = await api.patch('/auth/profile', data);
  return res.data;
};