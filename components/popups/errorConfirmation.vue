<template>
    <BasePopup :is-popup-visible="isVisible" :show-close="false" @close-popup="closePopup">
        <template #content>
            <div class="max-w-[1200px] w-full bg-white rounded-lg shadow-xl overflow-hidden border-4 border-red-500">
                <div class="px-8 py-10 text-center">
                    <h2 class="text-3xl font-bold text-red-600 mb-6">Request Error</h2>
                    <div class="flex justify-center mb-6">
                        <div class="w-32 h-32 rounded-full border-8 border-red-500 flex items-center justify-center">
                            <UIcon class="text-[64px] text-red-500" name="i-heroicons-x-mark-solid" dynamic />
                        </div>
                    </div>
                    <p class="text-gray-700 text-lg mb-8">
                        {{ message || 'Your request time out' }}
                    </p>
                    <div class="flex justify-center">
                        <BtnPrimary 
                            label="Try Again" 
                            color="red"
                            size="lg" 
                            :is-block="false"
                            class="bg-red-600 hover:bg-red-700 transition-colors shadow-md px-20"
                            @click="tryAgain" 
                        />
                    </div>
                </div>
            </div>
        </template>
    </BasePopup>
</template>

<script setup>
import BasePopup from './basePopup.vue';
import BtnPrimary from '@/components/ui/buttons/button-primary.vue';

const props = defineProps({
    isVisible: Boolean,
    message: String
});

const emits = defineEmits(['closePopup', 'tryAgain']);

const closePopup = () => {
    emits('closePopup');
};

const tryAgain = () => {
    emits('tryAgain');
    closePopup();
};
</script>
