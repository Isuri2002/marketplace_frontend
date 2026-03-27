<template>
    <div>
        <BasePopup :isPopupVisible="props.isPopupVisible" :max-width="'max-w-2xl'" @closePopup="closePopup">
            <template #content>
                <div v-if="errors.categoryFetchError" class="bg-white rounded-lg shadow-xl w-full p-6">
                    <p class="py-24 text-red-500">Error while fetching categories</p>
                </div>
                <div v-else class="bg-white rounded-lg shadow-xl w-full p-6">
                    <p class="mr-5 mb-5 font-bold">
                        Choose {{ selectedCategories.subCategories.length === 0 ? 'a category' : 'sub categories' }} you
                        want to {{ props.section === 'hire' ? 'hire' : props.section === 'buy' ? 'buy' : 'rent' }}
                    </p>
                    <div v-if="selectedCategories.subCategories.length === 0">
                        <Input v-model.trim="searchKey" type="text" size="lg" icon="ic:baseline-search" color="gray"
                            placeholder="Search" />
                        <p v-if="isLoading" class="my-24">Please wait....</p>
                        <div v-for="(item, index) in categories" :key="index">
                            <div @click="categorySelect(index)"
                                class="p-2 flex justify-start gap-5 cursor-pointer duration-300 hover:bg-[#00000017]">
                                <div class="w-7 h-7 grid place-items-center">
                                    <img :src="resolveCategoryIcon(item.icon)" />
                                </div>
                                <span class="text-blue-600">{{ item.name }}</span>
                            </div>
                        </div>
                        <button
                            v-if="!isAtRootLevel"
                            class="text-sm font-semibold text-blue-600 hover:text-blue-700"
                            @click="goBack"
                        >
                            Back
                        </button>
                    </div>

                    <div v-else>
                        <Input v-model.trim="searchKey" type="text" size="lg" icon="ic:baseline-search" color="gray"
                            placeholder="Search" />
                        <div
                            v-for="(item, index) in selectedCategories.subCategories.filter((sub) => (sub.name || '').toLowerCase().includes(searchKey.toLowerCase()))"
                            :key="index"
                        >
                            <div
                                @click="subCategorySelect(index)"
                                class="p-2 flex justify-start gap-5 cursor-pointer duration-300 hover:bg-[#00000017]"
                            >
                                <div class="w-7 h-7 grid place-items-center">
                                    <img :src="resolveCategoryIcon(item.icon)" />
                                </div>
                                <span class="text-blue-600">{{ item.name }}</span>
                            </div>
                        </div>
                        <button
                            class="text-sm font-semibold text-blue-600 hover:text-blue-700"
                            @click="selectedCategories.subCategories = []"
                        >
                            Back
                        </button>
                    </div>
                </div>
            </template>
        </BasePopup>
    </div>
</template>

<script setup>
import BasePopup from '@/components/popups/basePopup.vue';
import Input from '@/components/ui/inputs/input.vue';
import { apiService } from '../../services/apiService';
import { API_BASE_URL, API_ENDPOINTS } from '@/utils/constants/api';

const router = useRouter();

const props = defineProps({
    isPopupVisible: Boolean,
    section: {
        type: String,
        default: 'rent'
    },
    stayOnPage: {
        type: Boolean,
        default: false,
    },
});

const emits = defineEmits(['closePopup', 'categorySelected']);

const categoryData = useState('categoryData', () => ({
    categoryId: '',
    subCategoryId: '',
    categoryIds: [],
    subCategories: [],
    trail: [],
}));

const isLoading = ref(false);
const searchKey = ref('');
const errors = reactive({
    searchKey: '',
    categoryFetchError: ''
});
const allCategories = ref([]);
const categories = computed(() => {
    const sec = props.section || 'rent';
    return allCategories.value.filter(cat => {
        if (!cat.sections || cat.sections.length === 0) return true;
        return cat.sections.includes(sec);
    });
});
let selectedCategories = reactive({
    categoryId: '',
    categoryName: '',
    subCategories: [],
    subCategoryId: '',
    subCategoryName: ''
});

const nodeTrail = ref([]);

const normalizeNode = (node = {}) => {
    const iconName = typeof node.icon === 'string' ? node.icon : node.icon?.url;
    return {
        ...node,
        id: node.id || node._id,
        subCategories: Array.isArray(node.subCategories) ? node.subCategories.map(normalizeNode) : [],
        iconUrl: iconName
            ? `${API_BASE_URL}/public/uploads/category_icons/${iconName}`
            : '',
    };
};

