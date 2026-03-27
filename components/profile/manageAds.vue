<template>
    <div>
        <div class="container pt-4">
            <div class="flex items-center justify-between mb-6">
                <p class="text-2xl font-bold">Manage Ads</p>
                
                <!-- Section Filter -->
                <select 
                    v-model="sectionFilter"
                    @change="getAds"
                    class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sec focus:border-sec outline-none">
                    <option value="">All Sections</option>
                    <option value="rent">Rent</option>
                    <option value="hire">Hire</option>
                    <option value="buy">Buy</option>
                </select>
            </div>
            
            <SkeletonManageAds v-if="isLoading" v-for="n in 10" :key="n"/>
            <p v-if="!isLoading && ads.length === 0" class="py-24 text-center">No items found</p>
            <div v-for="(item, index) in ads" :key="index" class="mb-5">
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-3">
                        <span class="mb-2 font-semibold">{{ item.title }}</span>
                        <span :class="getSectionBadgeClass(item.section)" class="px-2 py-1 text-xs rounded-full">
                            {{ getSectionLabel(item.section) }}
                        </span>
                    </div>
                    <span class="text-prim font-bold">${{ formatPrice(item) }}</span>
                </div>
                <div class="flex gap-3">
                    <div class="w-[200px] h-[150px] flex-shrink-0 relative">
                        <span v-if="item.isDraft" class="px-1 text-[12px] text-white border border-blue-500 rounded-xl absolute top-1 left-1 bg-blue-300">Draft</span>
                        <span v-else class="px-1 text-[12px] text-white border rounded-xl absolute top-1 left-1" :class="item.status === 'pending' ? 'border-red-500 bg-red-300 text-red-500' : 'border-green-500 bg-green-300 text-green-500'">{{ item.status }}</span>
                        <img class="w-full h-full object-cover" :src="resolveAdImage(item.mainImage)" alt="">
                    </div>
                    <div class="flex-1">
                        <p class="text-sm text-gray-600 mb-2">{{ item.description }}</p>
                        <div class="text-xs text-gray-500 space-y-1">
                            <p v-if="item.city"><UIcon name="i-heroicons:map-pin" class="inline"/> {{ item.city }}, {{ item.country || 'N/A' }}</p>
                            <p><UIcon name="i-heroicons:eye" class="inline"/> {{ item.views || 0 }} views</p>
                            <p><UIcon name="i-heroicons:calendar" class="inline"/> Posted {{ formatDate(item.createdDate) }}</p>
                        </div>
                    </div>
                </div>
                <div class="my-3 flex justify-end gap-2 items-center">
                    <!-- Delete always -->
                    <BtnPrimary size="lg" :is-block="false" icon="material-symbols:delete-outline-rounded" variant="outline" color="red" @click="deleteAd(item.id)" />

                    <!-- Edit always -->
                    <BtnPrimary size="lg" :is-block="false" label="Edit" variant="outline" @click="openEdit(item.id)" />

                    <!-- For drafts (including pending) show Post Now, for current ads show status dropdown -->
                    <BtnPrimary v-if="item.isDraft || item.status === 'pending'" size="lg" :is-block="false" label="Post Now" color="green" variant="outline" @click="openPublish(item.id)" />
                    <SelectInput v-else :modelValue="item.status" :options="statusOptions" @update:modelValue="val => changeStatus(item.id, val)" />
                </div>
                <UDivider />
            </div>
        </div>
        <DeleteConfirmation 
            :is-visible="showDeleteModal" 
            @close-popup="showDeleteModal = false" 
            @confirm="confirmDelete" 
        />
        <PublishConfirmation
            :is-visible="showPublishModal"
            @close-popup="showPublishModal = false"
            @confirm="confirmPublish"
        />
        <EditConfirmation
            :is-visible="showEditModal"
            @close-popup="showEditModal = false"
            @confirm="confirmEdit"
        />
        <SuccessConfirmation
            :is-visible="showSuccessModal"
            @close-popup="showSuccessModal = false"
            :message="successMessage"
        />
        <ErrorConfirmation
            :is-visible="showErrorModal"
            @close-popup="showErrorModal = false"
            :message="errorMessage"
            @tryAgain="onTryAgain"
        />
    </div>
</template>

<script setup>
import { apiService } from '../../services/apiService';
import { API_ENDPOINTS } from '@/utils/constants/api';
import SkeletonManageAds from '@/components/loaders/skeleton/manageAds.vue';
import BtnPrimary from '@/components/ui/buttons/button-primary.vue';
import SelectInput from '@/components/ui/inputs/select.vue';
import DeleteConfirmation from '@/components/popups/deleteConfirmation.vue';
import PublishConfirmation from '@/components/popups/publishConfirmation.vue';
import EditConfirmation from '@/components/popups/editConfirmation.vue';
import SuccessConfirmation from '@/components/popups/successConfirmation.vue';
import ErrorConfirmation from '@/components/popups/errorConfirmation.vue';

const isLoading = ref(true);
const ads = ref([]);
const sectionFilter = ref('');
const props = defineProps({
    filter: {
        type: String,
        default: 'current'
    }
});
const toast = useToast();
const emits = defineEmits(['counts-updated']);
const showDeleteModal = ref(false);
const deleteAdId = ref(null);

// popup state for other confirmations
const showPublishModal = ref(false);
const showEditModal = ref(false);
const showSuccessModal = ref(false);
const showErrorModal = ref(false);
const currentAdId = ref(null);
const successMessage = ref('');
const errorMessage = ref('');

