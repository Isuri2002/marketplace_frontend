<template>
    <div class="container nav-size-box bg-white">
        <Spinner :is-loading="isLoading"/>
        <p class="mb-5 font-bold">Fill in the details</p>
        <div class="max-w-[600px] w-full mx-auto">
            <div>
                <Input v-model="formDefaults.title" label="Title" type="text" size="lg" color="gray" :is-required="true"
                    placeholder="Title here" :error="errors.title" />
                <div class="grid grid-cols-3 gap-5">
                    <Select v-model="formDefaults.priceType" label="Price Type" size="lg" color="gray"
                        :is-required="true" placeholder="Select an option" :options="['Fixed', 'Negotiable', 'Swap/Trade']"
                        :error="errors.priceType" />
                    <Select v-model="formDefaults.rentFrequency" label="Rent Frequency" size="lg" color="gray"
                        :is-required="true" placeholder="Select an option" :options="['Hourly', 'Daily', 'Weekly', 'Monthly']"
                        :error="errors.rentFrequency" />
                    <Input v-model="formDefaults.price" label="Price" type="text" size="lg" color="gray" :is-required="true"
                        placeholder="Price here" :error="errors.price" />
                </div>
                <Area v-model="formDefaults.description" label="Description" ize="lg" color="gray" :is-required="true"
                    placeholder="Description here" :error="errors.description" />
                <div class="mb-5 grid grid-cols-2 gap-5">
                    <URadioGroup v-model="formDefaults.adType" legend="Ad type" :options="['Offered', 'Wanted']"
                        :error="errors.adType" />
                    <div class="flex items-end">
                        <UCheckbox v-model="formDefaults.isShipping" name="notifications"
                            label="Item is possible for shipping" :error="errors.isShipping" />
                    </div>
                </div>
            </div>
            <div v-if="dynamicFields.length > 0">
                <UDivider class="mb-5" />
                <p class="mb-5 font-bold">Additional Information</p>
                <div v-for="(item, index) in dynamicFields" :key="index">
                    <Input v-if="item.type === 'text' || item.type === 'number'" v-model="item.value" :label="item.label"
                        :type="item.type" size="lg" color="gray" :placeholder="item.placeholder" />
                    <Area v-if="item.type === 'textarea'" v-model="item.value" :label="item.label" size="lg" color="gray"
                        :placeholder="item.placeholder" />
                    <Select v-if="item.type === 'select'" v-model="item.value" :label="item.label" :type="item.type"
                        size="lg" color="gray" :placeholder="item.placeholder" :options="item.options" />
                    <URadioGroup v-if="item.type === 'radio'" v-model="item.value" :legend="item.label"
                        :options="item.options" />
                </div>
            </div>
            <div>
                <UDivider class="mb-5" />
                <p class="mb-5 font-bold">Location Information</p>
                <Input v-model="formDefaults.addressLine1" label="Address Line 1" type="text" size="lg" color="gray"
                    :is-required="true" placeholder="Address line 1 here" :error="errors.addressLine1" />
                <Input v-model="formDefaults.addressLine2" label="Address Line 2" type="text" size="lg" color="gray"
                    placeholder="Address line 2 here" />
                <Input v-model="formDefaults.city" label="City" type="text" size="lg" color="gray" :is-required="true"
                    placeholder="City here" :error="errors.city" />
                <Input v-model="formDefaults.zipCode" label="Postal Code" type="text" size="lg" color="gray"
                    :is-required="true" placeholder="Postal code here" :error="errors.zipCode" />
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Select Location on Map</label>
                    <div class="h-64 bg-gray-100 border border-gray-300 rounded-lg overflow-hidden">
                        <MapView
                            :latitude="selectedMapLatitude"
                            :longitude="selectedMapLongitude"
                            :zoom="selectedMapZoom"
                            :selectable="true"
                            title="Drop marker to set location"
                            @selected="setLocationFromMap"
                        />
                    </div>
                    <p class="text-sm text-gray-600 mt-1">Click on the map to set your location</p>
                    <p v-if="isLoadingAddress" class="text-sm text-blue-600 mt-1 flex items-center gap-1">
                        <UIcon name="i-heroicons:arrow-path" class="animate-spin" />
                        Fetching address details...
                    </p>
                    <p v-else-if="selectedLocation" class="text-sm text-green-600 mt-1">
                        Selected: {{ selectedLocation.lat.toFixed(6) }}, {{ selectedLocation.lng.toFixed(6) }}
                    </p>
                </div>
                <p v-if="errors.latitude" class="mb-5 text-red-600">{{ errors.latitude }}</p>
            </div>
            <div>
                <UDivider class="mb-5" />
                <p class="mb-5 font-bold">Add photos</p>
                <span class="text-[15px]">Add photos here <span class="text-red-500">*</span></span>
                <div class="mb-5 flex items-end flex-wrap gap-2">
                    <div class="relative w-[100px]">
                        <label for="mainImg"
                            class="w-[100px] h-[100px] border rounded-md cursor-pointer flex justify-center items-center overflow-hidden relative bg-[#f3f3f36c]"
                            :class="{ 'border-red-600': errors.mainImg }">
                            <img class="w-full h-full object-cover" v-if="mainImg.url !== null" :src="mainImg.url" alt="">
                            <button type="button" v-if="mainImg.url" @click="mainImgRemove()"
                                class="w-5 h-5 rounded-full flex justify-center items-center text-white bg-red-600 absolute top-1 right-1">-</button>
                            <UIcon v-if="!mainImg.url" class="text-[35px] text-light-gray"
                                :class="{ 'text-red-600': errors.mainImg }"
                                name="material-symbols:add-photo-alternate-outline-rounded" dynamic />
                            <input class="w-0 opacity-0" type="file" name="" id="mainImg" accept=".jpg, .jpeg, .png, .webp"
                                @change="(e) => mainImgUpload(e)">
                        </label>
                    </div>
                    <div v-if="mainImg.url" v-for="(item, index) in subImages" :key="index" class="relative">
                        <label :for="'img-' + index"
                            class="w-[100px] h-[100px] border rounded-md cursor-pointer flex justify-center items-center overflow-hidden relative bg-[#f3f3f36c]">
                            <img class="w-full h-full object-cover" v-if="item.url !== null" :src="item.url" alt="">
                            <button type="button" v-if="item.url" @click="subImgsRemove(index)"
                                class="w-5 h-5 rounded-full flex justify-center items-center text-white bg-red-600 absolute top-1 right-1">-</button>
                            <UIcon v-if="!item.url" class="text-[35px] text-light-gray"
                                name="material-symbols:add-photo-alternate-outline-rounded" dynamic />
                            <input class="w-0 opacity-0" type="file" name="" :id="'img-' + index"
                                accept=".jpg, .jpeg, .png, .webp" @change="(e) => subImgsUpload(e, index)">
                        </label>
                    </div>
                </div>
                <p v-if="errors.mainImg" class="mb-5 text-red-600">{{ errors.mainImg }}</p>
            </div>
            <div>
                <UDivider class="mb-5" />
                <p class="mb-5 font-bold">Contact Details</p>
                <Input v-model="formDefaults.name" label="Name" type="text" size="lg" color="gray" :is-required="true"
                    placeholder="Name here" :error="errors.name" />
                <Input v-model="formDefaults.email" label="Email" type="email" size="lg" color="gray" :is-required="true"
                    placeholder="Email here" :error="errors.email" />
                <Input v-model="formDefaults.phone" label="Phone" type="text" size="lg" color="gray" :is-required="true"
                    placeholder="Phone here" :error="errors.phone" />
                <UCheckbox v-model="formDefaults.hideContact" name="notifications" label="Hide Contact Number" />
            </div>
            <div class="my-10 flex justify-end">
                <BtnPrimary class="max-w-[300px] w-full" :isBlock="true" size="lg" label="Next" :isLoading="isLoading"
                    @click="proceedToNext()" />
            </div>
        </div>
    </div>
