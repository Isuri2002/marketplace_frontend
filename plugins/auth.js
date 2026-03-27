import { useAuthStore } from '@/store/index';

export default defineNuxtPlugin(async (nuxtApp) => {
    const authStore = useAuthStore();
    if(import.meta.client) {
        authStore.loadTokensFromStorage();
    }
});