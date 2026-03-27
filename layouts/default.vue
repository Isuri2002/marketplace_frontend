<template>
    <div class="min-h-screen bg-[#f5f5f5]">
        <NavigationBar />
        <div>
            <UNotifications />
            <slot />
        </div>
        <Footer />
    </div>
</template>

<script setup>
import NavigationBar from '@/components/layout/navigation.vue';
import Footer from '~/components/layout/Footer.vue';

</script>