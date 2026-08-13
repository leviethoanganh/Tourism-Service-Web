import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

export const API_URL = "http://192.168.1.117:5000/api/v1";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// Tự động đính kèm token vào mọi request
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Nếu backend trả 401 → xoá token cũ
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync("token");
      router.replace("/(auth)/login");
    }
    return Promise.reject(error);
  }
);

export default api;
