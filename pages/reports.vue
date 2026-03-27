<template>
    <div class="relative ">
        <!-- Blue background covering top half -->
        <div class="absolute top-0 left-0 right-0 h-[50vh] bg-[#C8E3F5]"></div>

        <div class="container bg-white relative mt-20 px-4 ">
            <!-- Breadcrumb -->
            <Breadcrumb :items="breadcrumbItems" />

            <!-- Title -->
            <div class="px-12 pb-12 ">
                <TitleLg title="Reports & Disputes" class="text-4xl text-center mb-12 pt-4" />

                <div class="shadow-xl rounded-lg px-4 pb-20 relative">
                    <TitleSm title="Report here" class="text-prim text-center my-8" />

                    <p class="text-center text-muted mb-8">Share your experience and report any issues. Our Feedback and Report page helps us 
                    improve and ensures a safe, reliable rental marketplace for everyone.</p>

                    <Area v-model="reportText" placeholder="Type Your words(Maximum 100 words)" label="Send Report or Feedback" :margin-bottom="true"/>

                    <div class="absolute bottom-4 right-4 ">
                        <ButtonPrimary label="Send Report" />
                    </div>                  

                </div>               

            </div>
        </div>
    </div>
</template>

<script setup>
    import TitleLg from '@/components/ui/titles/title-lg.vue';
    import TitleSm from '@/components/ui/titles/title-sm.vue';
    import Area from '@/components/ui/inputs/area.vue';
    import ButtonPrimary from '@/components/ui/buttons/button-primary.vue';
    import Breadcrumb from '@/components/ui/breadcrumb.vue';

    const breadcrumbItems = [
        { label: 'Home', to: '/' },
        { label: 'Profile', to: '/user/profile' },
        { label: 'Reports & Disputes' }
    ];

    const reportText = ref('');

    // You can add any additional logic here if needed
</script>
