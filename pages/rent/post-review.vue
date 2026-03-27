<template>
    <div class="container nav-size-box bg-white">
        <div class="w-full h-[300px] mb-10">
            <img class="w-full h-full object-cover" :src="form?.mainImg.url" alt="">
        </div>
        <div>
            <div class="mb-3">
                <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sec/10 text-sec text-sm font-semibold capitalize">
                    <UIcon name="i-heroicons:tag" />{{ form?.section || 'rent' }}
                </span>
            </div>
            <div class="mb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-10">
                <span class="text-3xl">{{ form?.title }}</span>
                <span class="text-prim text-2xl font-bold">$ {{ form?.price }}
                    <span v-if="form?.section === 'rent'" class="text-light-gray font-medium"> / {{ form?.rentFrequency }}</span>
                </span>
            </div>
            <div class="mb-5">
                <p class="mb-7 text-prim">{{ form?.name }}</p>
                <div class="mb-3 flex items-center gap-2">
                    <UIcon class="text-[20px] text-prim" name="material-symbols:location-on" dynamic />
                    <p>{{ form?.addressLine1 }}, {{ form?.city }}, {{ form?.zipCode }}</p>
                </div>
                <div class="flex items-center gap-2">
                    <UIcon class="text-[20px] text-prim" name="material-symbols:call-sharp" dynamic />
                    <p>{{ form?.phone }}</p>
                </div>
            </div>
            <div class="mb-5 max-w-[600px] w-full">
                <UDivider class="mb-5" />
                <p class="mb-2 text-xl">DESCRIPTION</p>
                <p>{{ form?.description }}</p>
            </div>
            <div class="mb-5 overflow-x-auto">
                <div class="flex gap-5">
                    <div v-for="(item, index) in form?.subImages.slice(0, -1)" :key="index"
                        class="w-[200px] h-[200px] flex-shrink-0">
                        <img class="w-full h-full object-cover" :src="item.url" alt="">
                    </div>
                </div>
            </div>
            <UDivider class="mb-5" />
            <div class="mb-5 flex items-center gap-1">
                <UCheckbox v-model="agreedToTnC" name="notifications" label="I agree to the" />
                <nuxt-link to="/" class="text-sm text-blue-600 underline">Terms and Conditions</nuxt-link>
            </div>
            <div class="flex flex-wrap justify-end gap-3">
                <BtnPrimary class="max-w-[200px] w-full" :isBlock="true" size="xl" label="Edit" variant="outline"
                    @click="router.back()" />
                <BtnPrimary class="max-w-[200px] w-full" :is-disabled="draftLoad.disabled" :is-loading="draftLoad.isLoading"
                    :isBlock="true" size="xl" label="Save as draft" variant="outline" @click="createAd(true)" />
                <BtnPrimary class="max-w-[200px] w-full" :is-disabled="!agreedToTnC || postLoad.disabled"
                    :is-loading="postLoad.isLoading" :isBlock="true" size="xl" label="Post Now" @click="createAd(false)" />
            </div>
        </div>
    </div>
</template>

<script setup>
import BtnPrimary from '@/components/ui/buttons/button-primary.vue';
import { apiService } from '../../services/apiService';
import { API_ENDPOINTS } from '@/utils/constants/api';

definePageMeta({
    middleware: 'auth'
});

const toast = useToast();
const router = useRouter();

const form = useState('formData');

const draftLoad = reactive({
    disabled: false,
    isLoading: false
});
const postLoad = reactive({
    disabled: false,
    isLoading: false
})
const agreedToTnC = ref(false);

const normalizeSection = (value) => {
    const normalized = String(value || '').trim().toLowerCase();
    if (['rent', 'hire', 'buy'].includes(normalized)) return normalized;
    return 'rent';
};

onMounted(() => {
    if (!form.value) {
        router.push('/rent')
    }
});

const createAd = async (isDraft) => {
    draftLoad.disabled = isDraft ? false : true;
    draftLoad.isLoading = isDraft ? true : false;
    postLoad.disabled = !isDraft ? false : true;
    postLoad.isLoading = !isDraft ? true : false;
    try {
        const formData = new FormData();
        const section = normalizeSection(form.value?.section);
        formData.append('section', section);
        formData.append('title', form.value.title);
        formData.append('description', form.value.description);
        formData.append('category', form.value.category);
        formData.append('subCategory', form.value.subCategory);
        formData.append('rentFrequency', form.value.rentFrequency.toLowerCase());
        formData.append('priceType', form.value.priceType);
        formData.append('price', form.value.price);
        formData.append('rentType', form.value.adType.toLowerCase());
        formData.append('isShipping', form.value.isShipping);
        formData.append('addressLine1', form.value.addressLine1);
        formData.append('addressLine2', form.value.addressLine2);
        formData.append('city', form.value.city);
        formData.append('zipCode', form.value.zipCode);
        // include coordinates if available
        if (form.value.latitude !== undefined && form.value.latitude !== null) {
            formData.append('latitude', String(form.value.latitude));
        } else if (form.value.selectedLocation && form.value.selectedLocation.lat) {
            formData.append('latitude', String(form.value.selectedLocation.lat));
        }
        if (form.value.longitude !== undefined && form.value.longitude !== null) {
            formData.append('longitude', String(form.value.longitude));
        } else if (form.value.selectedLocation && form.value.selectedLocation.lng) {
            formData.append('longitude', String(form.value.selectedLocation.lng));
        }
        // Section-specific optional fields
        if (form.value.yearEstablished) formData.append('yearEstablished', form.value.yearEstablished);
        if (form.value.avgRevenueMonthly) formData.append('avgRevenueMonthly', form.value.avgRevenueMonthly);
        if (form.value.avgProfitYearly) formData.append('avgProfitYearly', form.value.avgProfitYearly);
        if (form.value.equityPercentage) formData.append('equityPercentage', form.value.equityPercentage);
        formData.append('name', form.value.name);
        formData.append('email', form.value.email);
        formData.append('phone', form.value.phone);
        formData.append('hidePhone', form.value.hideContact);
        formData.append('mainImg', form.value.mainImg.file);
        form.value.subImages
            .filter((img) => img?.file)
            .forEach((img) => {
                formData.append('subImgs', img.file);
            });
        const additionalInfo = form.value.dynamicFields.reduce((acc, field) => {
            const label = String(field?.label || '').trim();
            const value = field?.value;
            if (!label || value === undefined || value === null || String(value).trim() === '') {
                return acc;
            }
            acc[label] = String(value).trim();
            return acc;
        }, {});
        if (Object.keys(additionalInfo).length > 0) {
            formData.append('additionalInfo', JSON.stringify(additionalInfo));
        }
        formData.append('isDraft', isDraft);
        await apiService.request(API_ENDPOINTS.ADS.CREATE_AD, formData);
        toast.add({
            title: 'Success!',
            description: isDraft ? 'Ad saved as draft' : 'Ad posted successfully',
            icon: 'i-heroicons-check-circle-solid',
            color: 'green',
        });
        form.value = null;
        router.push('/user/profile');
    } catch (error) {
        toast.add({
            title: error.code === 401 ? 'Unauthorized!' : 'Error!',
            description: error.message ? error.message : 'Something went wrong. Please try again.',
            icon: 'i-heroicons-exclamation-circle-solid',
            color: 'red',
        });
    }
    draftLoad.disabled = false;
    draftLoad.isLoading = false;
    postLoad.disabled = false;
    postLoad.isLoading = false;
};
</script>