const resolveCategoryIcon = (icon) => {
    if (!icon) return '';
    const iconName = typeof icon === 'string' ? icon.trim() : icon?.url;
    if (!iconName) return '';
    if (iconName.startsWith('http')) return iconName;
    return `${API_BASE_URL.replace(/\/$/, '')}/public/uploads/category_icons/${iconName}`;
};

const currentNodes = computed(() => {
    const parent = nodeTrail.value[nodeTrail.value.length - 1];
    const list = parent ? parent.subCategories : categories.value;
    return (list || []).map(normalizeNode);
});

const filteredNodes = computed(() => {
    const key = searchKey.value.trim().toLowerCase();
    if (!key) return currentNodes.value;
    return currentNodes.value.filter((item) => (item.name || '').toLowerCase().includes(key));
});

const isAtRootLevel = computed(() => nodeTrail.value.length === 0);

const breadcrumbTrail = computed(() => nodeTrail.value.map((item) => item.name).join(' / '));

const hasChildren = (item) => Array.isArray(item?.subCategories) && item.subCategories.length > 0;

const buildSelectionTrail = (item) => {
    const parentIds = nodeTrail.value.map((entry) => entry.id).filter(Boolean);
    return [...parentIds, item.id].filter(Boolean);
};

const saveSelection = (item) => {
    const selectedTrail = buildSelectionTrail(item);
    const rootCategoryId = selectedTrail[0] || item.id;
    const leafCategoryId = selectedTrail[selectedTrail.length - 1] || '';

    categoryData.value.categoryId = rootCategoryId;
    categoryData.value.subCategoryId = selectedTrail[selectedTrail.length - 1] || '';
    categoryData.value.subCategories = currentNodes.value;
    categoryData.value.categoryIds = selectedTrail;
    categoryData.value.trail = [...nodeTrail.value, item].map((entry) => ({
        id: entry.id,
        name: entry.name,
    }));

    navigateToSectionForm(rootCategoryId, leafCategoryId);
};

const selectNode = (item) => {
    if (hasChildren(item)) {
        nodeTrail.value.push(item);
        searchKey.value = '';
        return;
    }

    saveSelection(item);
};

const goBack = () => {
    if (nodeTrail.value.length === 0) return;
    nodeTrail.value.pop();
    searchKey.value = '';
};

const getCategories = async () => {
    isLoading.value = true;
    errors.categoryFetchError = '';
    try {
        const response = await apiService.request(API_ENDPOINTS.CATEGORIES.GET);
        // store entire list, then computed will filter
        allCategories.value = response.categories || [];
    } catch (error) {
        errors.categoryFetchError = error.message;
    }
    isLoading.value = false;
};

const navigateToSectionForm = (categoryId, subCategoryId = '') => {
    categoryData.value.categoryId = categoryId || '';
    categoryData.value.subCategoryId = subCategoryId || '';

    if (props.stayOnPage) {
        emits('categorySelected', { categoryId: categoryData.value.categoryId, subCategoryId: categoryData.value.subCategoryId });
        emits('closePopup');
        return;
    }

    const formRoute = props.section === 'hire' ? '/hire/form' : props.section === 'buy' ? '/buy/form' : '/rent/form';
    router.push({
        path: formRoute,
        query: {
            section: props.section,
            categoryId: categoryId || '',
            subCategoryId: subCategoryId || '',
        },
    });
};

const categorySelect = (index) => {
    const category = categories.value[index];
    if (!category) return;
    const categoryId = category.id || category._id;
    selectedCategories.categoryId = categoryId;
    selectedCategories.categoryName = category.name;
    categoryData.value.categoryIds[0] = categoryId;

    if (category.subCategories && category.subCategories.length > 0) {
        selectedCategories.subCategories = category.subCategories;
        return;
    }

    navigateToSectionForm(categoryId);
};

const subCategorySelect = (index) => {
    const sub = selectedCategories.subCategories[index];
    if (!sub) return;
    const subId = sub.id || sub._id;

    if (sub.subCategories && sub.subCategories.length > 0) {
        selectedCategories.subCategories = sub.subCategories;
        return;
    }

    selectedCategories.subCategoryId = subId;
    selectedCategories.subCategoryName = sub.name;
    categoryData.value.subCategories = selectedCategories.subCategories;
    categoryData.value.categoryIds[1] = selectedCategories.subCategoryId;

    navigateToSectionForm(selectedCategories.categoryId, selectedCategories.subCategoryId);
};

const closePopup = () => {
    emits('closePopup');
    searchKey.value = '';
    errors.searchKey = '';
    nodeTrail.value = [];
    selectedCategories.subCategories = [];
};

onMounted(() => {
    getCategories();
});
</script>
