<template>
  <section class="py-16">
    <div class="px-20">
      <!-- Section Title -->
      <div class="text-center mb-16">
        <span class="text-4xl md:text-5xl font-bold relative inline-block after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-2 after:w-3/5 after:h-0.5 after:bg-purple">
          <TitleLg title="Why Invest in Sri Lankan Businesses" class="!text-4xl !md:text-5xl" />
        </span>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <!-- Features List (Left Side) -->
        <div class="space-y-8">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 bg-purple text-white p-4 rounded-xl">
              <UIcon name="i-heroicons:phone" class="text-2xl" />
            </div>
            <div class="flex-1">
              <TitleSm title="Customer Support" :customClass="'!text-gray-900 !mb-2'" />
              <p class="text-gray-600 leading-relaxed">
                Our dedicated support team is available 24/7 to assist you with any inquiries or issues. We ensure a seamless experience from start to finish, prioritizing your satisfaction.
              </p>
            </div>
          </div>

          <!-- Many Locations -->
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 bg-purple text-white p-4 rounded-xl">
              <UIcon name="i-heroicons:map-pin" class="text-2xl" />
            </div>
            <div class="flex-1">
              <TitleSm title="Many Locations" :customClass="'!text-gray-900 !mb-2'" />
              <p class="text-gray-600 leading-relaxed">
                With an extensive network of rental options across multiple locations, you can easily find the perfect solution wherever you are. Enjoy the convenience of local access no matter where you travel.
              </p>
            </div>
          </div>

          <!-- Best Price Guaranteed -->
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 bg-purple text-white p-4 rounded-xl">
              <UIcon name="i-heroicons:tag" class="text-2xl" />
            </div>
            <div class="flex-1">
              <TitleSm title="Best Price Guaranteed" :customClass="'!text-gray-900 !mb-2'" />
              <p class="text-gray-600 leading-relaxed">
                We offer competitive pricing on all our rentals, ensuring you get the best value for your money. Our commitment to affordability doesn't compromise on quality or service.
              </p>
            </div>
          </div>
        </div>

        <!-- Image (Right Side) -->
        <div class="flex justify-center lg:justify-end">
          <img 
            :src="customerImage" 
            alt="Customer Support Representative" 
            class="rounded-2xl shadow-2xl w-full object-cover"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import customerImage from '~/assets/images/customer.jpg'
import TitleLg from '~/components/ui/titles/title-lg.vue'
import TitleSm from '~/components/ui/titles/title-sm.vue'
</script>