</template>

<script setup>
import Input from '@/components/ui/inputs/input.vue';
import Select from '@/components/ui/inputs/select.vue';
import Area from '@/components/ui/inputs/area.vue';
import BtnPrimary from '@/components/ui/buttons/button-primary.vue';
import MapView from '@/components/ui/MapView.vue';
import { rentSchema } from '@/utils/validations/rentValidation';
import { apiService } from '../../services/apiService';
import { API_ENDPOINTS } from '@/utils/constants/api';
import Spinner from '@/components/loaders/spinner.vue';
import { computed, ref, reactive, onMounted } from 'vue';

definePageMeta({
    middleware: 'auth'
});

const router = useRouter();
const toast = useToast();

const categoryData = useState('categoryData');
const formData = useState('formData');

let dynamicFields = reactive([]);
const mainImg = ref({
    file: null,
    url: null
});
let subImages = reactive([
    { file: null, url: null },
]);
const isLoading = ref(false);
const isLoadingAddress = ref(false);
const selectedLocation = ref(null);
const formDefaults = reactive({
    title: '',
    description: '',
    category: '',
    subCategory: '',
    rentFrequency: '',
    priceType: 'Fixed',
    price: '',
    adType: 'Offered',
    isShipping: false,
    addressLine1: '',
    addressLine2: '',
    city: '',
    zipCode: '',
    latitude: '',
    longitude: '',
    name: '',
    email: '',
    phone: '',
    hideContact: true,
});

