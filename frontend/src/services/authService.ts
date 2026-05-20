import api from './api';

export const login = async (
  email: string,
  password: string,
  role: string
) => {

  let endpoint = '/auth/login';

  if (role === 'provider') {
    endpoint = '/providers/login';
  }

  if (role === 'admin') {
    endpoint = '/admin/login';
  }

  const res = await api.post(endpoint, {
    email,
    password,
  });

  return res.data;
};

export const register = async (data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}) => {

  const res = await api.post(
    '/auth/register',
    data
  );

  return res.data;
};

export const changePassword = async (data: {
  oldPassword: string;
  newPassword: string;
}) => {

  const res = await api.post(
    '/auth/change-password',
    data
  );

  return res.data;
};

export const updateProfile = async (data: {
  name?: string;
  phone?: string;
}) => {

  const res = await api.patch(
    '/auth/profile',
    data
  );

  return res.data;
};