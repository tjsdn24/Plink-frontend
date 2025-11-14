import axios from 'axios';

const baseURL =
  (import.meta.env?.VITE_API_BASE_URL && import.meta.env.VITE_API_BASE_URL.trim()) ||
  'https://plink-api.duckdns.org';

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




