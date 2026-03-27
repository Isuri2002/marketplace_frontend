<template>
    <BasePopup :is-popup-visible="isVisible" :show-close="false" @close-popup="closePopup">
        <template #content>
            <div class="max-w-[1200px] w-full bg-white rounded-lg shadow-xl overflow-hidden">
                <div class="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-5 flex items-center gap-3">
                    <UIcon class="text-[36px]" name="i-heroicons-check-circle-solid" dynamic />
                    <h2 class="text-2xl font-bold">Publish your post</h2>
                </div>
                <div class="px-8 py-6">
                    <p class="text-gray-700 text-lg mb-8 leading-relaxed">
                        Are you sure do you want to publish your post?
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
                            label="Publish" 
                            color="green"
                            size="lg" 
                            :is-block="false"
                            class="bg-green-600 hover:bg-green-700 transition-colors shadow-md"
                            @click="confirmPublish" 
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

const confirmPublish = () => {
    emits('confirm');
    closePopup();
};
</script>
