<template>
    <div v-if="isReadyToRender">
        <BaseBackground>
            <template #inputs>
                <TitleLg title="Welcome" />
                <p class="mt-2 mb-10 text-light-gray">Create a new account</p>
                <Input v-model.trim="state.email" type="email" size="lg" icon="material-symbols:alternate-email" color="gray"
                    placeholder="Email address" :error="errors.email" />
                <Input v-model.trim="state.password" type="password" size="lg" icon="material-symbols:password" color="gray"
                    placeholder="Password" :error="errors.password" />
                <Input v-model.trim="state.confirmPassword" type="password" size="lg" icon="material-symbols:password"
                    color="gray" placeholder="Password confirmation" :error="errors.confirmPassword" />
                <BtnPrimary :isBlock="true" size="lg" label="Register" :isLoading="isLoading" @click="onSubmit" />
            </template>
            <template #footer>
                <div class="flex flex-col items-center">
                    <span class="text-light-gray">Already have an account?</span>
                    <nuxt-link to="/auth/login" class="text-center">Login here</nuxt-link>
                </div>
            </template>
        </BaseBackground>
    </div>
</template>
  
<script setup>
import Input from '@/components/ui/inputs/input.vue';
import BaseBackground from '@/components/auth/baseBackground.vue';
import TitleLg from '@/components/ui/titles/title-lg.vue';
import BtnPrimary from '@/components/ui/buttons/button-primary.vue';
import { registrationSchema } from '@/utils/validations/authValidation';
import { apiService } from '../../services/apiService';
import { API_ENDPOINTS } from '@/utils/constants/api';
import { useAuthStore } from '@/store/index';

const toast = useToast();
const authStore = useAuthStore();
const router = useRouter();

definePageMeta({
  middleware: 'auth',
  layout: false
});

const isReadyToRender = ref(false);
const isLoading = ref(false);
const state = reactive({
    email: '',
    password: '',
    confirmPassword: ''
});
const errors = reactive({
    email: '',
    password: '',
    confirmPassword: ''
});

onMounted(() => {
    isReadyToRender.value = !authStore.isLoading;
});

const validateForm = () => {
    const { error } = registrationSchema.validate(state, { abortEarly: false });
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

const onSubmit = async () => {
    if (validateForm()) {
        isLoading.value = true;
        const payload = {
            email: state.email,
            password: state.password
        };
        try {
            const response = await apiService.request(API_ENDPOINTS.AUTH.REGISTER, payload);
            authStore.setTokens(response.tokens.access.token, response.tokens.refresh.token);
            router.push('/');
        } catch (error) {
            toast.add({
                title: 'Error',
                description: error.message,
                icon: 'i-heroicons-exclamation-circle-solid',
                color: 'red',
            });
        }
        isLoading.value = false;
    }
}

</script>
  