const errors = reactive({
    title: '',
    description: '',
    category: '',
    subCategory: '',
    rentFrequency: '',
    priceType: '',
    price: '',
    adType: '',
    isShipping: '',
    addressLine1: '',
    city: '',
    zipCode: '',
    latitude: '',
    longitude: '',
    name: '',
    email: '',
    phone: '',
    hideContact: '',
    mainImg: '',
})

const selectedMapLatitude = computed(() => Number(selectedLocation.value?.lat) || Number(formDefaults.latitude) || 7.8731);
const selectedMapLongitude = computed(() => Number(selectedLocation.value?.lng) || Number(formDefaults.longitude) || 80.7718);
const selectedMapZoom = computed(() => (selectedLocation.value ? 13 : 7));

onMounted(() => {
    pageOnLoad();
    getUserData();
});

const pageOnLoad = () => {
    if (formData.value) {
        formDefaults.title = formData.value.title;
        formDefaults.description = formData.value.description;
        formDefaults.category = formData.value.category;
        formDefaults.subCategory = formData.value.subCategory;
        formDefaults.rentFrequency = formData.value.rentFrequency;
        formDefaults.priceType = formData.value.priceType;
        formDefaults.price = formData.value.price;
        formDefaults.adType = formData.value.adType;
        formDefaults.isShipping = formData.value.isShipping;
        formDefaults.addressLine1 = formData.value.addressLine1;
        formDefaults.addressLine2 = formData.value.addressLine2;
        formDefaults.city = formData.value.city;
        formDefaults.zipCode = formData.value.zipCode;
        formDefaults.latitude = formData.value.latitude;
        formDefaults.longitude = formData.value.longitude;
        selectedLocation.value = formData.value.selectedLocation || null;
        formDefaults.name = formData.value.name;
        formDefaults.email = formData.value.email;
        formDefaults.phone = formData.value.phone;
        formDefaults.hideContact = formData.value.hideContact;
        dynamicFields = formData.value.dynamicFields;
        mainImg.value = formData.value.mainImg;
        subImages = formData.value.subImages;
    } else if (categoryData.value) {
        formDefaults.category = categoryData.value.categoryId;
        formDefaults.subCategory = categoryData.value.subCategoryId;
        loadDynamicFields();
    } else {
        router.push('/rent');
    }
}

