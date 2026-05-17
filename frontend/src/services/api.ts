import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const isProviderRoute = window.location.pathname.startsWith('/provider');
  const token = isProviderRoute
    ? localStorage.getItem('providerToken')
    : localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const path = window.location.pathname;
      if (path !== '/provider/login' && path !== '/login') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('providerToken');
        localStorage.removeItem('provider');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;