onMounted(() => {
    getAds();
});

watch(() => props.filter, () => {
    getAds();
});

const getSectionLabel = (section) => {
    const labels = {
        'rent': 'Rent',
        'hire': 'Hire',
        'buy': 'Buy'
    };
    return labels[section] || section;
};

const getSectionBadgeClass = (section) => {
    const classes = {
        'rent': 'bg-blue-100 text-blue-800',
        'hire': 'bg-green-100 text-green-800',
        'buy': 'bg-purple-100 text-purple-800'
    };
    return classes[section] || 'bg-gray-100 text-gray-800';
};

const formatPrice = (item) => {
    if (item.price) {
        return item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    if (item.details?.fundingGoal) {
        return item.details.fundingGoal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    if (item.details?.askingPrice) {
        return item.details.askingPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return '0.00';
};

const formatDate = (date) => {
    if (!date) return 'Unknown';
    const d = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now - d);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return d.toLocaleDateString();
};

const resolveAdImage = (imageName) => {
    const value = String(imageName || '').trim();
    if (!value || value.toLowerCase() === 'undefined' || value.toLowerCase() === 'null') {
        return '/demo/images/placeholder.jpg';
    }
    return value.startsWith('http') ? value : '/demo/images/placeholder.jpg';
};

const getAds = async () => {
    isLoading.value = true;
    try {
        const params = {
            sortBy: 'createdDate:desc',
            limit: 100,
            ...(sectionFilter.value ? { section: sectionFilter.value } : {}),
        };
        const response = await apiService.request(API_ENDPOINTS.ADS.GET_USER_ADS, {}, params);
        let list = response.results || [];
        if (props.filter === 'draft') {
            // Drafts include explicit drafts and pending ads
            list = list.filter(a => a.isDraft || a.status === 'pending');
        } else if (props.filter === 'current') {
            // Current includes posted ads that are live or awaiting approval
            list = list.filter(a => a.status === 'active' || a.status === 'inactive' || a.status === 'pending');
        }
        ads.value = list;
    } catch (error) {
        toast.add({
            title: error.code === 401 ? 'Unauthorized!' : 'Error!',
            description: error.code === 401 ? error.message : 'Something went wrong. Please try again.',
            icon: 'i-heroicons-exclamation-circle-solid',
            color: 'red',
        });
    }
    isLoading.value = false;
}

const deleteAd = (id) => {
    deleteAdId.value = id;
    showDeleteModal.value = true;
}

const confirmDelete = async () => {
    try {
        await apiService.request(API_ENDPOINTS.ADS.DELETE_AD(deleteAdId.value), {}, { id: deleteAdId.value });
        toast.add({
            title: 'Success!',
            description: 'Ad deleted successfully',
            icon: 'i-heroicons-check-circle-solid',
            color: 'green',
        });
        // Refresh the ads list
        await getAds();
        emits('counts-updated');
    } catch (error) {
        toast.add({
            title: 'Error!',
            description: error.message || 'Something went wrong. Please try again.',
            icon: 'i-heroicons-exclamation-circle-solid',
            color: 'red',
        });
    }
}

const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' }
];

const changeStatus = async (id, newStatus) => {
    // Update local state optimistically
    const idx = ads.value.findIndex ? ads.value.findIndex(a => a.id === id) : -1;
    let prevStatus = null;
    if (idx >= 0) {
        prevStatus = ads.value[idx].status;
        ads.value[idx].status = newStatus;
    }
    try {
        // User route expects status in the request body: PATCH /ads/:adId with { status }
        await apiService.request({ method: 'PATCH', url: `/ads/${id}`, requireAuth: true }, { status: newStatus });
        toast.add({ title: 'Status updated', description: `Status set to ${newStatus}`, color: 'green', icon: 'i-heroicons-check-circle-solid' });
        emits('counts-updated');
    } catch (err) {
        // revert
        if (idx >= 0) ads.value[idx].status = prevStatus;
        toast.add({ title: 'Error', description: err.message || 'Failed to update status', color: 'red', icon: 'i-heroicons-exclamation-circle-solid' });
    }
}

const openPublish = (id) => {
    currentAdId.value = id;
    showPublishModal.value = true;
}

const confirmPublish = async () => {
    // Attempt to publish the draft by setting isDraft to false
    const id = currentAdId.value;
    showPublishModal.value = false;
    try {
        // Attempt to set status to active via body: PATCH /ads/:adId { status: 'active' }
        await apiService.request({ method: 'PATCH', url: `/ads/${id}`, requireAuth: true }, { status: 'active' });
        successMessage.value = 'Post published successfully';
        showSuccessModal.value = true;
        await getAds();
        emits('counts-updated');
    } catch (err) {
        // backend may reject if current status is pending/blocked (server rule)
        errorMessage.value = err.message || 'Failed to publish post. Server may require approval.';
        showErrorModal.value = true;
    }
}

const openEdit = (id) => {
    currentAdId.value = id;
    showEditModal.value = true;
}

const confirmEdit = async () => {
    // Placeholder: in a real flow you might navigate to an edit page.
    showEditModal.value = false;
    successMessage.value = 'Proceed to edit page';
    showSuccessModal.value = true;
}

const onTryAgain = () => {
    // Reopen the last failed action's modal if applicable
    showErrorModal.value = false;
    if (currentAdId.value && showPublishModal.value === false) {
        // default to reopen publish for retry
        showPublishModal.value = true;
    }
}


</script>