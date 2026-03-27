import axios from "axios";
import { API_BASE_URL } from "@/utils/constants/api";
import { useAuthStore } from "@/store/index";

export default defineNuxtPlugin((nuxtApp) => {
  const authStore = useAuthStore();
  const apiClient = axios.create({
    baseURL: API_BASE_URL,
  });

  apiClient.interceptors.request.use(
    (config) => {
      if (config.requireAuth) {
        // Try to get token from store first, then fallback to localStorage
        let token = authStore.accessToken;
        if (!token && process.client) {
          token = localStorage.getItem("accessToken");
        }
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => Promise.reject(error),
  );
  nuxtApp.provide("axios", apiClient);
});
