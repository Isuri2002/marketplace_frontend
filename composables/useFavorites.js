import { ref } from "vue";
import { apiService } from "~/services/apiService";
import { API_ENDPOINTS } from "~/utils/constants/api";
import { useAuthStore } from "~/store/index";

// Store favorited ad IDs globally
const favoritedAdIds = ref(new Set());
const isLoadingFavorites = ref(false);
const favoritesLoaded = ref(false);
const activeFavoritesUserKey = ref(null);
const FAVORITES_STORAGE_PREFIX = "favoritedAdIds:";

const parseJwtPayload = (token) => {
  if (!token || typeof token !== "string") return null;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const normalized = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const payload = JSON.parse(atob(normalized));
    return payload;
  } catch {
    return null;
  }
};

export const useFavorites = () => {
  const authStore = useAuthStore();

  const getCurrentUserStorageKey = () => {
    if (!process.client) return null;
    const token = authStore.accessToken || localStorage.getItem("accessToken");
    if (!token) return null;
    const payload = parseJwtPayload(token);
    const userId =
      payload?.sub || payload?.id || payload?._id || payload?.email;
    if (!userId) return null;
    return `${FAVORITES_STORAGE_PREFIX}${String(userId)}`;
  };

  const readCachedFavoritesForCurrentUser = () => {
    if (!process.client) return [];
    const key = getCurrentUserStorageKey();
    if (!key) return [];
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.warn("Failed to read cached favorites", e);
      return [];
    }
  };

  const persistToStorage = () => {
    if (!process.client) return;
    const key = getCurrentUserStorageKey();
    if (!key) return;
    localStorage.setItem(key, JSON.stringify(Array.from(favoritedAdIds.value)));
  };

  const clearFavoritesCache = ({ clearStored = false } = {}) => {
    favoritedAdIds.value = new Set();
    favoritesLoaded.value = false;
    if (process.client && clearStored) {
      const key = getCurrentUserStorageKey();
      if (key) localStorage.removeItem(key);
    }
  };

  const syncActiveUserContext = () => {
    const currentKey = getCurrentUserStorageKey();
    if (activeFavoritesUserKey.value !== currentKey) {
      // User changed (or logged out): reset volatile favorites state
      favoritedAdIds.value = new Set();
      favoritesLoaded.value = false;
      activeFavoritesUserKey.value = currentKey;
    }
    return currentKey;
  };

  const hydrateFromUserCache = () => {
    const cached = readCachedFavoritesForCurrentUser();
    favoritedAdIds.value = new Set(cached);
    return favoritedAdIds.value;
  };
  /**
   * Fetch all favorited ad IDs for the current user
   */
  const loadFavorites = async () => {
    if (!authStore.isAuthenticated) {
      activeFavoritesUserKey.value = null;
      clearFavoritesCache({ clearStored: false });
      return favoritedAdIds.value;
    }

    syncActiveUserContext();

    if (isLoadingFavorites.value || favoritesLoaded.value) {
      return favoritedAdIds.value;
    }

    // Hydrate quickly from current user's cache to avoid flicker.
    hydrateFromUserCache();

    isLoadingFavorites.value = true;
    try {
      const response = await apiService.request(
        API_ENDPOINTS.FAVORITES.GET_ALL,
        {},
        {},
      );

      // Extract ad IDs from favorites
      const ids = (response.results || [])
        .filter((fav) => fav.adId && fav.adId._id)
        .map((fav) => fav.adId._id);

      // Use current user's cached data as fallback when server is temporarily stale.
      const cached = readCachedFavoritesForCurrentUser();

      if (ids.length === 0 && Array.isArray(cached) && cached.length > 0) {
        // Keep the cached IDs until the server confirms they are gone
        favoritedAdIds.value = new Set(cached);
        console.warn(
          "Server returned no favorites — preserving local cache until confirmed.",
        );
      } else {
        // Merge server IDs with user cache so optimistic updates are not lost.
        const merged = new Set([
          ...(ids || []),
          ...(Array.isArray(cached) ? cached : []),
        ]);
        favoritedAdIds.value = merged;
      }

      // Persist merged/current state into the current user's scoped cache.
      persistToStorage();

      favoritesLoaded.value = true;
      console.log("Loaded favorite IDs:", Array.from(favoritedAdIds.value));

      return favoritedAdIds.value;
    } catch (error) {
      console.error("Failed to load favorites:", error);
      const statusCode =
        error?.code || error?.statusCode || error?.response?.status || 0;
      if (statusCode === 401) {
        clearFavoritesCache({ clearStored: false });
        return favoritedAdIds.value;
      }

      // Fall back to the current user's cached favorites when API fails.
      const cachedIds = readCachedFavoritesForCurrentUser();
      favoritedAdIds.value = new Set(cachedIds);
      favoritesLoaded.value = statusCode !== 401;
      return favoritedAdIds.value;
    } finally {
      isLoadingFavorites.value = false;
    }
  };

  /**
   * Check if an ad is favorited
   */
  const isFavorite = (adId) => {
    if (!authStore.isAuthenticated) return false;
    return favoritedAdIds.value.has(adId);
  };

  /**
   * Add ad to favorites (update local state)
   */
  const addToFavorites = (adId) => {
    syncActiveUserContext();
    favoritedAdIds.value.add(adId);
    persistToStorage();
  };

  /**
   * Remove ad from favorites (update local state)
   */
  const removeFromFavorites = (adId) => {
    syncActiveUserContext();
    favoritedAdIds.value.delete(adId);
    persistToStorage();
  };

  /**
   * Mark ads with isFavorite property
   */
  const markFavoriteAds = (ads) => {
    return ads.map((ad) => ({
      ...ad,
      isFavorite: isFavorite(ad.id || ad._id),
    }));
  };

  /**
   * Reset favorites state (on logout)
   */
  const resetFavorites = () => {
    activeFavoritesUserKey.value = null;
    clearFavoritesCache({ clearStored: false });
  };

  return {
    loadFavorites,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    markFavoriteAds,
    resetFavorites,
    favoritedAdIds,
    isLoadingFavorites,
    favoritesLoaded,
  };
};
