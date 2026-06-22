import axios from "axios";

// Если VITE_API_URL не задан — работаем через Vite proxy (/api → localhost:5000/api)
const baseURL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL,
  timeout: 10000,
});

// Бэкенд отдаёт { message, data } или { message, count, data }
// Перехватчик разворачивает .data чтобы сервисы получали сразу данные
api.interceptors.response.use(
  (response) => response.data?.data ?? response.data,
  (error) => Promise.reject(error),
);

export default api;
