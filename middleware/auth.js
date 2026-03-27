import { useAuthStore } from "@/store/index";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore();
  if (import.meta.client) {
    if (authStore.isLoading) {
      authStore.loadTokensFromStorage();
    }
    const isAuthenticated = authStore.isAuthenticated;
    const isLoginPage = to.path === "/auth/login";
    const isRegisterPage = to.path === "/auth/register";
    const isLandingPage = to.path === "/landing";
    const isHomePage = to.path === "/";
    const isCategoriesPage = to.path.startsWith("/categories");
    const isItemsPage = to.path.startsWith("/items");

    // Allow access to public pages for guests
    const isPublicPage =
      isLandingPage || isHomePage || isCategoriesPage || isItemsPage;

    // If user is not auth
    if (!isAuthenticated && (isLoginPage || isRegisterPage || isPublicPage)) {
      return;
    }
    // If user is auth
    if (isAuthenticated && (isLoginPage || isRegisterPage)) {
      return navigateTo("/");
    }
    // If user is not auth and trying to access protected routes
    if (!isAuthenticated && !isLoginPage && !isRegisterPage && !isPublicPage) {
      return navigateTo("/auth/login");
    }
  }
});
