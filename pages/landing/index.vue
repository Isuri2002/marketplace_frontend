<template>
  <div>
    <Navigation />

    <!-- Hero Section -->
    <div class="min-h-screen mt-28 items-center justify-center px-4">
      <div class=" pt-16 text-center">
        <!-- Main Heading -->
        <h1 class="text-5xl md:text-6xl lg:text-7xl font-raleway font-light tracking-widest justify-center mb-6">
          Rent What <span class="text-[#FE7F0E]">You Need</span>
          <br />
          When You Need It
        </h1>

        <!-- Subtitle -->
        <p class="text-muted text-lg md:text-xl mb-8 max-w-4xl mx-auto leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
        </p>

        <!-- CTA Button -->
        <div class="mb-8">
          <ButtonPrimary 
            label="Get Started Now" 
            size="xl" 
            @click="handleGetStarted"
            class="px-8 py-0"
          />
        </div>

        <!-- Social Media Icons -->
        <div class="flex items-center justify-center gap-4">
          <a href="#" class="w-12 h-12 rounded-full bg-sec flex items-center justify-center text-white hover:bg-[#E56F0C] transition duration-300">
            <UIcon name="i-mdi:facebook" class="text-2xl" />
          </a>
          <a href="#" class="w-12 h-12 rounded-full bg-sec flex items-center justify-center text-white hover:bg-[#E56F0C] transition duration-300">
            <UIcon name="i-mdi:instagram" class="text-2xl" />
          </a>
          <a href="#" class="w-12 h-12 rounded-full bg-sec flex items-center justify-center text-white hover:bg-[#E56F0C] transition duration-300">
            <UIcon name="i-mdi:linkedin" class="text-2xl" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
})

import Navigation from '~/components/layout/navigation.vue'
import ButtonPrimary from '~/components/ui/buttons/button-primary.vue'
import { useAuthStore } from '@/store/index'

const authStore = useAuthStore()
const router = useRouter()

const handleGetStarted = () => {
  router.push('/')
}

onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/')
  }
})
</script>
