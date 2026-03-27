import { useNuxtApp } from "#app";
import { useAuthStore } from "@/store/index";
import { API_ENDPOINTS } from "@/utils/constants/api";

let refreshInFlight = null;

const refreshAccessTokenSingleFlight = async () => {
  if (refreshInFlight) {
    return refreshInFlight;
  }

  refreshInFlight = (async () => {
    const { $axios } = useNuxtApp();
    const authStore = useAuthStore();

    const response = await $axios.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN.url, {
      refreshToken: authStore.refreshToken,
    });

    authStore.setTokens(
      response.data.access.token,
      response.data.refresh.token,
    );
  })().finally(() => {
    refreshInFlight = null;
  });

  return refreshInFlight;
};

export const apiService = {
  async request(endpoint, data = {}, params = {}) {
    const { $axios } = useNuxtApp();
    const authStore = useAuthStore();
    let url = endpoint.url;

    // Replace URL parameters
    if (params.id) {
      url = url.replace(":id", params.id);
    }

    const config = {
      method: endpoint.method,
      url: url,
      data,
      _retry: false,
    };

    // Handle query parameters
    if (Object.keys(params).length > 0) {
      const urlParams = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        if (Array.isArray(value)) {
          value.forEach((val) => urlParams.append(key, val));
        } else {
          urlParams.append(key, value);
        }
      }
      config.url += `${config.url.includes("?") ? "&" : "?"}${urlParams.toString()}`;
    }

    // If the endpoint requires authentication
    if (endpoint.requireAuth) {
      config.requireAuth = true;
    }

    try {
      const response = await $axios(config);
      return response.data;
    } catch (error) {
      const isRefreshEndpoint =
        endpoint?.url === API_ENDPOINTS.AUTH.REFRESH_TOKEN.url;

      if (
        error.response?.status === 401 &&
        authStore.refreshToken &&
        !isRefreshEndpoint &&
        !config._retry
      ) {
        config._retry = true;
        try {
          await refreshAccessTokenSingleFlight();
          const retryResponse = await $axios(config);
          return retryResponse.data;
        } catch (refreshError) {
          authStore.clearTokens();
          throw refreshError;
        }
      }
      throw error.response?.data || error;
    }
  },

  async refreshToken() {
    await refreshAccessTokenSingleFlight();
  },
};
