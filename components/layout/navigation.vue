<template>
    <div v-if="isClientReady && isReadyToRender" class="fixed top-0 left-0 right-0 z-20">
        <transition name="nav-transition">
            <div v-if="isNavigationVisible" class="drop-shadow-md bg-prim">
                <div class="container pt-5 pb-5">
                    <div class="flex justify-between items-center">
                        <nuxt-link to="/">
                            <div class="w-[120px]">
                                <img src="../../assets/images/logo.png" alt="">
                            </div>
                        </nuxt-link>
                        <div class="hidden lg:flex items-center gap-5 text-white nav-items">
                            <nuxt-link to="/" class="my-[6px]">Home</nuxt-link>
                            <UPopover mode="hover" :popper="{ offsetDistance: 0, placement: 'bottom-start' }">
                                <nuxt-link to="/rent" class="my-[6px]">Rent</nuxt-link>
                                <template #panel>
                                    <div class="w-[300px] p-3 flex flex-col">
                                        <nuxt-link v-for="(item, index) in rentCategories" :key="index" :to="`/categories/${item.id}`" v-show="item.id"
                                            class="p-2 rounded-md duration-300 hover:bg-light-gray text-black category-item">
                                            <div class="flex items-center gap-3">
                                                <UIcon v-if="item.icon?.url" class="text-[30px]" :src="item.icon.url" />
                                                <UIcon v-else class="text-[30px] text-gray-400" name="material-symbols:category" dynamic />
                                                <span>{{ item.name }}</span>
                                            </div>
                                        </nuxt-link>
                                    </div>
                                </template>
                            </UPopover>

                            <UPopover mode="hover" :popper="{ offsetDistance: 0, placement: 'bottom-start' }">
                                <nuxt-link to="/hire" class="my-[6px]">Hire</nuxt-link>
                                <template #panel>
                                    <div class="w-[300px] p-3 flex flex-col">
                                        <nuxt-link v-for="(item, index) in hireCategories" :key="index" :to="`/categories/${item.id}`" v-show="item.id"
                                            class="p-2 rounded-md duration-300 hover:bg-light-gray text-black category-item">
                                            <div class="flex items-center gap-3">
                                                <UIcon v-if="item.icon?.url" class="text-[30px]" :src="item.icon.url" />
                                                <UIcon v-else class="text-[30px] text-gray-400" name="material-symbols:category" dynamic />
                                                <span>{{ item.name }}</span>
                                            </div>
                                        </nuxt-link>
                                    </div>
                                </template>
                            </UPopover>

                            <UPopover mode="hover" :popper="{ offsetDistance: 0, placement: 'bottom-start' }">
                                <nuxt-link to="/buy" class="my-[6px]">Buy</nuxt-link>
                                <template #panel>
                                    <div class="w-[300px] p-3 flex flex-col">
                                        <nuxt-link v-for="(item, index) in buyCategories" :key="index" :to="`/categories/${item.id}`" v-show="item.id"
                                            class="p-2 rounded-md duration-300 hover:bg-light-gray text-black category-item">
                                            <div class="flex items-center gap-3">
                                                <UIcon v-if="item.icon?.url" class="text-[30px]" :src="item.icon.url" />
                                                <UIcon v-else class="text-[30px] text-gray-400" name="material-symbols:category" dynamic />
                                                <span>{{ item.name }}</span>
                                            </div>
                                        </nuxt-link>
                                    </div>
                                </template>
                            </UPopover>



                        </div>
                        <div class="hidden lg:flex items-center gap-5">
                            <button @click="showSectionSelector = true" class="px-4 py-2 rounded-md font-bold bg-sec hover:bg-sec-700 text-white flex items-center gap-2 transition-colors">
                                <UIcon name="i-heroicons:plus" class="text-xl"/>
                                Rent Now
                            </button>
                            <nuxt-link v-if="isUserLoggedIn" to="/user/profile">
                                <UIcon class="text-[35px] text-white hover:text-gray-200 transition-colors" name="material-symbols:chat-outline-rounded" dynamic />
                            </nuxt-link>
                            <div v-if="isUserLoggedIn === false" class="my-[6px] flex items-center gap-5 text-white">
                                <nuxt-link to="/auth/login">Login</nuxt-link>
                                <nuxt-link to="/auth/register">Register</nuxt-link>
                            </div>
                            <UPopover v-if="isUserLoggedIn === true" mode="hover"
                                :popper="{ offsetDistance: 0, placement: 'bottom-end' }">
                                <nuxt-link to="/user/profile">
                                    <UIcon class="text-[35px] text-white" name="material-symbols:account-circle-outline" dynamic />
                                </nuxt-link>
                                <template #panel>
                                    <div class="w-[300px] p-3 flex flex-col">
                                        <button @click="toggleProfileOptions(index)" v-for="(item, index) in profileOptions" :key="index"
                                            class="p-2 rounded-md duration-300 hover:bg-light-gray" :class="item.isMargin ? 'mb-3' : ''">
                                            <div class="flex items-center gap-3 text-black">
                                                <UIcon class="text-[30px] text-black" :name="item.icon" dynamic />
                                                <span>{{ item.name }}</span>
                                            </div>
                                        </button>
                                        <BtnPrimary :is-loading="isLoading" :isBlock="true" size="xl" label="Logout"
                                            variant="outline" @click="logout()" />
                                    </div>
                                </template>
                            </UPopover>
                        </div>
                        <BtnPrimary class="lg:hidden" :isBlock="true" size="md" icon="quill:hamburger"
                            @click="isMobileNavigationOpen = true" />
                    </div>
                </div>
                <div class="lg:hidden">
                    <USlideover v-model="isMobileNavigationOpen">
                        <div class="p-4 flex-1">
                            <UIcon @click="isMobileNavigationOpen = hideMobileNavBar()" class="text-[25px] cursor-pointer"
                                name="material-symbols:close" dynamic />
                            <div class="h-screen flex flex-col justify-center items-center gap-5">
                                <nuxt-link to="/" @click="hideMobileNavBar()">Home</nuxt-link>
                                <nuxt-link to="/rent" @click="hideMobileNavBar()">Rent</nuxt-link>
                                <div v-if="rentCategories.length > 0" class="flex flex-col items-center gap-2 text-sm text-gray-600">
                                    <nuxt-link
                                        v-for="(item, index) in rentCategories.slice(0, 6)"
                                        :key="`mobile-rent-${index}`"
                                        :to="`/categories/${item.id}`"
                                        @click="hideMobileNavBar()"
                                    >
                                        {{ item.name }}
                                    </nuxt-link>
                                </div>
                                <nuxt-link to="/hire" @click="hideMobileNavBar()">Hire</nuxt-link>
                                <nuxt-link to="/buy" @click="hideMobileNavBar()">Buy</nuxt-link>
                                <button @click="showSectionSelector = true; hideMobileNavBar()" 
                                    class="px-6 py-2 rounded-md font-bold bg-sec hover:bg-sec-700 text-white transition-colors">
                                    Post Ad
                                </button>

                                <div class="mt-5 flex justify-center">
                                    <div v-if="!isUserLoggedIn" class="flex gap-5">
                                        <nuxt-link to="/auth/login" @click="hideMobileNavBar()">Login</nuxt-link>
                                        <nuxt-link to="/auth/register" @click="hideMobileNavBar()">Register</nuxt-link>
                                    </div>
                                    <nuxt-link v-if="isUserLoggedIn" to="/user/profile" @click="hideMobileNavBar()">
                                        <UIcon class="text-[35px] text-prim" name="material-symbols:account-circle-outline"
                                            dynamic />
                                    </nuxt-link>
                                </div>
                            </div>
                        </div>
                    </USlideover>
                </div>
            </div>
        </transition>
    </div>
    
    <!-- Section Selector Popup -->
    <SectionSelector 
        :is-visible="showSectionSelector"
        @close-popup="showSectionSelector = false"
    />
