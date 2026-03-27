<template>
    <div v-if="isReadyToRender">
        <UNotifications />
        <BaseBackground>
            <template #inputs>
                <TitleLg title="Welcome" />
                <p class="mt-2 mb-10 text-light-gray">Login to your account</p>
                <Input v-model.trim="state.email" type="email" size="lg" icon="material-symbols:alternate-email" color="gray"
                    placeholder="Email address" :error="errors.email" />
                <Input v-model.trim="state.password" type="password" size="lg" icon="material-symbols:password" color="gray"
                    placeholder="Password" :error="errors.password" />
                <BtnPrimary :isBlock="true" size="lg" label="Login" :isLoading="isLoading" @click="onSubmit" />
            </template>
            <template #footer>
                <div class="flex flex-col items-center">
                    <span class="text-light-gray">Don't have an account?</span>
                    <nuxt-link to="/auth/register" class="text-center">Register here</nuxt-link>
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
import { loginSchema } from '@/utils/validations/authValidation';
import { apiService } from '../../services/apiService';
import { API_ENDPOINTS } from '@/utils/constants/api';
import { useAuthStore } from '@/store/index';
import { useApiFeedback } from '@/composables/useApiFeedback';

const { extractErrorMessage, notifyError } = useApiFeedback();
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
});
const errors = reactive({
    email: '',
    password: '',
});

onMounted(() => {
    isReadyToRender.value = !authStore.isLoading;
});

const validateForm = () => {
    const { error } = loginSchema.validate(state, { abortEarly: false });
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
        // Clear previous queued toasts before a new attempt
        toast.clear();
        isLoading.value = true;
        const payload = {
            email: state.email,
            password: state.password
        };
        try {
            const response = await apiService.request(API_ENDPOINTS.AUTH.LOGIN, payload);
            authStore.setTokens(response.tokens.access.token, response.tokens.refresh.token);
            // Do not carry failed-login toasts into the next page
            toast.clear();
            router.push('/');
        } catch (error) {
            const message = extractErrorMessage(error, 'Login failed. Please try again.');
            const normalized = String(message).toLowerCase();
            const invalidCredentials =
                normalized.includes('invalid') ||
                normalized.includes('incorrect') ||
                normalized.includes('unauthorized') ||
                normalized.includes('email') ||
                normalized.includes('password');

            if (invalidCredentials) {
                errors.password = 'Email or password is incorrect';
            }

            notifyError(message, 'Login failed. Please try again.', 'Login failed');
        }
        isLoading.value = false;
    }
}

</script>
  