const envApiBaseUrl =
  import.meta.env.NUXT_PUBLIC_API_BASE_URL ||
  process.env.NUXT_PUBLIC_API_BASE_URL ||
  "";
const devFallbackApiBaseUrl = import.meta.env.DEV
  ? "http://localhost:4000/v1"
  : "";
export const API_BASE_URL = (envApiBaseUrl || devFallbackApiBaseUrl).replace(
  /\/$/,
  "",
);

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: { method: "POST", url: "/auth/login" },
    REGISTER: { method: "POST", url: "/auth/register" },
    GET_USER_DATA: {
      method: "GET",
      url: "/auth/get-user-data",
      requireAuth: true,
    },
    UPDATE_USER_DATA: {
      method: "PATCH",
      url: "/auth/update-user-data",
      requireAuth: true,
    },
    NAVIGATION: {
      GET_ALL: { method: "GET", url: "/navigations/get-all" },
    },
    ADS: {
      CREATE_AD: { method: "POST", url: "/ads", requireAuth: true },
      GET_USER_ADS: {
        method: "GET",
        url: "/ads/user/getAll",
        requireAuth: true,
      },
    },
    REFRESH_TOKEN: { method: "POST", url: "/auth/refresh-tokens" },
    LOGOUT: { method: "POST", url: "/auth/logout" },
  },
  CATEGORIES: {
    GET: { method: "GET", url: "/categories" },
    GET_BY_ID: (id) => ({ method: "GET", url: `/categories?categoryId=${id}` }),
  },
  FEATURED_CATEGORIES: {
    GET_ALL: { method: "GET", url: "/featured-categories/all" },
  },
  NAVIGATION: {
    GET_ALL: { method: "GET", url: "/navigations/get-all" },
  },
  ADS: {
    CREATE_AD: { method: "POST", url: "/ads", requireAuth: true },
    GET_USER_ADS: { method: "GET", url: "/ads/user/getAll", requireAuth: true },
    GET_BY_ID: (id) => ({ method: "GET", url: `/ads/${id}` }),
    GET_BY_CATEGORY: (categoryId) => ({
      method: "GET",
      url: `/ads?category=${categoryId}`,
    }),
    GET_ALL: { method: "GET", url: "/ads" },
    GET_BY_SECTION: (section, limit = 10) => ({
      method: "GET",
      url: `/ads?section=${section}&limit=${limit}&sortBy=createdDate:desc`,
    }),
    DELETE_AD: (id) => ({
      method: "DELETE",
      url: `/ads/${id}`,
      requireAuth: true,
    }),
  },
  DYNAMIC_FIELDS: {
    GET: { method: "GET", url: "/dynamic-fields" },
  },
  REVIEWS: {
    GET_BY_SECTION: (section, limit = 10) => ({
      method: "GET",
      url: `/reviews/get-section-reviews?section=${section}&limit=${limit}`,
    }),
    GET_BY_AD: (adId, limit = 10) => ({
      method: "GET",
      url: `/reviews/get-ad-reviews?adId=${adId}&limit=${limit}`,
    }),
    ADD: { method: "POST", url: "/reviews/add-review", requireAuth: true },
  },
  FAVORITES: {
    GET_ALL: { method: "GET", url: "/favorites", requireAuth: true },
    ADD: (id) => ({
      method: "POST",
      url: `/favorites/${id}`,
      requireAuth: true,
    }),
    REMOVE: (id) => ({
      method: "DELETE",
      url: `/favorites/${id}`,
      requireAuth: true,
    }),
    CHECK: (id) => ({
      method: "GET",
      url: `/favorites/${id}`,
      requireAuth: true,
    }),
  },
  BOOKINGS: {
    CREATE: { method: "POST", url: "/bookings", requireAuth: true },
    GET_BY_ID: (id) => ({
      method: "GET",
      url: `/bookings/${id}`,
      requireAuth: true,
    }),
    CHECK_REVIEW: (adId) => ({
      method: "GET",
      url: `/bookings/check-review/${adId}`,
      requireAuth: true,
    }),
  },
};
