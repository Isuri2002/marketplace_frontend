<template>
  <div class="min-h-screen md:min-h-[120vh] flex items-center justify-center relative overflow-hidden">
    <!-- Background Image Slot -->
    <div class="absolute inset-0 z-0">
      <slot name="background-image">
        <!-- use CSS background so image height matches the viewport (auto width, 100vh height) -->
        <div class="absolute inset-0 bg-cover bg-top bg-no-repeat" :style="{ backgroundImage: `url(${heroImage})`, backgroundPosition: 'top center' }"></div>
      </slot>
    </div>

    <!-- Content Container -->
    <div class="absolute z-10 container top-24 md:top-28 left-10 text-purple font-bold">
      <slot name="content">
        <h1 class="text-4xl md:text-6xl font-md mb-4">
          <p class="leading-tight md:leading-snug">Discover the Latest Products <br>
            in our <span class="text-sec">Rental Marketplace.</span>
            </p>
        </h1>
        
      </slot>
    </div>
    <SearchBar @search="performSearch" class="absolute z-10 bottom-60"/>
  </div>
</template>

<script setup>
import heroImage from '~/assets/images/hero-hire.png'
import SearchBar from '../common/SearchBar.vue';

</script>

