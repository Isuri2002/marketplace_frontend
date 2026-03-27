<template>
    <BasePopup :is-popup-visible="isVisible" :show-close="false" @close-popup="closePopup">
        <template #content>
            <div class="max-w-[1200px] w-full bg-white rounded-lg shadow-xl overflow-hidden">
                <div class="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-5 flex items-center gap-3">
                    <UIcon class="text-[36px] animate-pulse" name="i-heroicons-exclamation-triangle-solid" dynamic />
                    <h2 class="text-2xl font-bold">Confirm Deletion</h2>
                </div>
                <div class="px-8 py-6">
                    <p class="text-gray-700 text-lg mb-8 leading-relaxed">
                        Are you sure you want to delete this post?
                    </p>
                    <div class="flex justify-end gap-4">
                        <BtnPrimary 
                            label="Cancel" 
                            variant="outline" 
                            size="lg" 
                            :is-block="false"
                            class="hover:bg-gray-50 transition-colors"
                            @click="closePopup" 
                        />
                        <BtnPrimary 
                            label="Delete" 
                            color="red"
                            size="lg" 
                            :is-block="false"
                            class="bg-red-600 hover:bg-red-700 transition-colors shadow-md"
                            @click="confirmDelete" 
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
    isVisible: Boolean
});

const emits = defineEmits(['closePopup', 'confirm']);

const closePopup = () => {
    emits('closePopup');
};

const confirmDelete = () => {
    emits('confirm');
    closePopup();
};
</script>
