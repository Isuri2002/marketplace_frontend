<template>
    <div v-if="isReadyToRender" class="container nav-size-box bg-white">
        <div class="flex flex-col sm:flex-row justify-between items-start gap-10">
            <div class="max-w-[250px] md:max-w-[300px] w-full sticky top-16 hidden sm:block">
                <div v-for="(item, index) in profileOptions" :key="index">
                    <div @click="selectProfileOption(index)" class="px-3 py-4 flex items-center gap-3 font-bold cursor-pointer duration-300 hover:bg-[#00000010]"
                        :class="item.isSelected ? 'text-prim' : 'text-[gray]'">
                        <UIcon class="text-[25px]" :name="item.icon" dynamic />
                        <p>{{ item.name }}</p>
                    </div>
                    <div v-if="item.name === 'Manage Ads' && item.isSelected" class="pl-8">
                        <div @click="selectManageSub('current')" class="px-3 py-2 cursor-pointer hover:bg-[#00000010]" :class="manageFilter === 'current' ? 'text-prim font-semibold' : ''">
                            <p>({{ currentAdsCount }}) Current Ads</p>
                        </div>
                        <div @click="selectManageSub('draft')" class="px-3 py-2 cursor-pointer hover:bg-[#00000010]" :class="manageFilter === 'draft' ? 'text-prim font-semibold' : ''">
                            <p>({{ draftAdsCount }}) Draft Ads</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="w-full block sm:hidden sticky top-[50px] overflow-x-auto z-10 drop-shadow-md">
                <div class="w-[800px] grid grid-cols-4">
                    <div v-for="(item, index) in profileOptions" :key="index">
                        <div @click="selectProfileOption(index)" class="flex-shrink-0 px-3 py-5 flex justify-center items-center gap-3 font-bold cursor-pointer duration-300 bg-white hover:bg-[#00000010]"
                            :class="item.isSelected ? 'text-prim' : 'text-[gray]'">
                            <UIcon class="text-[25px]" :name="item.icon" dynamic />
                            <p>{{ item.name }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="w-full">
                <ManageAds v-if="profileOptions.find(opt => opt.name === 'Manage Ads').isSelected" :filter="manageFilter" @counts-updated="fetchAdsCounts" />
                <FavAds v-if="profileOptions.find(opt => opt.name === 'Favourite List').isSelected"/>
                <ProfileSettings v-if="profileOptions.find(opt => opt.name === 'Profile Settings').isSelected"/>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useAuthStore } from '@/store/index';
import ManageAds from '@/components/profile/manageAds.vue';
import { apiService } from '@/services/apiService';
import { API_ENDPOINTS } from '@/utils/constants/api';
import ProfileSettings from '@/components/profile/profileSettings.vue';
import FavAds from '~/components/profile/FavAds.vue';

const authStore = useAuthStore();

definePageMeta({
    middleware: 'auth'
});

const profileOptState = useState('profileState');

const isReadyToRender = ref(false);
const profileOptions = reactive([
    { name: 'Manage Ads', icon: 'material-symbols:image-outline', isSelected: false },
    { name: 'Favourite List', icon: 'material-symbols:kid-star-outline', isSelected: false },
    { name: 'Profile Settings', icon: 'material-symbols:settings-outline-rounded', isSelected: false }
]);

const manageFilter = ref('current');
const currentAdsCount = ref(0);
const draftAdsCount = ref(0);

const fetchAdsCounts = async () => {
    try {
        const res = await apiService.request(API_ENDPOINTS.ADS.GET_USER_ADS, {}, {
            sortBy: 'createdDate:desc',
            limit: 100,
        });
        const list = res.results || [];
        // Drafts include explicit drafts and pending ads
        draftAdsCount.value = list.filter(a => a.isDraft || a.status === 'pending').length;
        // Current includes active, inactive, and pending posts
        currentAdsCount.value = list.filter(a => a.status === 'active' || a.status === 'inactive' || a.status === 'pending').length;
    } catch (e) {
        // ignore counts on error
    }
}

onMounted(() => {
    isReadyToRender.value = !authStore.isLoading;
    selectedProfileOption();
    fetchAdsCounts();
});

const selectedProfileOption = () => {
    const selected = profileOptions.find(opt => opt.name === profileOptState.value);
    if (selected) {
        selected.isSelected = true;
    } else {
        profileOptions[0].isSelected = true;
    }
};

const selectProfileOption = (index) => {
    profileOptions.map(opt => opt.isSelected = false);
    profileOptions[index].isSelected = true;
    // refresh counts when manage ads selected
    if (profileOptions[index].name === 'Manage Ads') {
        fetchAdsCounts();
    }
};

const selectManageSub = (type) => {
    manageFilter.value = type; // 'current' or 'draft'
}
</script>