const loadDynamicFields = async () => {
    isLoading.value = true;
    try {
        const categoryIds = (categoryData.value.categoryIds || []).filter((id) => id);
        const response = await apiService.request(API_ENDPOINTS.DYNAMIC_FIELDS.GET, {}, { categoryIds });
        Object.assign(dynamicFields, response.dynamicFields);
        response.dynamicFields.forEach((field) => {
            field.value = '';
        });
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

const getUserData = async () => {
    isLoading.value = true;
    try {
        const response = await apiService.request(API_ENDPOINTS.AUTH.GET_USER_DATA);
        formDefaults.addressLine1 = response.userData.addressLine1 === undefined ? '' : response.userData.addressLine1;
        formDefaults.addressLine2 = response.userData.addressLine2 === undefined ? '' : response.userData.addressLine2;
        formDefaults.city = response.userData.city === undefined ? '' : response.userData.city;
        formDefaults.zipCode = response.userData.zipCode === undefined ? '' : response.userData.zipCode;
        formDefaults.name = `${response.userData.firstName || ''} ${response.userData.lastName || ''}`.trim();
        formDefaults.email = response.userData.email;
        formDefaults.phone = response.userData.phone === undefined ? '' : response.userData.phone;
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

const setLocationFromMap = async ({ latitude, longitude }) => {
    isLoadingAddress.value = true;
    try {
        const lat = Number(latitude);
        const lng = Number(longitude);

        // Update selected location
        selectedLocation.value = { lat, lng };

        // Update form coordinates
        formDefaults.latitude = lat;
        formDefaults.longitude = lng;

        // Reverse geocode to fill address fields with detailed information
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
        );
        const data = await response.json();

        if (data && data.address) {
            const address = data.address;

            // Build address line 1 with street number and street name
            const streetNumber = address.house_number || '';
            const streetName = address.road || address.street || '';
            if (streetNumber && streetName) {
                formDefaults.addressLine1 = `${streetNumber} ${streetName}`.trim();
            } else if (streetName) {
                formDefaults.addressLine1 = streetName;
            } else {
                formDefaults.addressLine1 = '';
            }

            // Build address line 2 with suburb/neighbourhood and state
            const suburb = address.suburb || address.neighbourhood || address.quarter || '';
            const state = address.state || address.region || '';
            if (suburb && state) {
                formDefaults.addressLine2 = `${suburb}, ${state}`.trim();
            } else if (suburb) {
                formDefaults.addressLine2 = suburb;
            } else if (state) {
                formDefaults.addressLine2 = state;
            } else {
                formDefaults.addressLine2 = '';
            }

            // City - try multiple fields for best match
            formDefaults.city = address.city || 
                               address.town || 
                               address.village || 
                               address.municipality || 
                               address.county || '';

            // Postal code
            formDefaults.zipCode = address.postcode || '';

            // Clear any previous errors
            errors.latitude = '';
            errors.longitude = '';
            errors.addressLine1 = '';
            errors.city = '';
            errors.zipCode = '';

            console.log('Location set successfully:', {
                coordinates: { lat, lng },
                address: formDefaults.addressLine1,
                city: formDefaults.city,
                zipCode: formDefaults.zipCode
            });
        } else {
            throw new Error('No address found for this location');
        }
    } catch (error) {
        console.error('Failed to set location from map:', error);
        errors.latitude = 'Failed to get location details. Please try again.';
        
        // Still set coordinates even if geocoding fails
        selectedLocation.value = { lat, lng };
        formDefaults.latitude = lat;
        formDefaults.longitude = lng;
    } finally {
        isLoadingAddress.value = false;
    }
};

const mainImgUpload = (event) => {
    mainImg.value.file = event.target.files[0];
    mainImg.value.url = URL.createObjectURL(mainImg.value.file);
};

const mainImgRemove = () => {
    mainImg.value = { file: null, url: null };
    if (subImages[0].url) {
        mainImg.value.url = subImages[0].url;
        mainImg.value.file = subImages[0].file;
        subImages.splice(0, 1);
    }
};

const subImgsUpload = (event, index) => {
    subImages[index].file = event.target.files[0];
    subImages[index].url = URL.createObjectURL(subImages[index].file);
    subImages[index + 1] = { file: null, url: null };
};

const subImgsRemove = (index) => {
    subImages.splice(index, 1);
};

const validateForm = () => {
    const formData = {
        ...formDefaults,
        mainImg: mainImg.value.file,
    }
    const { error } = rentSchema.validate(formData, { abortEarly: false });
    Object.keys(errors).forEach(key => errors[key] = '');
    if (error) {
        error.details.forEach(detail => {
            const field = detail.context.key;
            errors[field] = detail.message;
        });
        return false;
    }
    return true;
};

const proceedToNext = async () => {
    if (validateForm()) {
        formData.value = {
            ...formDefaults,
            selectedLocation: selectedLocation.value,
            dynamicFields: dynamicFields,
            mainImg: mainImg.value,
            subImages: subImages
        };
        router.push('/rent/post-review');
    }
};

</script>
