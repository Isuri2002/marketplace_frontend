<template>
    <div class="container min-h-screen flex flex-col justify-center items-center text-center bg-white">
        <PopupCategories :isPopupVisible="isCategoryPopupOpen" :section="currentSection" @closePopup="isCategoryPopupOpen = false" />
        <div class="flex flex-col items-center">
            <TitleSm :title="headerText" />
            <span class="mb-5">{{ descriptionText }}</span>
            <BtnPrimary @click="isCategoryPopupOpen = true" :isBlock="true" size="xl" :label="buttonLabel" />
            <div class="mt-10 flex flex-col sm:flex-row items-center gap-1 sm:gap-5 text-blue-600">
                <nuxt-link to="/rent/allowance">Know your posting allowance</nuxt-link>
                <p class="hidden sm:block">|</p>
                <nuxt-link to="/rent/rules">See our posting rules & regulations</nuxt-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import TitleSm from '@/components/ui/titles/title-sm.vue';
import BtnPrimary from '@/components/ui/buttons/button-primary.vue';
import PopupCategories from '@/components/rent/categories.vue';

definePageMeta({
    middleware: 'auth'
});

const route = useRoute();
const isCategoryPopupOpen = ref(false);

// determine section from query; default to rent
const currentSection = computed(() => route.query.section || 'rent');

const headerText = computed(() => {
    if (currentSection.value === 'hire') return "Welcome. Let's hire something...";
    if (currentSection.value === 'buy') return "Welcome. Let's buy something...";
    return "Welcome. Let's rent something...";
});

const descriptionText = computed(() => {
    if (currentSection.value === 'hire') return 'Choose service categories you want to hire';
    if (currentSection.value === 'buy') return 'Choose product categories you want to buy';
    return 'Choose item categories you want to rent';
});

const buttonLabel = computed(() => `Select ${currentSection.value.charAt(0).toUpperCase() + currentSection.value.slice(1)} Categories`);
</script>
