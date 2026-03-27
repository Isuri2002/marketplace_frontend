<template>
    <div class="relative min-h-screen pt-20">
        <!-- Blue background covering top half -->
        <div class="absolute top-0 left-0 right-0 h-[50vh] bg-[#C8E3F5]"></div>
        
        <div class="container bg-white relative mt-20 px-4 pb-20">
            <!-- Breadcrumb -->
            <Breadcrumb :items="breadcrumbItems" />

            <!-- Title -->
            <div class="px-4 md:px-12 max-w-5xl mx-auto">
                <h1 class="text-4xl font-bold text-center mb-6">Frequently Asked Questions (FAQ)</h1>

                <!-- Subtitle -->
                <p class="text-center text-muted mb-12">
                    Share your experience and report any issues. Our Feedback and Report page helps us improve and ensures a safe, reliable rental marketplace for everyone.
                </p>

                <!-- Tabs -->
                <div class="flex justify-center gap-8 mb-8 border-b">
                    <button 
                        v-for="tab in tabs" 
                        :key="tab.id"
                        @click="activeTab = tab.id"
                        :class="[
                            'pb-3 px-4 font-medium transition-colors',
                            activeTab === tab.id 
                                ? 'text-black border-b-2 border-teal-500' 
                                : 'text-gray-500 hover:text-gray-700'
                        ]"
                    >
                        {{ tab.label }}
                    </button>
                </div>

                <!-- FAQ Content -->
                <div class="space-y-4 max-w-3xl mx-auto">
                    <div 
                        v-for="(faq, index) in currentFAQs" 
                        :key="index"
                        class="border-b border-gray-200"
                    >
                        <button
                            @click="toggleFAQ(index)"
                            class="w-full flex justify-between items-center py-4 text-left hover:text-teal-600 transition-colors"
                        >
                            <span class="font-medium text-lg">{{ faq.question }}</span>
                            <svg 
                                :class="['w-5 h-5 transition-transform', openIndex === index ? 'rotate-180' : '']"
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        <div 
                            v-show="openIndex === index"
                            class="pb-4 text-gray-600 leading-relaxed"
                        >
                            {{ faq.answer }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Breadcrumb from '@/components/ui/breadcrumb.vue';

const breadcrumbItems = [
    { label: 'Home', to: '/' },
    { label: 'Frequently Asked Questions (FAQ)' }
];

const activeTab = ref('general');
const openIndex = ref(null);

const tabs = [
    { id: 'general', label: 'General' },
    { id: 'rentals', label: 'For Rentals' },
    { id: 'privacy', label: 'Privacy' }
];

const faqs = {
    general: [
        {
            question: 'What is rental market place?',
            answer: 'Rental marketplace is a platform that connects people who want to rent items with those who have items available for rent. It provides a secure and convenient way to rent various products from electronics to tools, sports equipment, and more.'
        },
        {
            question: 'How do I create account?',
            answer: 'To create an account, click on the "Sign Up" button at the top right of the page. Fill in your details including name, email, and password. Verify your email address through the confirmation link sent to your inbox, and your account will be activated.'
        },
        {
            question: 'How do I contact customer support',
            answer: 'You can contact our customer support team through multiple channels: email us at support@rentalmarketplace.com, call us at +1234567890, or use the live chat feature available on our website during business hours (9am-6pm on weekdays).'
        },
        {
            question: 'Is it free ti use Rental Marketplace',
            answer: 'Yes, creating an account and browsing listings on Rental Marketplace is completely free. We only charge a small service fee when you complete a rental transaction, which helps us maintain and improve the platform.'
        },
        {
            question: 'What is rental market place?',
            answer: 'Rental marketplace is a platform that connects people who want to rent items with those who have items available for rent. It provides a secure and convenient way to rent various products from electronics to tools, sports equipment, and more.'
        }
    ],
    rentals: [
        {
            question: 'How do I search for rentals?',
            answer: 'Use the search bar at the top of the page to enter keywords for the item you need. You can also use filters to narrow down results by category, price range, location, and availability dates to find exactly what you\'re looking for.'
        },
        {
            question: 'How do I book a rental?',
            answer: 'Once you find an item you want to rent, select your desired rental dates and click the "Book Now" button. Review the rental details, add any extras or insurance options, and proceed to payment. You\'ll receive a confirmation email with all booking details.'
        },
        {
            question: 'What payment methods are accepted?',
            answer: 'We accept all major credit and debit cards (Visa, Mastercard, American Express), PayPal, and bank transfers. All payments are processed securely through our encrypted payment gateway to ensure your financial information is protected.'
        },
        {
            question: 'Can I cancel my booking?',
            answer: 'Yes, you can cancel your booking according to the cancellation policy set by the item owner. Most listings allow free cancellation up to 48 hours before the rental start date. Check the specific cancellation terms on the listing page before booking.'
        },
        {
            question: 'Are there any hidden fees?',
            answer: 'No, we believe in complete transparency. All fees including the rental price, service fee, and any optional insurance or delivery charges are clearly displayed before you confirm your booking. The total amount you see at checkout is exactly what you\'ll pay.'
        }
    ],
    privacy: [
        {
            question: 'How does Rental Marketplace Name ensure safety?',
            answer: 'We ensure safety through multiple measures: all users undergo identity verification, we provide secure payment processing, offer insurance options for rentals, have a review and rating system, and provide 24/7 customer support to handle any issues that arise.'
        },
        {
            question: 'What should I do if I encounter a fraudulent listing?',
            answer: 'If you suspect a fraudulent listing, immediately report it using the "Report" button on the listing page. Do not proceed with any transaction. Our team will investigate within 24 hours and take appropriate action. You can also contact our security team directly.'
        },
        {
            question: 'Are my payments secure?',
            answer: 'Absolutely. All payment transactions are processed through industry-standard SSL encryption. We use trusted payment processors and never store your complete credit card information. Your payment details are protected with bank-level security measures.'
        }
    ]
};

const currentFAQs = computed(() => {
    return faqs[activeTab.value] || [];
});

const toggleFAQ = (index) => {
    openIndex.value = openIndex.value === index ? null : index;
};
</script>

<style scoped>
.container {
    max-width: 1200px;
    margin: 0 auto;
}
</style>