</template>

<script setup>
import BtnPrimary from '@/components/ui/buttons/button-primary.vue';
import SectionSelector from '@/components/popups/sectionSelector.vue';
import { useAuthStore } from '@/store/index';
import { apiService } from '../../services/apiService';
import { API_ENDPOINTS } from '@/utils/constants/api';

const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();

const profileOptState = useState('profileState');

const isLoading = ref(false);
const isClientReady = ref(false);
const isReadyToRender = computed(() => !authStore.isLoading);
const isNavigationVisible = ref(true);
let lastScrollTop = ref(0);
const isMobileNavigationOpen = ref(false);
const showSectionSelector = ref(false);
const categories = ref([]);
// Per-section categories shown on hover (prefetched)
const rentCategories = ref([]);
const hireCategories = ref([]);
const buyCategories = ref([]);

const profileOptions = reactive([
    { name: 'Borrower Profile', icon: 'material-symbols:deployed-code-account-outline-rounded' },
    { name: 'Lender Profile', icon: 'material-symbols:manage-accounts-outline-rounded', isMargin: true },
    { name: 'My Bookings', icon: 'material-symbols:checklist' },
    { name: 'Booking History', icon: 'material-symbols:schedule-outline' },
    { name: 'Favourite List', icon: 'material-symbols:favorite-outline' },
    { name: 'Settings', to: '/user-profile', value: { opt: 'settings' }, icon: 'material-symbols:settings-outline-rounded' },
    { name: 'Help Center', to: '/help-center', icon: 'material-symbols:help-outline' },
    { name: 'Reports & Dispute',to: '/reports', icon: 'material-symbols:flag-outline' },
]);

