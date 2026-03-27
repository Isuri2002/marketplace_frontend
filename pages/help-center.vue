<template>
    <div class="relative min-h-screen">
        <!-- Blue background covering top half -->
        <div class="absolute top-0 left-0 right-0 h-[50vh] bg-[#C8E3F5]"></div>
        
        <div class="container bg-white relative mt-20 px-4">
            <!-- Breadcrumb -->
            <Breadcrumb :items="breadcrumbItems" />

            <!-- Title -->
            <div class="px-12">
                <TitleLg title="Help Center" class="text-4xl text-center mb-12" />

                <!-- Illustration -->
                <div class="flex justify-center mb-16">
                    <img src="../assets/images/help-center.png" alt="Help Center" class="max-w-[300px]">
                </div>

                <!-- Help Cards -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pb-16">
                    <!-- How to Rent a Product -->
                    <div class="bg-white rounded-lg p-6 shadow-xl">
                        <TitleSm title="How to Rent a Product" class="text-prim mb-4" />
                        <p class="text-gray-500 leading-relaxed">
                            Discover how to browse, filter and book the perfect rental. From selecting dates to confirming your reservation, we guide you through every step to make renting easy and hassle-free.
                        </p>
                    </div>

                    <!-- Listing Your Product -->
                    <div class="bg-white rounded-lg p-6 shadow-xl">
                        <TitleSm title="Listing Your Product" class="text-prim mb-4" />
                        <p class="text-gray-500 leading-relaxed">
                            Ready to share your items with others? Learn how to create a compelling listing, manage availability, and set the right price to attract renters.
                        </p>
                    </div>

                    <!-- Rental Product -->
                    <div class="bg-white rounded-lg p-6 shadow-xl">
                        <TitleSm title="Rental Product" class="text-prim mb-4" />
                        <p class="text-gray-500 leading-relaxed">
                            Need to update your profile, change your password, or manage your account settings? Find all the information you need to keep your account up-to-date and secure.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import TitleLg from '@/components/ui/titles/title-lg.vue';
import TitleSm from '@/components/ui/titles/title-sm.vue';
import Breadcrumb from '@/components/ui/breadcrumb.vue';

const breadcrumbItems = [
    { label: 'Home', to: '/' },
    { label: 'Profile', to: '/user/profile' },
    { label: 'Help Center' }
];

// You can add any additional logic here if needed
</script>

<style scoped>
/* Additional styles if needed */
</style>
