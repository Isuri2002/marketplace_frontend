import axios from "axios";
import { useAuthStore } from "@/store/index";

export default defineNuxtPlugin((nuxtApp) => {
  const authStore = useAuthStore();
  const runtimeConfig = useRuntimeConfig();
  const baseURL = String(runtimeConfig.public.apiBaseUrl || "").replace(
    /\/$/,
    "",
  );
  const apiClient = axios.create({
    baseURL,
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
