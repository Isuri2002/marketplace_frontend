<template>
    <div class="relative min-h-screen">
        <!-- Blue background covering top half -->
        <div class="absolute top-0 left-0 right-0 h-[50vh] bg-[#C8E3F5]"></div>
        
        <div class="container bg-white relative mt-20 px-4 pb-20">
            <!-- Breadcrumb -->
            <Breadcrumb :items="breadcrumbItems" />

            <!-- Title -->
            <div class="px-4 md:px-12 max-w-5xl mx-auto">
                <h1 class="text-4xl font-bold text-center mb-12">Contact Us</h1>

                <!-- Illustration -->
                <div class="flex justify-center mb-12">
                    <img src="../../assets/images/contact.png" alt="Contact Us" class="max-w-[300px]">
                </div>

                <!-- Info Text -->
                <div class="text-center mb-8 text-muted">
                    <p>Check out our <span class="text-sec font-semibold">FAQ's</span> and <span class="text-orange-500 font-semibold">Safe Section</span> sections to see if your question has already been answered.</p>
                    <p class="mt-1">If not, please get in touch with us and we will get back to you as soon as possible.</p>
                </div>

                <!-- You can call or email us -->
                <div class="text-center mb-4">
                    <h2 class="text-xl font-semibold mb-3">You can call or email us</h2>
                    <p class="text-muted">9am - 6pm on weekdays</p>
                    <p class="text-muted">8am - 5pm on weekends and mercantile holidays</p>
                </div>

                <!-- Contact Cards -->
                <div class="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mt-8">
                    <!-- Call Us Card -->
                    <div class="bg-gradient-to-r from-[#E0F4F4] via-[#E0F4F4] to-[#f8f8f8] rounded-lg p-8 text-center">
                        <h3 class="text-lg font-semibold mb-6">Call Us</h3>
                        <div class="flex justify-center mb-4">
                            <img :src="callImage" alt="Call Us" class="h-16 w-16">
                        </div>
                        <a href="tel:+94315454454" class="text-secs font-semibold text-lg hover:underline">+9431 5454 454</a>
                    </div>

                    <!-- Email Us Card -->
                    <div class="bg-gradient-to-r from-[#E0F4F4] via-[#E0F4F4] to-[#f8f8f8] rounded-lg p-8 text-center">
                        <h3 class="text-lg font-semibold mb-6">Email Us</h3>
                        <div class="flex justify-center mb-4">
                            <img :src="emailImage" alt="Email Us" class="h-16 w-16">
                        </div>
                        <a href="mailto:Marketplace@gmail.com" class="text-sec font-semibold text-lg hover:underline">Marketplace@gmail.com</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Breadcrumb from '@/components/ui/breadcrumb.vue';
import callImage from '~/assets/images/call.png';
import emailImage from '~/assets/images/email.png';

const breadcrumbItems = [
    { label: 'Home', to: '/' },
    { label: 'Contact Us' }
];
</script>

<style scoped>
/* Additional styles if needed */
</style>
