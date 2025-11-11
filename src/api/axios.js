import axios from 'axios';

const baseURL =
  (import.meta.env?.VITE_API_BASE_URL && import.meta.env.VITE_API_BASE_URL.trim()) ||
  'http://localhost:8080';

const apiClient = axios.create({
  baseURL,
  withCredentials: true,
});

apiClient.interceptors.response.use(
  response => response,
  error => {
    const normalizedError = error?.response || error;
    return Promise.reject(normalizedError);
  }
);

export default apiClient;




