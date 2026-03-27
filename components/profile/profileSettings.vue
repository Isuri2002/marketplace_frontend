<template>
    <div>
        <Spinner :is-loading="isLoading"/>
        <div class="container pt-4">
            <TitleSm title="User Data" />
            <div class="max-w-[500px] w-full">
                <div class="grid grid-cols-2 gap-5">
                    <Input v-model.trim="userData.firstName" type="text" size="lg" label="First Name" color="gray"
                        placeholder="John" :error="errors.firstName" />
                    <Input v-model.trim="userData.lastName" type="text" size="lg" label="Last Name" color="gray"
                        placeholder="Doe" :error="errors.lastName" />
                </div>
                <Input v-model.trim="userData.addressLine1" type="email" size="lg" label="Address Line 1" color="gray"
                    placeholder="Address Line 1" :error="errors.addressLine1" />
                <Input v-model.trim="userData.addressLine1" type="email" size="lg" label="Address Line 2" color="gray"
                    placeholder="Address Line 2" :error="errors.addressLine2" />
                <div class="grid grid-cols-2 gap-5">
                    <Input v-model.trim="userData.city" type="text" size="lg" label="City" color="gray" placeholder="Perth"
                        :error="errors.city" />
                    <Input v-model.trim="userData.zipCode" type="number" size="lg" label="Zip Code" color="gray"
                        placeholder="20000" :error="errors.zipCode" />
                </div>
                <BtnPrimary :isDisabled="JSON.stringify(userData) === initialUserData" :isBlock="true" size="lg"
                    label="Save" :isLoading="loaders.isUserDataLoading" @click="updateUserData()" />
            </div>
        </div>
        <div class="container">
            <TitleSm title="Change Password" />
            <div class="max-w-[500px] w-full">
                <Input v-model.trim="passwords.oldPassword" type="password" size="lg" label="Old Password" color="gray"
                    placeholder="Old Password" :error="errors.oldPassword" />
                <Input v-model.trim="passwords.newPassword" type="password" size="lg" label="New Password" color="gray"
                    placeholder="New Password" :error="errors.newPassword" />
                <Input v-model.trim="passwords.confirmPassword" type="password" size="lg" label="Confirm Password"
                    color="gray" placeholder="Confirm Password" :error="errors.confirmPassword" />
                <BtnPrimary :isBlock="true" size="lg" label="Save" :isLoading="loaders.isPasswordLoading"
                    @click="changePassword()" />
            </div>
        </div>
    </div>
</template>

<script setup>
import Input from '@/components/ui/inputs/input.vue';
import TitleSm from '@/components/ui/titles/title-sm.vue';
import BtnPrimary from '@/components/ui/buttons/button-primary.vue';
import { apiService } from '../../services/apiService';
import { API_ENDPOINTS } from '@/utils/constants/api';
import { changePasswordSchema } from '@/utils/validations/authValidation';
import { useAuthStore } from '@/store/index';
import Spinner from '@/components/loaders/spinner.vue';

const toast = useToast();
const authStore = useAuthStore();
const router = useRouter();

const isLoading = ref(true);
const userData = reactive({
    firstName: '',
    lastName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    zipCode: '',
});
const initialUserData = ref('');
const passwords = reactive({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
})
const loaders = reactive({
    isUserDataLoading: false,
    isPasswordLoading: false,
})
const errors = reactive({
    firstName: '',
    lastName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    zipCode: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
});

onMounted(() => {
    getUserData();
});

const getUserData = async () => {
    isLoading.value = true;
    try {
        const response = await apiService.request(API_ENDPOINTS.AUTH.GET_USER_DATA);
        userData.firstName = response.userData.firstName;
        userData.lastName = response.userData.lastName;
        userData.addressLine1 = response.userData.addressLine1;
        userData.addressLine2 = response.userData.addressLine2;
        userData.city = response.userData.city;
        userData.zipCode = response.userData.zipCode;
        initialUserData.value = JSON.stringify(userData);
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

const updateUserData = async () => {
    try {
        loaders.isUserDataLoading = true;
        await apiService.request(API_ENDPOINTS.AUTH.UPDATE_USER_DATA, {
            firstName: userData.firstName,
            lastName: userData.lastName,
            addressLine1: userData.addressLine1,
            addressLine2: userData.addressLine2,
            city: userData.city,
            zipCode: userData.zipCode
        });
        toast.add({
            title: 'Success!',
            description: 'User data updated successfully.',
            icon: 'i-heroicons-check-circle-solid',
            color: 'green',
        });
    } catch (error) {
        toast.add({
            title: error.code === 401 ? 'Unauthorized!' : 'Error!',
            description: error.message ? error.message : 'Something went wrong. Please try again.',
            icon: 'i-heroicons-exclamation-circle-solid',
            color: 'red',
        });
    }
    loaders.isUserDataLoading = false;
    initialUserData.value = JSON.stringify(userData);
};

const validatePasswords = () => {
    const { error } = changePasswordSchema.validate(passwords, { abortEarly: false });
    // Clear previous errors
    Object.keys(errors).forEach(key => errors[key] = '');
    if (error) {
        // Populate errors from validation details
        error.details.forEach(detail => {
            const field = detail.context.key;
            errors[field] = detail.message;
        });
        return false;
    }
    return true;
};

const changePassword = async () => {
    if (validatePasswords()) {
        loaders.isPasswordLoading = true;
        try {
            await apiService.request(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
                oldPassword: passwords.oldPassword,
                newPassword: passwords.newPassword
            });
            passwords.oldPassword = '';
            passwords.newPassword = '';
            passwords.confirmPassword = '';
            toast.add({
                title: 'Success!',
                description: 'Password changed successfully. Please login again with your new password.',
                icon: 'i-heroicons-check-circle-solid',
                color: 'green',
            });
            authStore.clearTokens()
            setTimeout(() => {
                router.push('/auth/login');
            }, 5000);
        } catch (error) {
            toast.add({
                title: error.code === 401 ? 'Unauthorized!' : 'Error!',
                description: error.message ? error.message : 'Something went wrong. Please try again.',
                icon: 'i-heroicons-exclamation-circle-solid',
                color: 'red',
            });
        }
        loaders.isPasswordLoading = false;
    }
};
</script>