const isUserLoggedIn = computed(() => {
    return authStore.isAuthenticated;
});

onMounted(async () => {
    isClientReady.value = true;
    window.addEventListener("scroll", handleScroll);

    // Load only categories that are part of active navigations and distribute them by section
    await getCategories();
});

onBeforeUnmount(() => {
    window.removeEventListener("scroll", handleScroll);
});

const handleScroll = () => {
    let st = window.pageYOffset || document.documentElement.scrollTop;
    if (st > lastScrollTop.value) {
        if (st > 100) {
            isNavigationVisible.value = false;
        }
    } else {
        isNavigationVisible.value = true;
    }
    lastScrollTop.value = st <= 0 ? 0 : st;
};

const hideMobileNavBar = () => {
    isMobileNavigationOpen.value = false;
};

const getCategories = async () => {
    try {
        const response = await apiService.request(API_ENDPOINTS.NAVIGATION.GET_ALL);
        const navItems = Array.isArray(response) ? response : [];
        const navCategories = navItems
            .map(item => item.category)
            .filter(Boolean);

        categories.value = navCategories;

        // clear per-section arrays
        rentCategories.value = [];
        hireCategories.value = [];
        buyCategories.value = [];

        // helper to add category to a targetRef if not already present
        const pushIfMissing = (targetRef, cat) => {
            if (!targetRef.value.find((c) => c.id === cat.id)) targetRef.value.push(cat);
        };

        const ALL_SECS = ['rent', 'hire', 'buy'];

        // Distribute: a category appears under a section only if:
        //  1) navigation enables that section (navSections contains it OR navSections === undefined meaning global)
        //  2) category itself belongs to that section (category.sections empty/undefined => global)
        const navEntries = navItems
            .map((item) => ({
                category: item.category,
                navSections: item.sections,
            }))
            .filter(({ category }) => Boolean(category));

        navEntries.forEach(({ category, navSections }) => {
            const navActiveSecs = navSections && navSections.length ? navSections : ALL_SECS;
            const catAllowedSecs = Array.isArray(category.sections) && category.sections.length ? category.sections : ALL_SECS;
            const finalSecs = navActiveSecs.filter((s) => catAllowedSecs.includes(s));
            finalSecs.forEach((s) => {
                if (s === 'rent') pushIfMissing(rentCategories, category);
                else if (s === 'hire') pushIfMissing(hireCategories, category);
                else if (s === 'buy') pushIfMissing(buyCategories, category);
            });
        });
    } catch (error) {
        console.error('Error fetching navigation items:', error);
    }
};

// Per-section categories are now derived from active Navigations (see `getCategories`).

const toggleProfileOptions = (index) => {
    const selectedOption = profileOptions[index];
    profileOptState.value = selectedOption.name;
    
    // Navigate to specific route if 'to' property exists, otherwise go to profile
    if (selectedOption.to) {
        router.push(selectedOption.to);
    } else {
        router.push('/user/profile');
    }
};

const logout = async () => {
    isLoading.value = true;
    try {
        const payload = {
            refreshToken: authStore.refreshToken
        };
        await apiService.request(API_ENDPOINTS.AUTH.LOGOUT, payload);
        authStore.clearTokens();
        router.push('/landing');
    } catch (error) {
        toast.add({
            title: error.code === 401 ? 'Unauthorized!' : 'Error!',
            description: error.code === 401 ? error.message : 'Something went wrong. Please try again.',
            icon: 'i-heroicons-exclamation-circle-solid',
            color: 'red',
        });
    }
    isLoading.value = false;
};

</script>

<style scoped>
.nav-items .router-link-active:not(.category-item) {
    position: relative;
}

.nav-items .router-link-active:not(.category-item)::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    right: 0;
    height: 3px;
    background-color: #FE7F0E;
    border-radius: 2px;
}

/* navigation transition */
.nav-transition-enter-from,
.nav-transition-leave-to {
    top: -100px;
    opacity: 0;
}

.nav-transition-enter-active,
.nav-transition-leave-active {
    transition: all .3s ease;
}
</style>
